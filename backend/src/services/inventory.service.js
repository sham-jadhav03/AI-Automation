import Inventory from "../models/Inventory.model";
import medicineModel from "../models/medicine.model";
import inventoryModel from "../models/Inventory.model";


export const inventoryService = async ({
    medicine,
    batchNumber,
    expiryDate,
    quantityAvailable,
    reorderThreshold,
    supplier
}) => {
    if (!medicine || !batchNumber || !expiryDate === 'undefined' || !quantityAvailable === 'undefined' || !reorderThreshold === 'undefined' || !supplier) {
        throw new Error("All fields are required");
    }

    const medicineExists = await medicineModel.findById(medicine);

    if (!medicineExists) {
        throw new Error("Medicine not found");
    }

    const expiry = new Date(expiryDate);

    if (expiry <= new Date()) {
        throw new Error("Expiry date can must be in the future");
    }


    if (quantityAvailable < 0 || reorderThreshold < 0) {
        throw new Error('Quantity available and reorder threshold cannot be negative')
    }

    const existingBatch = await inventoryModel.findOne({
        medicine,
        batchNumber
    })

    if (existingBatch) {
        throw new Error("Inventory already exists");
    }

    const inventory = await Inventory.create({
        medicine,
        batchNumber,
        expiryDate,
        quantityAvailable,
        reorderThreshold,
        supplier
    });

    return inventory;

}