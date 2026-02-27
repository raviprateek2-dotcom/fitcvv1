const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/ravip/OneDrive/Desktop/fitcvv1/src/components/editor/sections';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && f !== 'SortableItem.tsx');

for (const file of files) {
  const filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');
  
  if (content.includes("'use client';") && !content.trim().startsWith("'use client';")) {
    content = content.replace(/'use client';\r?\n?/g, ''); // Remove all
    content = "'use client';\n" + content; // Add to top
    fs.writeFileSync(filepath, content);
    console.log(`Fixed ${file}`);
  }
}
