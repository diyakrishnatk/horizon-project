import mongoose from 'mongoose';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Horizon', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to Database: Horizon');
    
    const tourSchema = new mongoose.Schema({
        title: String,
        price: Number
    });
    
    const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema, 'tours');

    // Restoration Prices Mapping
    const tourPrices = [
        { title: "Westminister Bridge", price: 12500 },
        { title: "Bali, Indonesia", price: 35000 },
        { title: "Snowy Mountains, Thailand", price: 18000 },
        { title: "Beautiful Sunrise, Thailand", price: 22000 },
        { title: "Nusa Pendia Bali, Indonesia", price: 28000 },
        { title: "Cherry Blossoms Spring", price: 45000 },
        { title: "Holmen Lofoten, France", price: 55000 },
        { title: "Jaflong, Sylhet", price: 5000 },
        { title: "Bali, Indonesia", price: 32000 }
    ];

    console.log('Commencing Database Price Updates...');

    for (const update of tourPrices) {
        const res = await Tour.updateMany(
            { title: { $regex: new RegExp(update.title, 'i') } },
            { $set: { price: update.price } }
        );
        console.log(`Updated "${update.title}": ${res.modifiedCount} records affected.`);
    }

    // Default for any others still at 99
    const remaining = await Tour.updateMany(
        { price: 99 },
        { $set: { price: 15000 } }
    );
    console.log(`Final Global Update: ${remaining.modifiedCount} remaining records generalized to standard rate.`);

    console.log('Database synchronization complete.');
    process.exit();
}).catch(err => {
    console.error('Connection Error:', err);
    process.exit(1);
});
