const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

content = content.replace(/http:\/\/localhost:5000\/add-to-cart/g, 'http://localhost:5005/add-to-cart');

fs.writeFileSync(indexPath, content, 'utf8');
console.log("Patched index.html port 5005 successfully.");
