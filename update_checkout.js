const fs = require('fs');

function updateCheckout() {
    let content = fs.readFileSync('checkout.html', 'utf8');

    // Replace $ with ₹ in HTML
    content = content.replace(/\$<span id="unitPrice">29\.99<\/span>/g, '₹<span id="unitPrice">149</span>');
    content = content.replace(/\$<span id="summaryPrice">29\.99<\/span>/g, '₹<span id="summaryPrice">149</span>');
    content = content.replace(/\$<span id="subtotal">29\.99<\/span>/g, '₹<span id="subtotal">149</span>');
    content = content.replace(/\$<span id="shipping">5\.00<\/span>/g, '₹<span id="shipping">50</span>');
    content = content.replace(/\$<span id="tax">3\.50<\/span>/g, '₹<span id="tax">14.9</span>');
    content = content.replace(/\$<span id="totalPrice">37\.99<\/span>/g, '₹<span id="totalPrice">213.9</span>');

    // Update JS logic
    const oldJsInit = `        const productPrice = parseFloat(urlParams.get('price')) || 29.99;`;
    const newJsInit = `        const priceParam = urlParams.get('price') || '₹149';
        const productPrice = parseFloat(priceParam.replace(/[^0-9.]/g, '')) || 149;`;
    content = content.replace(oldJsInit, newJsInit);

    const oldShipping = `const shipping = 5.00;`;
    const newShipping = `const shipping = 50.00;`;
    content = content.replace(oldShipping, newShipping);
    content = content.replace(oldShipping, newShipping); // Replace both occurrences (updateTotal and placeOrder)

    // Update order summary literal
    content = content.replace(/Unit Price: \$\$\{productPrice\.toFixed\(2\)\}/g, 'Unit Price: ₹${productPrice.toFixed(2)}');
    content = content.replace(/Subtotal: \$\$\{subtotal\.toFixed\(2\)\}/g, 'Subtotal: ₹${subtotal.toFixed(2)}');
    content = content.replace(/Shipping: \$\$\{shipping\.toFixed\(2\)\}/g, 'Shipping: ₹${shipping.toFixed(2)}');
    content = content.replace(/Tax \(10%\): \$\$\{tax\.toFixed\(2\)\}/g, 'Tax (10%): ₹${tax.toFixed(2)}');
    content = content.replace(/TOTAL: \$\$\{total\.toFixed\(2\)\}/g, 'TOTAL: ₹${total.toFixed(2)}');

    fs.writeFileSync('checkout.html', content, 'utf8');
}

updateCheckout();
