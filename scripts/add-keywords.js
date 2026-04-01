const fs = require('fs');
const path = require('path');
const glob = require('glob');

const docsDir = path.join(__dirname, '..', 'docs', 'api');
const files = glob.sync('**/*.md', { cwd: docsDir, absolute: true });

let updated = 0;
let skipped = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');

  // Already has keywords
  if (/^keywords:/m.test(content)) {
    skipped++;
    continue;
  }

  // Find endpoint: after ## Endpoint, inside code block
  // Supports "GET /path", "POST /path", or just "/path"
  const match = content.match(/## Endpoint[\s\S]*?```[\w]*\n\s*(?:(GET|POST|PUT|DELETE|PATCH)\s+)?(\/\S+)/);

  if (!match) {
    skipped++;
    continue;
  }

  const method = match[1] || null;
  const endpoint = match[2].split('?')[0]; // strip query params

  // Build keyword list
  const segments = endpoint.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || '';
  const keywords = [endpoint, lastSegment];
  if (method) keywords.splice(1, 0, method + ' ' + endpoint);
  const uniqueKeywords = [...new Set(keywords)];

  const keywordsYaml = 'keywords:\n' + uniqueKeywords.map(k => '  - "' + k + '"').join('\n');

  let newContent;
  if (content.startsWith('---')) {
    // Insert before closing ---
    newContent = content.replace(/^(---\n[\s\S]*?)(---)/, '$1' + keywordsYaml + '\n$2');
  } else {
    newContent = '---\n' + keywordsYaml + '\n---\n\n' + content;
  }

  fs.writeFileSync(file, newContent);
  updated++;
  console.log('Updated: ' + path.relative(docsDir, file) + ' -> ' + endpoint);
}

console.log('\nDone: ' + updated + ' updated, ' + skipped + ' skipped');
