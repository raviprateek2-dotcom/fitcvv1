const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/ravip/OneDrive/Desktop/fitcvv1/src/components/editor/sections';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && f !== 'SortableItem.tsx');

for (const file of files) {
  const filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');
  
  const match = content.match(/export function ([A-Za-z]+)\((.*?)\)/);
  if (match) {
    const compName = match[1];
    
    if (content.includes('React.memo(function')) {
      console.log(`Already memoized: ${compName}`);
      continue;
    }
    
    content = content.replace(`export function ${compName}`, `export const ${compName} = React.memo(function ${compName}`);
    
    const lastBraceIndex = content.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
        content = content.substring(0, lastBraceIndex) + '});\n' + content.substring(lastBraceIndex + 1);
    }
    
    if (!content.includes("import React")) {
        content = "import React from 'react';\n" + content;
    }

    fs.writeFileSync(filepath, content);
    console.log(`Memoized: ${compName}`);
  }
}
