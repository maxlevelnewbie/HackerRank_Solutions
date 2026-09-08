import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SOLUTIONS_JSON = path.join(ROOT_DIR, 'src', 'data', 'solutions.json');
const ENV_FILE = path.join(ROOT_DIR, '.env');

// Simple .env parser without external dependencies
function loadEnv() {
  if (!fs.existsSync(ENV_FILE)) return;
  const content = fs.readFileSync(ENV_FILE, 'utf-8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...rest] = trimmed.split('=');
    if (key && rest.length > 0) {
      process.env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

async function syncToSupabase() {
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id')) {
    console.log('\n[SYNC NOTE] Supabase credentials not found in .env.');
    console.log('To sync your solutions to Supabase:');
    console.log('1. Copy .env.example to .env');
    console.log('2. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY)');
    console.log('3. Run `npm run sync` again.\n');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  if (!fs.existsSync(SOLUTIONS_JSON)) {
    console.error('solutions.json not found! Run `npm run parse` first.');
    return;
  }

  const solutions = JSON.parse(fs.readFileSync(SOLUTIONS_JSON, 'utf-8'));
  console.log(`[SYNC] Connecting to Supabase (${supabaseUrl})...`);
  console.log(`[SYNC] Preparing to upload ${solutions.length} solutions...`);

  let successCount = 0;
  let failCount = 0;

  for (const sol of solutions) {
    const record = {
      title: sol.title,
      slug: sol.slug,
      language: sol.language,
      category: sol.category,
      difficulty: sol.difficulty,
      points: sol.points,
      success_rate: sol.successRate,
      code: sol.code,
      line_count: sol.lineCount,
      hackerrank_url: sol.hackerrankUrl,
      description: sol.description,
      sample_input: sol.sampleInput,
      sample_output: sol.sampleOutput
    };

    const { error } = await supabase
      .from('solutions')
      .upsert(record, { onConflict: 'slug,language' });

    if (error) {
      console.error(`  ✕ Error syncing "${sol.title}" (${sol.language}):`, error.message);
      failCount++;
    } else {
      console.log(`  ✓ Synced "${sol.title}" (${sol.language})`);
      successCount++;
    }
  }

  console.log(`\n[SYNC COMPLETE] ${successCount} synced successfully, ${failCount} errors.\n`);
}

syncToSupabase().catch(err => {
  console.error('[SYNC FATAL ERROR]', err);
});

