const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vibe_energy';

async function clearUsers() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully.');

        // Define a simple User schema for deletion
        const userSchema = new mongoose.Schema({ phone: String, email: String });
        const User = mongoose.model('User', userSchema);

        console.log('Deleting all users...');
        const result = await User.deleteMany({});
        console.log(`Deleted ${result.deletedCount} user(s).`);

        console.log('Database cleared of already signed-in accounts.');
    } catch (error) {
        console.error('Error clearing database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

clearUsers();
