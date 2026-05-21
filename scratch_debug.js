const fs = require('fs');
const path = require('path');

const files = ['index.html', 'capabilities-detail.html', 'infrastructure-detail.html', 'axis-ai.html'];
files.forEach(file => {
  const filepath = path.join(__dirname, file);
  if (fs.existsSync(filepath)) {
    const content = fs.readFileSync(filepath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('  -diecast') || line.includes('   Diecast')) {
        console.log(`${file}:${idx + 1}: ${line.trim()}`);
      }
    });
  }
});
