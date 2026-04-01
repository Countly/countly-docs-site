/**
 * Postinstall script to patch the search plugin's client tokenizer
 * so it splits on '/' in addition to '-' and whitespace.
 * This enables prefix search on endpoint path segments
 * (e.g. "/i/feedba" → tokens "i", "feedba" → matches "feedback").
 */
const fs = require('fs');
const path = require('path');

const tokenizePath = path.join(
  __dirname,
  '..',
  'node_modules',
  '@easyops-cn',
  'docusaurus-search-local',
  'dist',
  'client',
  'client',
  'utils',
  'tokenize.js'
);

if (fs.existsSync(tokenizePath)) {
  let content = fs.readFileSync(tokenizePath, 'utf8');
  const oldRegex = '/[^-\\s]+/g';
  const newRegex = '/[^-\\s/]+/g';

  if (content.includes(oldRegex)) {
    content = content.replace(oldRegex, newRegex);
    fs.writeFileSync(tokenizePath, content);
    console.log('Patched search tokenizer to split on "/" for endpoint search');
  } else if (content.includes(newRegex)) {
    console.log('Search tokenizer already patched');
  } else {
    console.log('Warning: Could not find tokenizer regex to patch');
  }
} else {
  console.log('Warning: Search plugin tokenize.js not found (not yet installed?)');
}
