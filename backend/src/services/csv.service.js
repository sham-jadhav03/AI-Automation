import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createMedicineService } from './medicine.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ingestMedicines = async () => {
    try {
        const csvPath = path.join(__dirname, '../seed/medicines.csv');
        const data = fs.readFileSync(csvPath, 'utf8');

        // Split by new line and remove header
        const lines = data
            .split('\n')
            .filter(line => line.trim() !== '');
        // Get headers
        const headers = lines.shift().split(',').map(h => h.trim());

        console.log(`Found ${lines.length} medicines to ingest...`);

        for (const line of lines) {
            const values = line.split(',').map(v => v.trim());
            const rawMedicine = {};

            headers.forEach((header, index) => {
                rawMedicine[header] = values[index];
            });

            const medicine = await createMedicineService({
                name: rawMedicine.name,
                genericName: rawMedicine.genericName,
                unitType: rawMedicine.unitType,
                prescriptionRequired: rawMedicine.prescriptionRequired === 'true'
            });

            return medicine;
        }
        console.log('Medicine ingestion complete.');
    } catch (error) {
        console.error('Error ingesting medicines:', error);
        throw error;
    }
};
