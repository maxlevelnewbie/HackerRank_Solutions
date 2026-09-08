import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SOLUTIONS_DIR = path.join(ROOT_DIR, 'solutions');
const OUTPUT_FILE = path.join(ROOT_DIR, 'src', 'data', 'solutions.json');

// Ensure output directory exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Language extension mapping
const EXTENSION_MAP = {
  '.c': 'c',
  '.cpp': 'cpp',
  '.cc': 'cpp',
  '.cxx': 'cpp',
  '.py': 'python'
};

// Category detection heuristics
function detectCategory(title) {
  const lower = title.toLowerCase();
  if (lower.includes('array')) return 'Arrays';
  if (lower.includes('string') || lower.includes('token')) return 'Strings';
  if (lower.includes('pointer')) return 'Pointers';
  if (lower.includes('loop') || lower.includes('for_loop')) return 'Loops';
  if (lower.includes('function') || lower.includes('term')) return 'Functions';
  if (lower.includes('bitwise')) return 'Bitwise';
  if (lower.includes('condition') || lower.includes('if-else') || lower.includes('if_else')) return 'Conditionals';
  if (lower.includes('digit') || lower.includes('sum') || lower.includes('arithmetic') || lower.includes('division') || lower.includes('math')) return 'Math';
  if (lower.includes('hello') || lower.includes('data_type') || lower.includes('input_and_output') || lower.includes('print')) return 'Introduction';
  return 'General';
}

// Difficulty & points heuristics
function detectDifficultyAndPoints(title, category) {
  const lower = title.toLowerCase();
  if (lower.includes('printing_pattern') || lower.includes('variable_sized')) {
    return { difficulty: 'Hard', points: 50, successRate: '87.4%' };
  }
  if (
    lower.includes('bitwise') ||
    lower.includes('digit_frequency') ||
    lower.includes('nth_term') ||
    lower.includes('token') ||
    lower.includes('reversal') ||
    lower.includes('students_marks') ||
    lower.includes('strings')
  ) {
    return { difficulty: 'Medium', points: 25, successRate: '92.1%' };
  }
  return { difficulty: 'Easy', points: 15, successRate: '98.3%' };
}

// Clean title from filename
function cleanTitle(filename) {
  const base = path.parse(filename).name;
  return base
    .replace(/_/g, ' ')
    .replace(/!/g, '')
    .trim();
}

// Generate URL slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Pre-curated problem descriptions for common HackerRank challenges
const PROBLEM_DESCRIPTIONS = {
  'hello-world-in-c': {
    description: 'This challenge helps you practice reading input from stdin and writing output to stdout in C.',
    inputFormat: 'A single line of text containing string s.',
    outputFormat: 'Print "Hello, World!" on the first line, and string s on the second line.',
    sampleInput: 'Welcome to C programming.',
    sampleOutput: 'Hello, World!\nWelcome to C programming.'
  },
  '1d-arrays-in-c': {
    description: 'An array is a container object that holds a fixed number of values of a single type. Create an array of size n, read n integers, and print their sum.',
    inputFormat: 'First line contains integer n. Second line contains n space-separated integers.',
    outputFormat: 'Print the sum of the integers in the array.',
    sampleInput: '6\n16 13 7 2 1 12',
    sampleOutput: '51'
  },
  'array-reversal': {
    description: 'Given an array of size n, reverse the order of its elements and print the reversed array.',
    inputFormat: 'First line contains integer n. Second line contains n space-separated integers.',
    outputFormat: 'Print the array elements in reversed order, space-separated.',
    sampleInput: '4\n1 2 3 4',
    sampleOutput: '4 3 2 1'
  },
  'bitwise-operators': {
    description: 'Given integers n and k, find the maximum values of a & b, a | b, and a ^ b for all 1 <= a < b <= n where the value is less than k.',
    inputFormat: 'Single line of two space-separated integers n and k.',
    outputFormat: 'Print the three maximum values on separate lines (AND, OR, XOR).',
    sampleInput: '5 4',
    sampleOutput: '2\n3\n3'
  },
  'functions-in-c': {
    description: 'Write a function int max_of_four(int a, int b, int c, int d) to return the greatest of four given integers.',
    inputFormat: 'Input will contain four integers - a, b, c, d, one on each line.',
    outputFormat: 'Print the greatest of the four integers.',
    sampleInput: '3\n4\n6\n5',
    sampleOutput: '6'
  },
  'variable-sized-arrays': {
    description: 'Consider an n-element array where each element is an array of integers with varying sizes. Answer q queries about specific array indices.',
    inputFormat: 'First line: n and q. Next n lines: k followed by k integers. Next q lines: index i and j.',
    outputFormat: 'For each query, print the value of the element located at index j of the array at index i.',
    sampleInput: '2 2\n3 1 5 4\n5 1 2 8 9 3\n0 1\n1 3',
    sampleOutput: '5\n9'
  }
};

export function scanSolutions() {
  if (!fs.existsSync(SOLUTIONS_DIR)) {
    console.error(`Solutions directory not found at ${SOLUTIONS_DIR}`);
    return [];
  }

  const solutions = [];
  const langDirs = fs.readdirSync(SOLUTIONS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory());

  for (const langDir of langDirs) {
    const langPath = path.join(SOLUTIONS_DIR, langDir.name);
    const files = fs.readdirSync(langPath, { withFileTypes: true })
      .filter(dirent => dirent.isFile());

    for (const file of files) {
      const ext = path.extname(file.name).toLowerCase();
      const language = EXTENSION_MAP[ext] || langDir.name;
      const filePath = path.join(langPath, file.name);
      const code = fs.readFileSync(filePath, 'utf-8');
      const title = cleanTitle(file.name);
      const slug = generateSlug(title);
      const category = detectCategory(file.name);
      const { difficulty, points, successRate } = detectDifficultyAndPoints(file.name, category);
      const lineCount = code.split(/\r\n|\r|\n/).length;

      // Check for curated description or provide structured fallback
      const curated = PROBLEM_DESCRIPTIONS[slug] || {};
      const description = curated.description || `HackerRank challenge focusing on ${category.toLowerCase()} and foundational ${language.toUpperCase()} problem-solving techniques.`;
      const inputFormat = curated.inputFormat || 'Read the required inputs from standard input (stdin).';
      const outputFormat = curated.outputFormat || 'Print the computed solution to standard output (stdout).';
      const sampleInput = curated.sampleInput || '// See challenge specifications on HackerRank';
      const sampleOutput = curated.sampleOutput || '// Correct sample solution';

      solutions.push({
        id: `${language}-${slug}`,
        title,
        slug,
        language,
        category,
        difficulty,
        points,
        successRate,
        lineCount,
        code,
        description,
        inputFormat,
        outputFormat,
        sampleInput,
        sampleOutput,
        hackerrankUrl: `https://www.hackerrank.com/challenges/${slug}/problem`,
        relativePath: `solutions/${langDir.name}/${file.name}`,
        createdAt: new Date().toISOString()
      });
    }
  }

  // Sort by title alphabetically
  solutions.sort((a, b) => a.title.localeCompare(b.title));

  return solutions;
}

// Run script
const solutions = scanSolutions();
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(solutions, null, 2), 'utf-8');
console.log(`[BUILD] Successfully indexed ${solutions.length} solutions into ${OUTPUT_FILE}`);

