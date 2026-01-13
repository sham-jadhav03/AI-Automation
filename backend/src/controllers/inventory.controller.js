import *as inventoryService from '../services/inventory.service';

export const createInventory = async (req, res) => {

    try {
        const inventory = await inventoryService.createInventory(req.body);

        return res.status(201).json(inventory);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

