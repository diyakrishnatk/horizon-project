import mongoose from 'mongoose';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Horizon', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to Database: Horizon');
    
    const userSchema = new mongoose.Schema({
        username: String,
        role: String
    });
    
    const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

    // Demote Diyakrishna T K
    const result = await User.findOneAndUpdate(
        { username: 'Diyakrishna T K' },
        { $set: { role: 'user' } },
        { new: true }
    );

    if (result) {
        console.log('SUCCESS: User demoted to role: user');
        console.log(result);
    } else {
        console.log('ERROR: User "Diyakrishna T K" not found in "Horizon" database');
        // Let's list all users to see what's there
        const allUsers = await User.find({});
        console.log('Current users in DB:', allUsers.map(u => ({ username: u.username, role: u.role })));
    }

    process.exit();
}).catch(err => {
    console.error('Connection Error:', err);
    process.exit(1);
});
