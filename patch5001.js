const fs = require('fs');
const path = require('path');

const checkoutPath = path.join(__dirname, 'checkout.html');
let content = fs.readFileSync(checkoutPath, 'utf8');

// Replace port 5000 with 5001
content = content.replace(/http:\/\/localhost:5000\/place-order/g, 'http://localhost:5001/place-order');

fs.writeFileSync(checkoutPath, content, 'utf8');
console.log("Patched checkout.html port successfully.");
