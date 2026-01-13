import { Router } from "express";
import * as inventoryController from "../controllers/inventory.controller.js";
import * as authMiddleware from "../middlewares/auth.middleware.js";
import * as roleMiddleware from "../middlewares/role.middleware.js";

const router = Router();

// Access: Admin only
router.post('/create',
    authMiddleware.authUser,
    roleMiddleware.authorizeRoles('admin'),
    inventoryController.createInventoryBatch
);

router.get('/low-stock',
    authMiddleware.authUser,
    roleMiddleware.authorizeRoles('admin'),
    inventoryController.getLowStockInventory
);

router.get('/expiry',
    authMiddleware.authUser,
    roleMiddleware.authorizeRoles('admin'),
    inventoryController.getExpiringInventory
);

export default router;