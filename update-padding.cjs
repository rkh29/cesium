const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.vue') && !fullPath.includes('App.vue')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            // Replace padding: 0; with padding: 24px; inside <style scoped> blocks
            // Note: We only want to target the main container class. Usually it's the first class in style scoped.
            // A safer regex for finding "padding: 0;" inside a main container:
            content = content.replace(/padding:\s*0;(\s*\n?\s*})?/g, (match, p1) => {
                if (p1) {
                    return `padding: 24px; box-sizing: border-box;${p1}`;
                }
                return `padding: 24px; box-sizing: border-box;`;
            });

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated padding in ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(process.cwd(), 'src/views'));
