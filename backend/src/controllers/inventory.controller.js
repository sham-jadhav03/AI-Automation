import * as inventoryService from '../services/inventory.service.js';

export const createInventoryBatch = async (req, res, next) => {
    try {
        const inventory = await inventoryService.addInventoryBatch(req.body);

        return res.status(201).json({
            success: true,
            message: "Inventory batch created successfully",
            data: inventory
        });
    } catch (err) {
        console.error("Create Inventory Error:", err.message);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

export const getLowStockInventory = async (req, res, next) => {
    try {
        const stock = await inventoryService.getLowStockInventory();

        return res.status(200).json({
            success: true,
            data: stock
        });
    } catch (err) {
        console.error("Get Low Stock Error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve low stock inventory",
            error: err.message
        });
    }
};

export const getExpiringInventory = async (req, res, next) => {
    try {
        const days = req.query.days ? parseInt(req.query.days) : 30;
        const stock = await inventoryService.getExpiringInventory(days);

        return res.status(200).json({
            success: true,
            data: stock
        });
    } catch (err) {
        console.error("Get Expiring Inventory Error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve expiring inventory",
            error: err.message
        });
    }
};
