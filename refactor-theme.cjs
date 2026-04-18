const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.vue')) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Split content to only process the <style> part
  const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/);
  if (!styleMatch) return;

  let styleContent = styleMatch[1];
  let newStyleContent = styleContent;

  // 1. Replace multi-line backgrounds ending with ;
  // Example: background:\n  radial-gradient(...),\n  linear-gradient(...);
  newStyleContent = newStyleContent.replace(/background\s*:\s*([^;]+?gradient[^;]+);/gs, 'background: var(--vscode-bg);');
  
  // 2. Replace hardcoded rgba backgrounds (mostly dark/transparent)
  newStyleContent = newStyleContent.replace(/background\s*:\s*rgba\(\s*(?:0|7|8|9|10|11|15|17|26|28|31|255)\s*,\s*\d+\s*,\s*\d+\s*,\s*0?\.\d+\s*\)\s*;/g, 'background: var(--vscode-sidebar-bg);');
  newStyleContent = newStyleContent.replace(/background(-color)?\s*:\s*rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0?\.\d+\s*\)\s*;/g, 'background: var(--vscode-sidebar-bg);');
  
  // 3. Replace hex dark backgrounds
  newStyleContent = newStyleContent.replace(/background\s*:\s*#(0|1)[a-fA-F0-9]{2,5}\s*;/g, 'background: var(--vscode-bg);');

  // 4. Replace hardcoded borders
  newStyleContent = newStyleContent.replace(/border\s*:\s*1px\s+solid\s+rgba\([^)]+\)\s*;/g, 'border: 1px solid var(--vscode-border);');
  
  // 5. Replace box-shadows that might be too dark
  newStyleContent = newStyleContent.replace(/box-shadow\s*:\s*[^;]+;/g, 'box-shadow: 0 4px 6px var(--vscode-shadow);');

  // 6. Color changes
  newStyleContent = newStyleContent.replace(/color\s*:\s*#fff(?:fff)?\s*;/gi, 'color: var(--vscode-text);');
  newStyleContent = newStyleContent.replace(/color\s*:\s*#edf3f9\s*;/gi, 'color: var(--vscode-text);');
  newStyleContent = newStyleContent.replace(/color\s*:\s*#a7b7c8\s*;/gi, 'color: var(--vscode-text-muted);');

  if (styleContent !== newStyleContent) {
    content = content.replace(styleContent, newStyleContent);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
}

processDir(path.join(__dirname, 'src/views'));
