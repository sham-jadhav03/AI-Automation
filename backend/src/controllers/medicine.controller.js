import * as medicineService from "../services/medicine.service.js";
import { validationResult } from "express-validator";

export const createMedicineController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const medicine = await medicineService.createMedicineService(req.body);
        return res.status(201).json({ medicine });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err.message });
    }
};

export const getAllMedicinesController = async (req, res) => {
    try {
        const medicines = await medicineService.getAllMedicinesService();
        return res.status(200).json({ medicines });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
