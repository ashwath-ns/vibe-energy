async function testAddToCart() {
    try {
        const res = await fetch('http://localhost:5005/add-to-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: "1", price: "2", size: "3" })
        });
        const data = await res.json();
        console.log("Add-to-cart:", data);
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}
testAddToCart();
