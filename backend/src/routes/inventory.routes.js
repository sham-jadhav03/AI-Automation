import { Router } from "express";
import * as inventoryController from "../controllers/inventory.controller.js";
import { body } from "express-validator";
import * as authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/create',
    inventoryController.createInventory);

export default router