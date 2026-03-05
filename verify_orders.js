const mongoose = require('mongoose');

async function checkOrders() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/vibe_energy');
        console.log('Connected to MongoDB');

        // Define Order Schema
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

        const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

        const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
        console.log('Recent Orders:');
        console.log(JSON.stringify(orders, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkOrders();
