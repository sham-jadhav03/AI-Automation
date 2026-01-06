import { Router } from "express";
import * as inventoryController from "../controllers/inventory.controller.js";
import { body } from "express-validator";
import * as authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/create',
    body('stockName').isLength({ min: 3 }).withMessage('Stock name must be at least 3 characters long'),
    body('stockId').isLength({ min: 3 }).withMessage('Stock id must be at least 3 characters long'),
    body('stockQuantity').isLength({ min: 3 }).withMessage('Stock quantity must be at least 3 characters long'),
    body('stockPrice').isLength({ min: 3 }).withMessage('Stock price must be at least 3 characters long'),
    body('stockDescription').isLength({ min: 3 }).withMessage('Stock description must be at least 3 characters long'),
    body('stockCategory').isLength({ min: 3 }).withMessage('Stock category must be at least 3 characters long'),
    body('stockSubCategory').isLength({ min: 3 }).withMessage('Stock sub category must be at least 3 characters long'),
    body('stockSupplier').isLength({ min: 3 }).withMessage('Stock supplier must be at least 3 characters long'),
    inventoryController.createInventory
);

export default router