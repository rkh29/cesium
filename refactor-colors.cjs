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
            
            // Replace hardcoded background colors with theme variables
            content = content.replace(/background-color:\s*#f8f9fa;?/g, 'background-color: var(--vscode-sidebar-bg);');
            content = content.replace(/background(-color)?:\s*#fafafa;?/g, 'background-color: var(--vscode-hover);');
            content = content.replace(/background(-color)?:\s*#f0f0f0;?/g, 'background-color: var(--vscode-hover);');
            content = content.replace(/background(-color)?:\s*#f0f9ff;?/g, 'background-color: var(--vscode-active);');
            content = content.replace(/background-color:\s*#f5f7fa;?/g, 'background-color: var(--vscode-hover);');
            content = content.replace(/background-color:\s*#ECF5FF;?/g, 'background-color: var(--vscode-active);');
            
            // Scrollbar and other grays
            content = content.replace(/background:\s*#f1f1f1;?/g, 'background: var(--vscode-hover);');
            content = content.replace(/background:\s*#c1c1c1;?/g, 'background: var(--vscode-border);');
            content = content.replace(/background:\s*#a1a1a1;?/g, 'background: var(--vscode-text-muted);');
            
            // Replace hardcoded borders
            content = content.replace(/border-right:\s*1px solid #e4e7ed;?/g, 'border-right: 1px solid var(--vscode-border);');
            content = content.replace(/border-bottom:\s*1px solid #e0e0e0;?/g, 'border-bottom: 1px solid var(--vscode-border);');
            content = content.replace(/border-bottom:\s*1px solid #e4e7ed;?/g, 'border-bottom: 1px solid var(--vscode-border);');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(process.cwd(), 'src/views'));
