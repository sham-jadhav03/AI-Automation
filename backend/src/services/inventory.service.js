import Inventory from "../models/inventory.model.js";
import Medicine from "../models/medicine.model.js";

export const addInventoryBatch = async (data = {}) => {
    const {
        medicine,
        batchNumber,
        expiryDate,
        quantityAvailable,
        reorderThreshold,
        supplier
    } = data;


    if (!medicine || !batchNumber || expiryDate === undefined || quantityAvailable === undefined || reorderThreshold === undefined || !supplier) {
        throw new Error("All fields are required: medicine, batchNumber, expiryDate, quantityAvailable, reorderThreshold, supplier");
    }

    if (quantityAvailable < 0) {
        throw new Error("Quantity available cannot be negative");
    }
    if (reorderThreshold < 0) {
        throw new Error("Reorder threshold cannot be negative");
    }

    const expiryProxy = new Date(expiryDate);
    if (isNaN(expiryProxy.getTime())) {
        throw new Error("Invalid expiry date format");
    }
    if (expiryProxy <= new Date()) {
        throw new Error("Expiry date must be in the future");
    }

    const existingMedicine = await Medicine.findById(medicine);
    if (!existingMedicine) {
        throw new Error(`Medicine with ID ${medicine} not found`);
    }

    const existingBatch = await Inventory.findOne({
        medicine,
        batchNumber
    });

    if (existingBatch) {
        throw new Error(`Batch ${batchNumber} already exists for this medicine`);
    }

    const inventory = await Inventory.create({
        medicine,
        batchNumber,
        expiryDate: expiryProxy,
        quantityAvailable,
        reorderThreshold,
        supplier
    });

    return inventory;
};

export const getLowStockInventory = async () => {
    const lowStockItems = await Inventory.find({
        $expr: { $lte: ["$quantityAvailable", "$reorderThreshold"] }
    }).populate('medicine', 'name genericName unitType');

    return lowStockItems;
};

export const getExpiringInventory = async (days = 30) => {
    const referencesDate = new Date();
    const targetDate = new Date();
    targetDate.setDate(referencesDate.getDate() + days);

    const expiringItems = await Inventory.find({
        expiryDate: {
            $gte: referencesDate,
            $lte: targetDate
        }
    }).populate('medicine', 'name genericName unitType');

    return expiringItems;
};

export const adjustInventoryOnSale = async (medicineId, quantity) => {
    const medicineExists = await Medicine.findById(medicineId);
    if (!medicineExists) {
        throw new Error(`Medicine with ID ${medicineId} not found`);
    }
    if (quantity <= 0) {
        throw new Error("Quantity to deduct must be greater than zero");
    }

    const batches = await Inventory.find({
        medicine: medicineId,
        quantityAvailable: { $gt: 0 },
        expiryDate: { $gt: new Date() }
    }).sort({ expiryDate: 1 });

    const totalAvailable = batches.reduce((sum, batch) => sum + batch.quantityAvailable, 0);

    if (totalAvailable < quantity) {
        throw new Error(`Insufficient stock. Available: ${totalAvailable}, Requested: ${quantity}`);
    }

    let remainingToDeduct = quantity;
    const consumedBatches = [];

    for (const batch of batches) {
        if (remainingToDeduct <= 0) break;

        const deduction = Math.min(batch.quantityAvailable, remainingToDeduct);

        batch.quantityAvailable -= deduction;
        remainingToDeduct -= deduction;

        await batch.save();

        consumedBatches.push({
            batchNumber: batch.batchNumber,
            deducted: deduction
        });
    }

    return {
        medicine: medicineId,
        requestedQuantity: quantity,
        consumedBatches
    };
};

export const restockInventory = async (batchId, quantity) => {
    if (!batchId) {
        throw new Error("Batch ID is required");
    }
    if (quantity <= 0) {
        throw new Error("Restock quantity must be greater than zero");
    }

    const batch = await Inventory.findById(batchId);

    if (!batch) {
        throw new Error(`Inventory batch with ID ${batchId} not found`);
    }

    batch.quantityAvailable += quantity;
    await batch.save();

    return batch;
};