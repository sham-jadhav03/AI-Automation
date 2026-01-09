import { Router } from "express";
import * as medicineController from "../controllers/medicine.controller.js";


const router = Router();

router.post('/create',
    medicineController.createMedicineController
);

router.get('/get-all', medicineController.getAllMedicinesController);

export default router;
