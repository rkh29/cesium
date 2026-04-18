const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

const isSemanticBg = (val) => {
    if (/0,\s*212,\s*255/.test(val)) return true; // cyan
    if (/255,\s*208,\s*75/.test(val)) return true; // yellow
    if (/255,\s*107,\s*107/.test(val)) return true; // red
    if (/139,\s*146,\s*185/.test(val)) return true; // gray info
    if (/0,\s*255,\s*136/.test(val)) return true; // green
    if (val.includes('#FFD04B') || val.includes('#165DFF') || val.includes('rgba(22, 93, 255')) return true;
    if (val.includes('transparent')) return true;
    if (val === 'none' || val === 'inherit') return true;
    return false;
};

const isSemanticBorder = (val) => {
    if (val.includes('#FF6B6B') || val.includes('#FFD04B') || val.includes('#00D4FF') || val.includes('#00FF88')) return true;
    return false;
};

walk('src/views', (filePath) => {
  if (filePath.endsWith('.vue')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;

    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
    
    content = content.replace(styleRegex, (match, styleContent) => {
      let newStyle = styleContent;

      // 1. Replace multi-line backgrounds
      // We'll use a regex that captures everything until a semicolon
      newStyle = newStyle.replace(/(background(?:-color)?):([\s\S]*?);/g, (bgMatch, prop, val) => {
        val = val.trim();
        if (isSemanticBg(val)) {
            return bgMatch;
        }
        
        if (val.includes('gradient') || val.includes('rgba') || val.startsWith('#') || val === 'white') {
            if (val === '#fff' || val === '#ffffff' || val === 'white' || val === '#f8f9fa' || val === '#f0f9ff' || val === '#fafafa') {
                return `${prop}: var(--vscode-bg);`;
            }
            return `${prop}: var(--vscode-sidebar-bg);`;
        }
        return bgMatch;
      });

      // 2. Replace borders
      newStyle = newStyle.replace(/(border(?:-[a-z]+)?):\s*(.*?);/g, (borderMatch, prop, val) => {
          if (isSemanticBorder(val) || isSemanticBg(val)) {
              return borderMatch;
          }
          if (val.includes('rgba') || val.startsWith('#')) {
              let updatedVal = val.replace(/rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}/, 'var(--vscode-border)');
              return `${prop}: ${updatedVal};`;
          }
          return borderMatch;
      });
      
      return match.replace(styleContent, newStyle);
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated: ${filePath}`);
    }
  }
});
