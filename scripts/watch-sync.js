import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chokidar from 'chokidar';
import { createClient } from '@supabase/supabase-js';
import { scanSolutions } from './build-solutions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SOLUTIONS_DIR = path.join(ROOT_DIR, 'solutions');
const SOLUTIONS_JSON = path.join(ROOT_DIR, 'src', 'data', 'solutions.json');
const ENV_FILE = path.join(ROOT_DIR, '.env');

// Simple .env reader
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
let supabase = null;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project-id')) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('[WATCHER] Connected to Supabase for live auto-sync.');
} else {
  console.log('[WATCHER] Supabase credentials not detected; updating local solutions.json on changes.');
}

console.log(`\n👁️  Watching for solution changes in: ${SOLUTIONS_DIR}`);
console.log('   Add or edit any .c, .cpp, or .py file to auto-sync!\n');

const watcher = chokidar.watch(SOLUTIONS_DIR, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true
});

watcher
  .on('add', async (filePath) => {
    console.log(`\n[EVENT] New file added: ${path.basename(filePath)}`);
    await handleFileChange(filePath);
  })
  .on('change', async (filePath) => {
    console.log(`\n[EVENT] File modified: ${path.basename(filePath)}`);
    await handleFileChange(filePath);
  })
  .on('unlink', async (filePath) => {
    console.log(`\n[EVENT] File removed: ${path.basename(filePath)}`);
    const all = scanSolutions();
    fs.writeFileSync(SOLUTIONS_JSON, JSON.stringify(all, null, 2), 'utf-8');
    console.log(`[LOCAL] Updated solutions.json (${all.length} total)`);
  });

async function handleFileChange(filePath) {
  try {
    // 1. Update local solutions.json
    const all = scanSolutions();
    fs.writeFileSync(SOLUTIONS_JSON, JSON.stringify(all, null, 2), 'utf-8');
    console.log(`[LOCAL] Updated solutions.json (${all.length} total)`);

    // 2. Sync to Supabase if connected
    if (supabase) {
      const fileName = path.basename(filePath);
      const ext = path.extname(fileName).toLowerCase();
      const langDir = path.basename(path.dirname(filePath));
      const language = ext === '.c' ? 'c' : (ext === '.py' ? 'python' : 'cpp');

      // Find matched solution
      const sol = all.find(s => s.relativePath.replace(/\\/g, '/') === path.relative(ROOT_DIR, filePath).replace(/\\/g, '/'));
      if (sol) {
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
          console.error(`[SYNC ERROR] Failed to upsert "${sol.title}":`, error.message);
        } else {
          console.log(`[SYNC SUCCESS] ✓ Auto-uploaded "${sol.title}" (${sol.language}) to Supabase!`);
        }
      }
    }
  } catch (err) {
    console.error('[WATCHER ERROR]', err);
  }
}

