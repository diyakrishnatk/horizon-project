import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tour from './models/Tour.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../frontend/src/assets/data/tours.json'), 'utf-8')
);

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Delete all tours before inserting new ones
    await Tour.deleteMany();

    // Filter out duplicates by title since the model has unique: true
    const uniqueTours = [];
    const seenTitles = new Set();
    
    tours.forEach((tour, index) => {
      if (!seenTitles.has(tour.title)) {
        seenTitles.add(tour.title);
        // Ensure photo points to a file that actually exists (img01-img07)
        const photoIndex = (index % 7) + 1;
        uniqueTours.push({ 
            ...tour, 
            reviews: [], 
            photo: `/tour-images/tour-img0${photoIndex}.jpg` 
        });
      }
    });

    await Tour.insertMany(uniqueTours);

    console.log('Data successfully loaded!');
    process.exit();
  } catch (err) {
    console.error('Error with data import:', err.message);
    process.exit(1);
  }
};

importData();
