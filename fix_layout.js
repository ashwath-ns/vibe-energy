const fs = require('fs');
const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

// 1. Fix the fixed height cutting off cards
// Change `h-[500px]` to `h-auto min-h-[580px]`
html = html.replace(/h-\[500px\]/g, 'h-auto min-h-[560px]');

// 2. Make the selected size option highly visible instead of just 'bg-white/10'
// First, update the default '200ml' active state inside the HTML
// Replace `transition-colors bg-white/10"` with `transition-colors bg-white text-black font-bold"`
html = html.replace(/transition-colors bg-white\/10/g, 'transition-colors bg-white text-black font-bold');

// 3. Update the updatePrice JS logic to handle the new active styling robustly
const oldScript = `        function updatePrice(btn, price) {
            const siblings = btn.parentElement.children;
            for (let sibling of siblings) {
                sibling.classList.remove('bg-white/10');
            }
            btn.classList.add('bg-white/10');

            const card = btn.closest('.tilt-card');
            const priceDisplay = card.querySelector('.price-display');
            priceDisplay.textContent = '₹' + price;

            const addToCartBtn = card.querySelector('.add-to-cart-btn');
            const productName = addToCartBtn.getAttribute('data-product');
            addToCartBtn.setAttribute('onclick', \`goToCheckout('\${productName}', '₹\${price}')\`);
        }`;


const newScript = `        function updatePrice(btn, price) {
            const siblings = btn.parentElement.children;
            for (let sibling of siblings) {
                // Remove active classes
                sibling.classList.remove('bg-white', 'text-black', 'font-bold');
            }
            // Add active classes to selected button
            btn.classList.add('bg-white', 'text-black', 'font-bold');

            const card = btn.closest('.tilt-card');
            const priceDisplay = card.querySelector('.price-display');
            
            // Add a quick pulse animation to price
            priceDisplay.style.transform = 'scale(1.2)';
            priceDisplay.style.color = '#f97316'; // orange-500
            setTimeout(() => {
                priceDisplay.style.transform = 'scale(1)';
                priceDisplay.style.color = '';
            }, 200);
            
            priceDisplay.textContent = '₹' + price;

            const addToCartBtn = card.querySelector('.add-to-cart-btn');
            const productName = addToCartBtn.getAttribute('data-product');
            addToCartBtn.setAttribute('onclick', \`goToCheckout('\${productName}', '₹\${price}')\`);
        }`;

html = html.replace(oldScript, newScript);

// 4. Ensure price display has transition
html = html.replace(/class="text-2xl font-bold price-display"/g, 'class="text-2xl font-bold price-display transition-all duration-200 inline-block"');

fs.writeFileSync(file, html, 'utf8');
console.log('Update complete.');
