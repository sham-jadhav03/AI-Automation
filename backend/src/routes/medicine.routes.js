import { Router } from "express";
import * as medicineController from "../controllers/medicine.controller.js";
import { body } from "express-validator";

const router = Router();

router.post('/create',
    body('name').isString().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('unitType').isIn(['tablet', 'syrup', 'capsule', 'injection']).withMessage('Invalid unit type'),
    body('prescriptionRequired').optional().isBoolean().withMessage('Prescription required must be a boolean'),
    medicineController.createMedicineController
);

router.get('/get-all', medicineController.getAllMedicinesController);

export default router;
