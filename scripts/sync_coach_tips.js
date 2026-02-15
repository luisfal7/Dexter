const fs = require('fs');
const path = require('path');

// Read JSON file
const jsonPath = path.join(__dirname, '../src/features/pokemon/data/coach_tips.json');
const tsPath = path.join(__dirname, '../src/features/pokemon/data/coach_tips.ts');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Convert to TypeScript format
let tsContent = 'export const coachTips: Record<string, string> = {\n';

for (const [key, value] of Object.entries(data)) {
    // Escape backticks in the value
    const escapedValue = value.replace(/`/g, '\\`');
    tsContent += `  "${key}": \`${escapedValue}\`,\n`;
}

tsContent += '};\n';

// Write to TS file
fs.writeFileSync(tsPath, tsContent);

console.log(`✅ Successfully converted ${Object.keys(data).length} Pokemon to TypeScript format`);
