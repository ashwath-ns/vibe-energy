const orderPayload = {
    productName: "Tropical Mango",
    quantity: 2,
    unitPrice: 149,
    subtotal: 298,
    shipping: 50,
    tax: 29.8,
    total: 377.8,
    address: "123 Main St",
    city: "New York",
    postal: "10001",
    phone: "123-456-7890",
    paymentMethod: "cod"
};

async function testOrder() {
    try {
        const res = await fetch('http://localhost:5005/place-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
        });
        const data = await res.json();
        console.log("Response:", data);
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}
testOrder();
