const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.vue')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            // Replace hardcoded text colors with theme variables
            content = content.replace(/color:\s*#1d2129;?/g, 'color: var(--vscode-text);');
            content = content.replace(/color:\s*#606266;?/g, 'color: var(--vscode-text-muted);');
            content = content.replace(/color:\s*#333;?/gi, 'color: var(--vscode-text);');
            content = content.replace(/color:\s*#666;?/gi, 'color: var(--vscode-text-muted);');
            content = content.replace(/color:\s*#999;?/gi, 'color: var(--vscode-text-muted);');
            content = content.replace(/color:\s*#165DFF;?/gi, 'color: var(--vscode-primary);');
            
            // Note: Not touching colors like #F53F3F or HUD neon colors, as they are specific to graphs/alarms.

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated text colors in ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(process.cwd(), 'src/views'));
