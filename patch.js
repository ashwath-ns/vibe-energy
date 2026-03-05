const fs = require('fs');
const path = require('path');

const checkoutPath = path.join(__dirname, 'checkout.html');
let content = fs.readFileSync(checkoutPath, 'utf8');

// Replace function declaration
content = content.replace(/function placeOrder\(\) \{/g, 'async function placeOrder() {');

// Replace value parsing
content = content.replace(/const quantity = document\.getElementById\('quantity'\)\.value;/g,
    "const quantity = parseInt(document.getElementById('quantity').value) || 1;\n            const upiId = document.getElementById('upiId') ? document.getElementById('upiId').value : '';");

// Replace alert and redirect with fetch
const originalEnd = `            alert(orderSummary);
            // Here you would normally send the data to a backend
            // For now, just show confirmation and redirect
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);`;

const newEnd = `            // Prepare Request Payload
            const orderPayload = {
                productName,
                quantity,
                unitPrice: productPrice,
                subtotal,
                shipping,
                tax,
                total,
                address,
                city,
                postal,
                phone,
                paymentMethod,
                upiId
            };

            try {
                const response = await fetch('http://localhost:5000/place-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderPayload)
                });
                
                const result = await response.json();
                if (result.success) {
                    alert(orderSummary);
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    alert('Error placing order: ' + result.message);
                }
            } catch (error) {
                console.error("Order error: ", error);
                alert('An error occurred while placing your order. Make sure the backend server is running.');
            }`;
content = content.replace(originalEnd, newEnd);
// Also try with just single \n if originalEnd has \n instead of CRLF
const originalEndLF = originalEnd.replace(/\r\n/g, '\n');
content = content.replace(originalEndLF, newEnd);

// Replace initialization
const originalInit = "window.addEventListener('load', initializePage);";
const newInit = `window.addEventListener('load', () => {
            initializePage();
            document.getElementById('orderForm').addEventListener('submit', (e) => {
                e.preventDefault();
                placeOrder();
            });
        });`;
content = content.replace(originalInit, newInit);

fs.writeFileSync(checkoutPath, content, 'utf8');
console.log("Patched checkout.html successfully.");
