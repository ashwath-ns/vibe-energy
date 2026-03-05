const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

// The replacement for Product 4, 5, 6.
const productsHtml = `
                <!-- Product 4: Blueberry -->
                <div class="tilt-card group" data-tilt>
                    <div class="glass-card rounded-3xl p-8 relative overflow-hidden h-[500px] flex flex-col justify-between transition-all duration-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] border-t border-blue-500/30">
                        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/20"></div>

                        <div class="tilt-content">
                            <div class="w-full h-48 mb-6 relative flex justify-center items-center">
                                <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                                <img src="assets/images/blueberry.png" alt="Cosmic Blueberry Can" class="h-full w-auto object-contain animate-float relative z-10 group-hover:scale-110 transition-transform duration-500" style="mix-blend-mode: screen; filter: contrast(1.2) brightness(1.2); -webkit-mask-image: radial-gradient(circle closest-side, black 65%, transparent 100%); mask-image: radial-gradient(circle closest-side, black 65%, transparent 100%);">
                            </div>
                            <h3 class="text-3xl font-bold mb-2">Cosmic Blueberry</h3>
                            <p class="text-gray-400 text-sm mb-4">Antioxidant-rich blueberries with cosmic energy.</p>
                        </div>

                        <div class="tilt-content">
                            <div class="mb-4">
                                <span class="text-xs text-gray-500 block mb-2">Size</span>
                                <div class="flex space-x-2">
                                    <button type="button" class="px-3 py-1 text-xs border border-white/20 rounded hover:bg-white/10 transition-colors" onclick="updatePrice(this, 119)">100ml</button>
                                    <button type="button" class="px-3 py-1 text-xs border border-white/20 rounded hover:bg-white/10 transition-colors bg-white/10" onclick="updatePrice(this, 189)">200ml</button>
                                    <button type="button" class="px-3 py-1 text-xs border border-white/20 rounded hover:bg-white/10 transition-colors" onclick="updatePrice(this, 249)">350ml</button>
                                </div>
                            </div>
                            <div class="flex justify-between items-end mb-6">
                                <div>
                                    <span class="text-xs text-gray-500 block">Price</span>
                                    <span class="text-2xl font-bold price-display">₹189</span>
                                </div>
                                <div class="text-4xl opacity-20 group-hover:opacity-100 transition-opacity duration-300">🫐</div>
                            </div>
                            <div class="flex gap-2">
                                <button class="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white shadow-lg hover:shadow-blue-500/50 transition-all transform hover:-translate-y-1 add-to-cart-btn" data-product="Cosmic Blueberry" onclick="goToCheckout('Cosmic Blueberry', '₹189')">
                                    Add to Cart
                                </button>
                                <a href="#testimonials" onclick="setReviewProduct('Cosmic Blueberry')" class="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-xl" title="Add Review">💬</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Product 5: Grape -->
                <div class="tilt-card group" data-tilt>
                    <div class="glass-card rounded-3xl p-8 relative overflow-hidden h-[500px] flex flex-col justify-between transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] border-t border-purple-500/30">
                        <div class="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-purple-500/20"></div>

                        <div class="tilt-content">
                            <div class="w-full h-48 mb-6 relative flex justify-center items-center">
                                <div class="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                                <img src="assets/images/grape.png" alt="Electric Grape Can" class="h-full w-auto object-contain animate-float relative z-10 group-hover:scale-110 transition-transform duration-500" style="mix-blend-mode: screen; filter: contrast(1.2) brightness(1.2); -webkit-mask-image: radial-gradient(circle closest-side, black 65%, transparent 100%); mask-image: radial-gradient(circle closest-side, black 65%, transparent 100%);">
                            </div>
                            <h3 class="text-3xl font-bold mb-2">Electric Grape</h3>
                            <p class="text-gray-400 text-sm mb-4">Bold purple grapes with electrifying vibes.</p>
                        </div>

                        <div class="tilt-content">
                            <div class="mb-4">
                                <span class="text-xs text-gray-500 block mb-2">Size</span>
                                <div class="flex space-x-2">
                                    <button type="button" class="px-3 py-1 text-xs border border-white/20 rounded hover:bg-white/10 transition-colors" onclick="updatePrice(this, 119)">100ml</button>
                                    <button type="button" class="px-3 py-1 text-xs border border-white/20 rounded hover:bg-white/10 transition-colors bg-white/10" onclick="updatePrice(this, 189)">200ml</button>
                                    <button type="button" class="px-3 py-1 text-xs border border-white/20 rounded hover:bg-white/10 transition-colors" onclick="updatePrice(this, 249)">350ml</button>
                                </div>
                            </div>
                            <div class="flex justify-between items-end mb-6">
                                <div>
                                    <span class="text-xs text-gray-500 block">Price</span>
                                    <span class="text-2xl font-bold price-display">₹189</span>
                                </div>
                                <div class="text-4xl opacity-20 group-hover:opacity-100 transition-opacity duration-300">🍇</div>
                            </div>
                            <div class="flex gap-2">
                                <button class="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-white shadow-lg hover:shadow-purple-500/50 transition-all transform hover:-translate-y-1 add-to-cart-btn" data-product="Electric Grape" onclick="goToCheckout('Electric Grape', '₹189')">
                                    Add to Cart
                                </button>
                                <a href="#testimonials" onclick="setReviewProduct('Electric Grape')" class="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-xl" title="Add Review">💬</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Product 6: Watermelon -->
                <div class="tilt-card group" data-tilt>
                    <div class="glass-card rounded-3xl p-8 relative overflow-hidden h-[500px] flex flex-col justify-between transition-all duration-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] border-t border-red-500/30">
                        <div class="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-red-500/20"></div>

                        <div class="tilt-content">
                            <div class="w-full h-48 mb-6 relative flex justify-center items-center">
                                <div class="absolute inset-0 bg-gradient-to-br from-red-600 to-rose-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                                <img src="assets/images/watermelon.png" alt="Watermelon Rush Can" class="h-full w-auto object-contain animate-float relative z-10 group-hover:scale-110 transition-transform duration-500" style="mix-blend-mode: screen; filter: contrast(1.2) brightness(1.2); -webkit-mask-image: radial-gradient(circle closest-side, black 65%, transparent 100%); mask-image: radial-gradient(circle closest-side, black 65%, transparent 100%);">
                            </div>
                            <h3 class="text-3xl font-bold mb-2">Watermelon Rush</h3>
                            <p class="text-gray-400 text-sm mb-4">Fresh, juicy watermelon with a cooling sensation.</p>
                        </div>

                        <div class="tilt-content">
                            <div class="mb-4">
                                <span class="text-xs text-gray-500 block mb-2">Size</span>
                                <div class="flex space-x-2">
                                    <button type="button" class="px-3 py-1 text-xs border border-white/20 rounded hover:bg-white/10 transition-colors" onclick="updatePrice(this, 119)">100ml</button>
                                    <button type="button" class="px-3 py-1 text-xs border border-white/20 rounded hover:bg-white/10 transition-colors bg-white/10" onclick="updatePrice(this, 189)">200ml</button>
                                    <button type="button" class="px-3 py-1 text-xs border border-white/20 rounded hover:bg-white/10 transition-colors" onclick="updatePrice(this, 249)">350ml</button>
                                </div>
                            </div>
                            <div class="flex justify-between items-end mb-6">
                                <div>
                                    <span class="text-xs text-gray-500 block">Price</span>
                                    <span class="text-2xl font-bold price-display">₹189</span>
                                </div>
                                <div class="text-4xl opacity-20 group-hover:opacity-100 transition-opacity duration-300">🍉</div>
                            </div>
                            <div class="flex gap-2">
                                <button class="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 font-bold text-white shadow-lg hover:shadow-red-500/50 transition-all transform hover:-translate-y-1 add-to-cart-btn" data-product="Watermelon Rush" onclick="goToCheckout('Watermelon Rush', '₹189')">
                                    Add to Cart
                                </button>
                                <a href="#testimonials" onclick="setReviewProduct('Watermelon Rush')" class="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-xl" title="Add Review">💬</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
`;

const startIdx = html.indexOf('<!-- Product 4: Blueberry -->');
const endIdx = html.indexOf('<!-- About Section -->');

if (startIdx !== -1 && endIdx !== -1) {
    // We want to replace everything from startIdx up to the end of <section id="products"> which ends before <!-- About Section -->
    const beforePart = html.substring(0, startIdx);
    const afterPart = html.substring(endIdx);

    html = beforePart + productsHtml + "\n    " + afterPart;

    // Also, patch the Javascript that is missing "product" declaration in the submit event
    if (html.includes("const text = document.getElementById('rev-text').value;")) {
        html = html.replace("const text = document.getElementById('rev-text').value;", "const text = document.getElementById('rev-text').value;\\n            const product = document.getElementById('rev-product') ? document.getElementById('rev-product').value : '';");
    }

    fs.writeFileSync(file, html, 'utf8');
    console.log("Success");
} else {
    console.log("Could not find start or end index.");
}
