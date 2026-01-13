import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ingestMedicines } from '../services/csv.service.js';
import connectDB from '../db/db.js';

dotenv.config();

const seed = async () => {
    try {
        await connectDB();
        console.log('Connected to DB for seeding...');

        await ingestMedicines();

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
