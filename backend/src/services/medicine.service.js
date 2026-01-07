import medicineModel from "../models/medicine.model.js";

export const createMedicineService = async ({ name, genericName, unitType, generic, prescriptionRequired }) => {
    if (!name || !unitType) {
        throw new Error("All fields are required");
    }

    if (typeof prescriptionRequired !== 'boolean') {
        throw new Error("Prescription required must be a boolean");
    }

    const slug = name.toLowerCase().replace(/\s/g, '-');

    const existingMedicine = await medicineModel.findOne({ slug });

    if (existingMedicine) {
        throw new Error("Medicine already exists");
    }

    const medicine = await medicineModel.create({
        name,
        genericName,
        slug,
        unitType,
        prescriptionRequired
    });

    return medicine;
}

export const getAllMedicinesService = async () => {
    const medicines = await medicineModel.find();
    return medicines;
}
