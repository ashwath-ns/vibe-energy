import re

def update_html():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add mix-blend-lighten to product images
    content = content.replace('transition-transform duration-500">', 'transition-transform duration-500 mix-blend-lighten">')

    # 2. Add volume options and convert currency
    products = [
        ('Tropical Mango', '29.99', '149', '🥭', 'orange', 'yellow'),
        ('Berry Blast', '29.99', '149', '🍓', 'pink', 'red'),
        ('Green Energy', '29.99', '149', '🍏', 'green', 'emerald'),
        ('Cosmic Blueberry', '31.99', '159', '🫐', 'blue', 'indigo'),
        ('Electric Grape', '31.99', '159', '🍇', 'purple', 'pink'),
        ('Watermelon Rush', '28.99', '139', '🍉', 'red', 'rose')
    ]

    for name, old_price, new_price, emoji, c1, c2 in products:
        pattern = re.compile(
            r'<div class="flex justify-between items-end mb-6">\s*<div>\s*<span class="text-xs text-gray-500 block">Price</span>\s*<span class="text-2xl font-bold">\$' + old_price + r'</span>\s*</div>\s*<div\s*class="text-4xl opacity-20 group-hover:opacity-100 transition-opacity duration-300">\s*' + emoji + r'</div>\s*</div>\s*<button\s*class="w-full py-3 rounded-xl bg-gradient-to-r from-' + c1 + r'-600 to-' + c2 + r'-500 font-bold text-white shadow-lg [^"]+"\s*onclick="goToCheckout\(\'' + name + r'\', ' + old_price + r'\)">'
        )

        
        replacement = f'''<div class="mb-4">
                                <span class="text-xs text-gray-500 block mb-2">Size</span>
                                <div class="flex space-x-2">
                                    <button type="button" class="px-3 py-1 text-xs border border-white/20 rounded hover:bg-white/10 transition-colors" onclick="updatePrice(this, {int(new_price)-60})">100ml</button>
                                    <button type="button" class="px-3 py-1 text-xs border border-white/20 rounded hover:bg-white/10 transition-colors bg-white/10" onclick="updatePrice(this, {new_price})">200ml</button>
                                    <button type="button" class="px-3 py-1 text-xs border border-white/20 rounded hover:bg-white/10 transition-colors" onclick="updatePrice(this, {int(new_price)+80})">350ml</button>
                                </div>
                            </div>
                            <div class="flex justify-between items-end mb-6">
                                <div>
                                    <span class="text-xs text-gray-500 block">Price</span>
                                    <span class="text-2xl font-bold price-display">₹{new_price}</span>
                                </div>
                                <div class="text-4xl opacity-20 group-hover:opacity-100 transition-opacity duration-300">{emoji}</div>
                            </div>
                            <button type="button" class="w-full py-3 rounded-xl bg-gradient-to-r from-{c1}-600 to-{c2}-500 font-bold text-white shadow-lg hover:shadow-{c1}-500/50 transition-all transform hover:-translate-y-1 add-to-cart-btn" data-product="{name}" onclick="goToCheckout('{name}', '₹{new_price}')">'''
        
        content = pattern.sub(replacement, content)

    # 3. Insert About Us section before Contact Us
    about_html = """
    <!-- About Section -->
    <section id="about" class="py-32 relative z-10 bg-black/50 border-t border-white/5">
        <div class="container mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 class="text-4xl md:text-5xl font-bold mb-6">Our <span class="text-orange-500">Story</span></h2>
                    <p class="text-gray-400 text-lg mb-6 leading-relaxed">
                        Born from a desire to disrupt the energy drink industry, VIBE is more than just a beverage—it's a lifestyle. We believe that pure energy shouldn't come with a crash, which is why our formula is crafted with premium, sugar-free ingredients.
                    </p>
                    <p class="text-gray-400 text-lg leading-relaxed">
                        Our journey started in a small lab, experimenting with bold, natural flavors and a revolutionary 3D refreshment matrix. Today, we're fueling the modern generation's creators, athletes, and visionaries.
                    </p>
                </div>
                <div class="glass-card p-8 rounded-3xl relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-purple-500/20 blur-3xl"></div>
                    <div class="relative z-10 grid grid-cols-2 gap-8 text-center text-white">
                        <div>
                            <div class="text-5xl font-black mb-2 text-orange-400">0g</div>
                            <div class="text-sm text-gray-400 uppercase tracking-widest">Sugar</div>
                        </div>
                        <div>
                            <div class="text-5xl font-black mb-2 text-pink-400">100%</div>
                            <div class="text-sm text-gray-400 uppercase tracking-widest">Vibe</div>
                        </div>
                        <div>
                            <div class="text-5xl font-black mb-2 text-blue-400">6</div>
                            <div class="text-sm text-gray-400 uppercase tracking-widest">Flavors</div>
                        </div>
                        <div>
                            <div class="text-5xl font-black mb-2 text-green-400">∞</div>
                            <div class="text-sm text-gray-400 uppercase tracking-widest">Energy</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
"""

    # 4. Insert Reviews section inside About Us or after
    reviews_html = """
    <!-- Reviews Section -->
    <section id="testimonials" class="py-32 relative z-10">
        <div class="container mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold mb-4">Community <span class="text-orange-500">Vibes</span></h2>
                <p class="text-gray-400">See what our community is saying about us.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16" id="reviews-container">
                <div class="glass-card p-6 rounded-2xl">
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold mr-3">JD</div>
                        <div>
                            <h4 class="font-bold">John Doe</h4>
                            <div class="text-orange-400 text-sm">★★★★★</div>
                        </div>
                    </div>
                    <p class="text-gray-400 text-sm">"The Mango flavor is absolutely unreal. Gives me the perfect amount of energy without the crash."</p>
                </div>
                <div class="glass-card p-6 rounded-2xl">
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center font-bold mr-3">AS</div>
                        <div>
                            <h4 class="font-bold">Alice Smith</h4>
                            <div class="text-orange-400 text-sm">★★★★★</div>
                        </div>
                    </div>
                    <p class="text-gray-400 text-sm">"Berry Blast is my go-to pre-workout now. The aesthetic of the can alone makes me feel faster."</p>
                </div>
                <div class="glass-card p-6 rounded-2xl">
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold mr-3">MK</div>
                        <div>
                            <h4 class="font-bold">Mike Kerry</h4>
                            <div class="text-orange-400 text-sm">★★★★☆</div>
                        </div>
                    </div>
                    <p class="text-gray-400 text-sm">"Electric grape hits different. Love the packaging and the energy boost."</p>
                </div>
            </div>

            <!-- Add Review Form -->
            <div class="max-w-2xl mx-auto glass-card p-8 rounded-3xl">
                <h3 class="text-2xl font-bold mb-6 text-center">Add Your Review</h3>
                <form id="review-form" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <input type="text" id="rev-name" placeholder="Your Name" required class="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-orange-500 focus:outline-none transition-colors text-white placeholder-gray-500">
                        </div>
                        <div>
                            <select id="rev-rating" class="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-orange-500 focus:outline-none transition-colors text-white appearance-none">
                                <option value="5" class="bg-gray-900">★★★★★ (5/5)</option>
                                <option value="4" class="bg-gray-900">★★★★☆ (4/5)</option>
                                <option value="3" class="bg-gray-900">★★★☆☆ (3/5)</option>
                                <option value="2" class="bg-gray-900">★★☆☆☆ (2/5)</option>
                                <option value="1" class="bg-gray-900">★☆☆☆☆ (1/5)</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <textarea id="rev-text" placeholder="Share your experience..." rows="3" required class="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-orange-500 focus:outline-none transition-colors text-white placeholder-gray-500 resize-none"></textarea>
                    </div>
                    <button type="submit" class="w-full bg-gradient-to-r from-orange-600 to-yellow-500 text-white font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(255,140,0,0.4)] transition-all">Submit Review</button>
                </form>
            </div>
        </div>
    </section>
"""

    content = content.replace('<!-- Contact Section -->', about_html + '\n' + reviews_html + '\n    <!-- Contact Section -->')

    # 5. Add Javascript functions for updatePrice and review submission
    js_code = """
        function updatePrice(btn, price) {
            const siblings = btn.parentElement.children;
            for(let sibling of siblings) {
                sibling.classList.remove('bg-white/10');
            }
            btn.classList.add('bg-white/10');
            
            const card = btn.closest('.tilt-card');
            const priceDisplay = card.querySelector('.price-display');
            priceDisplay.textContent = '₹' + price;

            const addToCartBtn = card.querySelector('.add-to-cart-btn');
            const productName = addToCartBtn.getAttribute('data-product');
            addToCartBtn.setAttribute('onclick', `goToCheckout('${productName}', '₹${price}')`);
        }

        document.getElementById('review-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('rev-name').value;
            const rating = parseInt(document.getElementById('rev-rating').value);
            const text = document.getElementById('rev-text').value;

            if(!name || !text) return;

            const initials = name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
            const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
            const colors = ['bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            const reviewHtml = `
                <div class="glass-card p-6 rounded-2xl animate-float" style="animation-delay: 0.1s">
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 rounded-full ${randomColor} flex items-center justify-center font-bold mr-3">${initials}</div>
                        <div>
                            <h4 class="font-bold">${name}</h4>
                            <div class="text-orange-400 text-sm">${stars}</div>
                        </div>
                    </div>
                    <p class="text-gray-400 text-sm">"${text}"</p>
                </div>
            `;

            const container = document.getElementById('reviews-container');
            container.insertAdjacentHTML('afterbegin', reviewHtml);
            
            e.target.reset();
            alert("Review submitted successfully! Thank you for the vibes.");
        });
"""
    content = content.replace('// Redirect to checkout page', js_code + '\n        // Redirect to checkout page')

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    update_html()
