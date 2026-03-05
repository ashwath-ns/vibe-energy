const fs = require('fs');

try {
    let content = fs.readFileSync('index.html', 'utf8');

    // 1. Fix Cosmic Blueberry Price & Size Buttons
    const oldBlueberry = `<div class="tilt-content">
                            <div class="flex justify-between items-end mb-6">
                                <div>
                                    <span class="text-xs text-gray-500 block">Price</span>
                                    <span class="text-2xl font-bold">$31.99</span>
                                </div>
                                <div
                                    class="text-4xl opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                                    🫐</div>
                            </div>
                            <button
                                class="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white shadow-lg hover:shadow-blue-500/50 transition-all transform hover:-translate-y-1"
                                onclick="goToCheckout('Cosmic Blueberry', 31.99)">
                                Add to Cart
                            </button>
                        </div>`;
    const newBlueberry = `<div class="tilt-content">
                            <div class="mb-4">
                                <span class="text-xs text-gray-500 block mb-2">Size</span>
                                <div class="flex space-x-2">
                                    <button type="button" class="px-3 py-1 text-xs border border-white/20 rounded hover:bg-white/10 transition-colors" onclick="updatePrice(this, 89)">100ml</button>
                                    <button type="button" class="px-3 py-1 text-xs border border-white/20 rounded hover:bg-white/10 transition-colors bg-white/10" onclick="updatePrice(this, 149)">200ml</button>
                                    <button type="button" class="px-3 py-1 text-xs border border-white/20 rounded hover:bg-white/10 transition-colors" onclick="updatePrice(this, 229)">350ml</button>
                                </div>
                            </div>
                            <div class="flex justify-between items-end mb-6">
                                <div>
                                    <span class="text-xs text-gray-500 block">Price</span>
                                    <span class="text-2xl font-bold price-display">₹149</span>
                                </div>
                                <div class="text-4xl opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                                    🫐</div>
                            </div>
                            <div class="flex gap-2">
                                <button
                                    class="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white shadow-lg hover:shadow-blue-500/50 transition-all transform hover:-translate-y-1 add-to-cart-btn"
                                    data-product="Cosmic Blueberry"
                                    onclick="goToCheckout('Cosmic Blueberry', '₹149')">
                                    Add to Cart
                                </button>
                                <a href="#testimonials" onclick="setReviewProduct('Cosmic Blueberry')" class="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-xl" title="Add Review">💬</a>
                            </div>
                        </div>`;

    // Standardize spacing to make it robust against indent differences
    const normalizeSpace = (str) => str.replace(/\\s+/g, ' ');

    let partsBlueberry = content.split('Cosmic Blueberry</h3>');
    if (partsBlueberry.length > 1) {
        let afterH3 = partsBlueberry[1];
        let oldPart = afterH3.substring(afterH3.indexOf('<div class="tilt-content">'), afterH3.indexOf('</div>\\n                    </div>') + 6);
        content = content.replace(oldPart, '\\n' + newBlueberry + '\\n    ');
    }


    // 2. Fix Electric Grape
    let partsGrape = content.split('Electric Grape</h3>');
    if (partsGrape.length > 1) {
        let afterH3 = partsGrape[1];
        let oldPart = afterH3.substring(afterH3.indexOf('<div class="tilt-content">'), afterH3.indexOf('</div>\\n                    </div>') + 6);
        const newGrape = newBlueberry.replace(/Cosmic Blueberry/g, 'Electric Grape').replace(/from-blue-600 to-indigo-600/g, 'from-purple-600 to-pink-600').replace(/shadow-blue-500/g, 'shadow-purple-500').replace(/🫐/g, '🍇');
        content = content.replace(oldPart, '\\n' + newGrape + '\\n    ');
    }

    // 3. Update the others to have the Review button next to Add to Cart
    const flavors = [
        { name: 'Tropical Mango', bg: 'from-orange-600 to-yellow-500', shadow: 'shadow-orange-500' },
        { name: 'Berry Blast', bg: 'from-pink-600 to-red-500', shadow: 'shadow-pink-500' },
        { name: 'Green Energy', bg: 'from-green-600 to-emerald-500', shadow: 'shadow-green-500' },
        { name: 'Watermelon Rush', bg: 'from-red-600 to-rose-500', shadow: 'shadow-red-500' },
        // Cosmic Blueberry and Electric Grape are already done above
    ];

    for (const f of flavors) {
        let splitParts = content.split('class="w-full py-3 rounded-xl bg-gradient-to-r ' + f.bg + ' font-bold text-white shadow-lg hover:' + f.shadow + '/50 transition-all transform hover:-translate-y-1 add-to-cart-btn"');
        if (splitParts.length > 1) {
            content = splitParts.join('class="flex-1 py-3 rounded-xl bg-gradient-to-r ' + f.bg + ' font-bold text-white shadow-lg hover:' + f.shadow + '/50 transition-all transform hover:-translate-y-1 add-to-cart-btn"');

            let btnStartIdx = content.indexOf('class="flex-1 py-3 rounded-xl bg-gradient-to-r ' + f.bg);
            let beforeBtn = content.lastIndexOf('<button', btnStartIdx);
            let endBtnStr = `onclick="goToCheckout('${f.name}',`;
            let endBtnIdx = content.indexOf(endBtnStr, beforeBtn);
            if (endBtnIdx !== -1) {
                let closingTagIdx = content.indexOf('</button>', endBtnIdx) + 9;

                let btnHtml = content.substring(beforeBtn, closingTagIdx);
                let newHtml = `<div class="flex gap-2">
                                ` + btnHtml + `
                                <a href="#testimonials" onclick="setReviewProduct('${f.name}')" class="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-xl" title="Add Review">💬</a>
                            </div>`;
                content = content.substring(0, beforeBtn) + newHtml + content.substring(closingTagIdx);
            }
        }
    }

    // 4. Update the layout of the review form to include the product selector
    if (!content.includes('id="rev-product"')) {
        const reviewFormHtml = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <input type="text" id="rev-name"`;
        const newReviewFormHtml = `<div class="mb-4">
                            <input type="text" id="rev-product" placeholder="Product Reviewing (e.g. Tropical Mango)" class="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-orange-500 focus:outline-none transition-colors text-white font-bold text-orange-400 placeholder-gray-500" readonly>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <input type="text" id="rev-name"`;
        content = content.replace(reviewFormHtml, newReviewFormHtml);
    }

    // 5. Replace image styling for proper floating without ugly backgrounds
    // We use split/join to simply bulk-replace the exact string
    const oldImgCss1 = `class="h-full w-auto object-contain animate-float drop-shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-500 mix-blend-lighten"`;
    const newImgCss = `class="h-full w-auto object-contain animate-float relative z-10 group-hover:scale-110 transition-transform duration-500" style="mix-blend-mode: screen; filter: contrast(1.2) brightness(1.2); -webkit-mask-image: radial-gradient(circle closest-side, black 65%, transparent 100%); mask-image: radial-gradient(circle closest-side, black 65%, transparent 100%);"`;

    content = content.split(oldImgCss1).join(newImgCss);


    // 6. JS Logic for setReviewProduct
    const jsFuncs = `function setReviewProduct(productName) {
            document.getElementById('rev-product').value = productName;
        }`;
    if (!content.includes('function setReviewProduct')) {
        content = content.replace('function updatePrice(btn, price) {', jsFuncs + '\\n\\n        function updatePrice(btn, price) {');
    }

    // 7. Submit logic
    if (!content.includes('rev-product')) {
        // we'll just fall back
    }
    const oldSubmit = `const text = document.getElementById('rev-text').value;

            if(!name || !text) return;`;
    const newSubmit = `const text = document.getElementById('rev-text').value;
            const product = document.getElementById('rev-product').value || '';

            if(!name || !text) return;`;

    content = content.replace(oldSubmit, newSubmit);

    // Update the JS string literal building the review tag safely
    const oldNameH4 = `<h4 class="font-bold">\${name}</h4>`;
    const newNameH4 = `<div class="flex items-center gap-2"><h4 class="font-bold">\${name}</h4>\${product ? '<span class="px-2 py-0.5 rounded-full bg-white/10 text-xs text-gray-300">' + product + '</span>' : ''}</div>`;
    content = content.replace(oldNameH4, newNameH4);

    // 8. Tag for existing reviews
    content = content.replace('<h4 class="font-bold">John Doe</h4>', '<div class="flex items-center gap-2"><h4 class="font-bold">John Doe</h4><span class="px-2 py-0.5 rounded-full bg-white/10 text-xs text-gray-300">Tropical Mango</span></div>');
    content = content.replace('<h4 class="font-bold">Alice Smith</h4>', '<div class="flex items-center gap-2"><h4 class="font-bold">Alice Smith</h4><span class="px-2 py-0.5 rounded-full bg-white/10 text-xs text-gray-300">Berry Blast</span></div>');
    content = content.replace('<h4 class="font-bold">Mike Kerry</h4>', '<div class="flex items-center gap-2"><h4 class="font-bold">Mike Kerry</h4><span class="px-2 py-0.5 rounded-full bg-white/10 text-xs text-gray-300">Electric Grape</span></div>');

    fs.writeFileSync('index.html', content, 'utf8');
    console.log("Success");
} catch (e) {
    console.error(e.stack);
}
