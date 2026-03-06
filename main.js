// ─── Tailwind Config ─────────────────────────────────────────────────────────
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                brand: {
                    dark: '#0a0a0a',
                    mango: '#FF8C00',
                    strawberry: '#FF0080',
                    apple: '#32CD32',
                }
            },
            backgroundImage: {
                'mango-gradient': 'linear-gradient(135deg, #FF8C00 0%, #FFC300 100%)',
                'strawberry-gradient': 'linear-gradient(135deg, #FF0080 0%, #FF8C00 100%)',
                'apple-gradient': 'linear-gradient(135deg, #32CD32 0%, #00C853 100%)',
                'glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            }
        }
    }
}

// ─── Navbar scroll effect ─────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('bg-white/5');
    } else {
        navbar.classList.remove('bg-white/5');
    }
});

// ─── Review product setter ────────────────────────────────────────────────────
function setReviewProduct(productName) {
    document.getElementById('rev-product').value = productName;
}

// ─── Price updater ────────────────────────────────────────────────────────────
function updatePrice(btn, price) {
    const siblings = btn.parentElement.children;
    for (let sibling of siblings) {
        sibling.classList.remove('bg-white', 'text-black', 'font-bold');
        sibling.classList.add('bg-white/10');
    }
    btn.classList.remove('bg-white/10');
    btn.classList.add('bg-white', 'text-black', 'font-bold');

    const card = btn.closest('.tilt-card');
    const priceDisplay = card.querySelector('.price-display');

    priceDisplay.style.transform = 'scale(1.2)';
    priceDisplay.style.color = '#f97316';
    setTimeout(() => {
        priceDisplay.style.transform = 'scale(1)';
        priceDisplay.style.color = '';
    }, 200);

    priceDisplay.textContent = '₹' + price;
}

// ─── Review form submission ───────────────────────────────────────────────────
document.getElementById('review-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rev-name').value;
    const rating = parseInt(document.getElementById('rev-rating').value);
    const text = document.getElementById('rev-text').value;
    const product = document.getElementById('rev-product') ? document.getElementById('rev-product').value : '';

    if (!name || !text) return;

    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    const colors = ['bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const reviewHtml = `
        <div class="glass-card p-6 rounded-2xl animate-float" style="animation-delay: 0.1s">
            <div class="flex items-center mb-4">
                <div class="w-10 h-10 rounded-full ${randomColor} flex items-center justify-center font-bold mr-3">${initials}</div>
                <div>
                    <div class="flex items-center gap-2"><h4 class="font-bold">${name}</h4>${product ? '<span class="px-2 py-0.5 rounded-full bg-white/10 text-xs text-gray-300">' + product + '</span>' : ''}</div>
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

// ─── Add to cart (basic, non-auth) ───────────────────────────────────────────
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();

        const card = this.closest('.tilt-card');
        const name = this.getAttribute('data-product');
        const sizeBtn = card.querySelector('button.bg-white.text-black.font-bold');
        const size = sizeBtn ? sizeBtn.textContent.trim() : "";
        const priceDisplay = card.querySelector('.price-display');
        const priceStr = priceDisplay ? priceDisplay.textContent.trim().replace('₹', '') : "0";
        const price = Number(priceStr);

        const data = { name, size, price };

        fetch("http://localhost:5005/add-to-cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(result => {
                const params = new URLSearchParams({ product: name, price: priceStr || price });
                window.location.href = 'checkout.html?' + params.toString();
            })
            .catch(err => console.log(err));
    });
});

// ─── Theme Toggle ─────────────────────────────────────────────────────────────
const themeToggle = document.getElementById('theme-toggle');

if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    if (themeToggle) themeToggle.textContent = '🌙';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌙';
        } else {
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '🌞';
        }
    });
}

// ─── Auth System (Firebase Phone OTP) ────────────────────────────────────────
const API = 'http://localhost:5005';

// confirmationResult is stored globally so verifyOtp() can access it
let confirmationResult = null;

// ── Session helpers ──────────────────────────────────────────────────────────
function getToken() { return localStorage.getItem('vibe_token'); }
function getPhone() { return localStorage.getItem('vibe_phone'); }
function isLoggedIn() { return !!getToken(); }

function setSession(token, phone, email) {
    localStorage.setItem('vibe_token', token);
    localStorage.setItem('vibe_phone', phone || '');
    localStorage.setItem('vibe_email', email || '');
    updateNavAuth();
}

function clearSession() {
    localStorage.removeItem('vibe_token');
    localStorage.removeItem('vibe_phone');
    localStorage.removeItem('vibe_email');
    updateNavAuth();
}

