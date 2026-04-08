import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Horizon', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to Database: Horizon');
    
    const userSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, default: 'user' }
    });
    
    const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

    // Admin Credentials
    const adminUsername = 'admin';
    const adminPassword = 'admin123';
    const adminEmail = 'admin@horizon.com';

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Upsert Admin
    const result = await User.findOneAndUpdate(
        { username: adminUsername },
        { 
            $set: { 
                password: hashedPassword, 
                email: adminEmail,
                role: 'admin' 
            } 
        },
        { upsert: true, new: true }
    );

    console.log('SUCCESS: Professional Administrator credentials initialized.');
    console.log(`Username: ${adminUsername}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Email: ${adminEmail}`);

    process.exit();
}).catch(err => {
    console.error('Connection Error:', err);
    process.exit(1);
});
