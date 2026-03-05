const fs = require('fs'); let html = fs.readFileSync('checkout.html', 'utf8'); html = html.replace('onclick=\"placeOrder()\" ', ''); fs.writeFileSync('checkout.html', html);
