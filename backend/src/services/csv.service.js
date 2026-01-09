import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import medicineModel from '../models/medicine.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ingestMedicines = async () => {
    try {
        const csvPath = path.join(__dirname, '../seed/medicines.csv');
        const data = fs.readFileSync(csvPath, 'utf8');

        // Split by new line and remove header
        const lines = data.split('\n').filter(line => line.trim() !== '');
        const headers = lines.shift().split(',').map(h => h.trim());

        console.log(`Found ${lines.length} medicines to ingest...`);

        for (const line of lines) {
            const values = line.split(',').map(v => v.trim());
            const medicineData = {};

            headers.forEach((header, index) => {
                let value = values[index];
                if (header === 'prescriptionRequired') value = value === 'true';
                medicineData[header] = value;
            });

            // Generate slug logic
            const slug = medicineData.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s/g, '-');
            medicineData.slug = slug;

            await medicineModel.findOneAndUpdate(
                { slug: medicineData.slug },
                medicineData,
                { upsert: true, new: true }
            );
        }

        console.log('Medicine ingestion complete.');
    } catch (error) {
        console.error('Error ingesting medicines:', error);
        throw error;
    }
};
