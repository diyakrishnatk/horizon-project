import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('admin@123', salt);

        const admin = new User({
            username: 'Admin',
            email: 'admin@horizon.com',
            password: hash,
            role: 'admin'
        });

        // Check if admin already exists
        const existingAdmin = await User.findOne({ username: 'Admin' });
        if (existingAdmin) {
            console.log('Admin already exists. Updating password...');
            existingAdmin.password = hash;
            await existingAdmin.save();
        } else {
            await admin.save();
            console.log('Admin user created successfully');
        }

        mongoose.disconnect();
    } catch (err) {
        console.error('Error creating admin:', err.message);
    }
};

createAdmin();
