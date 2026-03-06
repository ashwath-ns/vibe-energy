const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'vibe_energy_secret_key_2024';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vibe_energy')
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// ─── User Schema ────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
    email: { type: String, sparse: true, unique: true },
    phone: { type: String, sparse: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String }, // deprecated
    otpExpiry: { type: Date }, // deprecated
    verified: { type: Boolean, default: false }, // deprecated
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// ─── Order Schema ───────────────────────────────────────────────
const orderSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postal: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    upiId: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// ─── Health Check ───────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'VIBE Energy API is running' });
});

// ─── AUTH: Send OTP ────────────────────────────────────────────
app.post('/send-otp', async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone || phone.length < 10) {
            return res.status(400).json({ success: false, message: 'Valid phone number required' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Upsert user record with OTP
        await User.findOneAndUpdate(
            { phone },
            { otp, otpExpiry, verified: false },
            { upsert: true, new: true }
        );

        // In production: send SMS via Twilio etc.
        console.log(`\n📱 OTP for ${phone}: ${otp}\n`);

        res.status(200).json({ success: true, message: 'OTP sent successfully (check server console)' });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});

// ─── AUTH: Verify OTP ──────────────────────────────────────────
app.post('/verify-otp', async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const user = await User.findOne({ phone });

        if (!user) return res.status(404).json({ success: false, message: 'Phone not found. Please send OTP first.' });
        if (user.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });
        if (user.otpExpiry < new Date()) return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });

        await User.findOneAndUpdate({ phone }, { verified: true });

        res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ success: false, message: 'Failed to verify OTP' });
    }
});

// ─── AUTH: Register ─────────────────────────────────────────────
app.post('/register', async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        if ((!email && !phone) || !password) {
            return res.status(400).json({ success: false, message: 'Email/Phone and password required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        // Check if user already exists
        let existingUser = null;
        if (email) existingUser = await User.findOne({ email });
        if (!existingUser && phone) existingUser = await User.findOne({ phone });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Account already exists. Please login.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, phone, password: hashedPassword, verified: true });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, phone: newUser.phone, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ success: true, message: 'Account created successfully!', token, phone: newUser.phone, email: newUser.email });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
});

// ─── AUTH: Login ────────────────────────────────────────────────
app.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ success: false, message: 'Identifier and password required' });
        }

        // Search by email OR phone
        const user = await User.findOne({
            $or: [
                { email: identifier },
                { phone: identifier }
            ]
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'No account found. Please register.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect password' });
        }

        const token = jwt.sign({ id: user._id, phone: user.phone, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ success: true, message: 'Logged in successfully!', token, phone: user.phone, email: user.email });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
});

// ─── Place Order ────────────────────────────────────────────────
app.post('/place-order', async (req, res) => {
    try {
        const orderData = req.body;
        console.log('Received order request:', orderData);

        const newOrder = new Order(orderData);
        await newOrder.save();

        console.log('Order saved successfully:', newOrder._id);
        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            orderId: newOrder._id
        });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to place order',
            error: error.message
        });
    }
});

// ─── Add to Cart (stub) ─────────────────────────────────────────
app.post(['/add-to-cart', '/add-to-cart/'], (req, res) => {
    console.log('Added to cart:', req.body);
    res.status(200).json({ success: true, item: req.body });
});

// ─── Start Server ───────────────────────────────────────────────
const PORT = 5005;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
