const fs = require('fs');
const path = require('path');

const checkoutPath = path.join(__dirname, 'checkout.html');
let content = fs.readFileSync(checkoutPath, 'utf8');

content = content.replace(/http:\/\/localhost:5001\/place-order/g, 'http://localhost:5005/place-order');

fs.writeFileSync(checkoutPath, content, 'utf8');
console.log("Patched checkout.html to port 5005 successfully.");