function updateNavAuth() {
    const area = document.getElementById('auth-nav-area');
    const identifier = localStorage.getItem('vibe_email') || localStorage.getItem('vibe_phone');
    if (isLoggedIn()) {
        area.innerHTML = `
            <div class="flex items-center gap-3">
                <button onclick="handleLogout()"
                    class="border border-white/30 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-white/10 transition-all">
                    Logout
                </button>
            </div>`;
    } else {
        area.innerHTML = `
            <button id="login-nav-btn" onclick="openAuthModal()"
                class="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:scale-105 transition-all">
                Login
            </button>`;
    }
}

function openAuthModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
    document.body.style.overflow = '';
}

function switchAuthTab(tab) {
    const isLogin = tab === 'login';
    document.getElementById('form-login').classList.toggle('hidden', !isLogin);
    document.getElementById('form-register').classList.toggle('hidden', isLogin);
    document.getElementById('tab-login').className = `flex-1 py-2 rounded-full text-sm font-bold transition-all ${isLogin ? 'bg-orange-500 text-white' : 'text-gray-400'}`;
    document.getElementById('tab-register').className = `flex-1 py-2 rounded-full text-sm font-bold transition-all ${!isLogin ? 'bg-orange-500 text-white' : 'text-gray-400'}`;
}

function showError(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 5000);
}

// ── Register account ─────────────────────────────
async function handleRegister() {
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-password-confirm').value;

    if (!email && !phone) { showError('reg-error', 'Please provide either an email or phone number'); return; }
    if (password.length < 6) { showError('reg-error', 'Password must be at least 6 characters'); return; }
    if (password !== confirm) { showError('reg-error', 'Passwords do not match'); return; }

    const regBtn = document.querySelector('#form-register button[onclick="handleRegister()"]');
    if (regBtn) { regBtn.disabled = true; regBtn.textContent = 'Creating Account...'; }

    try {
        const res = await fetch(`${API}/register`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, phone, password })
        });
        const data = await res.json();
        if (data.success) {
            setSession(data.token, data.phone, data.email);
            closeAuthModal();
            alert('🎉 Account created! You are now logged in.');
        } else {
            showError('reg-error', data.message);
        }
    } catch (e) {
        showError('reg-error', 'Could not connect to server.');
    } finally {
        if (regBtn) { regBtn.disabled = false; regBtn.textContent = 'Create Account'; }
    }
}

// ── Login (identifier + password via backend) ────────────────────────────
async function handleLogin() {
    const identifier = document.getElementById('login-identifier').value.trim();
    const password = document.getElementById('login-password').value;

    if (!identifier || !password) { showError('login-error', 'Please fill in all fields'); return; }

    const loginBtn = document.querySelector('#form-login button[onclick="handleLogin()"]');
    if (loginBtn) { loginBtn.disabled = true; loginBtn.textContent = 'Logging in...'; }

    try {
        const res = await fetch(`${API}/login`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password })
        });
        const data = await res.json();
        if (data.success) {
            setSession(data.token, data.phone, data.email);
            closeAuthModal();
            alert('✅ Logged in successfully! Welcome back.');
        } else {
            showError('login-error', data.message);
        }
    } catch (e) {
        showError('login-error', 'Could not connect to server. Make sure it is running.');
    } finally {
        if (loginBtn) { loginBtn.disabled = false; loginBtn.textContent = 'Login'; }
    }
}

function handleLogout() {
    clearSession();
    alert('You have been logged out.');
}

// ─── Cart Guard (DOMContentLoaded) ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateNavAuth();

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            if (!isLoggedIn()) {
                openAuthModal();
                return;
            }

            const card = this.closest('.tilt-card');
            const name = this.getAttribute('data-product');
            const sizeBtn = card ? card.querySelector('button.bg-white.text-black.font-bold') : null;
            const size = sizeBtn ? sizeBtn.textContent.trim() : '';
            const priceDisplay = card ? card.querySelector('.price-display') : null;
            const priceStr = priceDisplay ? priceDisplay.textContent.trim().replace('₹', '') : '0';
            const price = Number(priceStr);

            const data = { name, size, price };

            fetch(`${API}/add-to-cart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(() => {
                    const params = new URLSearchParams({ product: name, price: priceStr || price });
                    window.location.href = 'checkout.html?' + params.toString();
                })
                .catch(() => {
                    const params = new URLSearchParams({ product: name, price: priceStr || price });
                    window.location.href = 'checkout.html?' + params.toString();
                });
        }, true);
    });
});
