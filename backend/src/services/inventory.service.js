import Inventory from "../models/Inventory.model.js";
import Medicine from "../models/medicine.model.js";

export const addInventoryBatch = async (data) => {
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