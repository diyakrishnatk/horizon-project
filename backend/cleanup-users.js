import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const cleanupUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // 1. Demote 'Diyakrishna T K' to 'user'
        const diyakrishna = await User.findOne({ username: 'Diyakrishna T K' });
        if (diyakrishna) {
            diyakrishna.role = 'user';
            await diyakrishna.save();
            console.log("Diyakrishna T K demoted to 'user'");
        } else {
            console.log("Diyakrishna T K not found");
        }

        // 2. Delete user 'Admin'
        const adminUser = await User.findOne({ username: 'Admin' });
        if (adminUser) {
            await User.deleteOne({ username: 'Admin' });
            console.log("User 'Admin' deleted successfully");
        } else {
            console.log("Admin user not found");
        }

        mongoose.disconnect();
    } catch (err) {
        console.error('Error during cleanup:', err.message);
    }
};

cleanupUsers();
