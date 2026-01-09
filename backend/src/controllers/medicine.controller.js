import * as medicineService from "../services/medicine.service.js";


export const createMedicineController = async (req, res) => {
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
