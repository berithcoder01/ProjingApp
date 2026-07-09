// tiny helper to make the file executable on Windows
const fs = require('fs');
const file = 'vercel-build.sh';
// Just make sure the content newline is LF
const content = fs.readFileSync(file, 'utf-8').replace(/\r\n/g, '\n');
fs.writeFileSync(file, content);
console.log('File prepared:', file);