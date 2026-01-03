import *as inventoryService from '../services/inventory.service';
import { validationResult } from 'express-validator';



export const createInventory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const inventory = await inventoryService.createInventory(req.body);
        res.status(201).json(inventory);


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

