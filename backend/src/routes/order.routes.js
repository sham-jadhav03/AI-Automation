import express from "express";
import * as orderController from "../controllers/order.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authUser);

router.post("/create", orderController.createOrderController);
router.get("/get-my-orders", orderController.getMyOrdersController);
router.get("/:orderId", orderController.getOrderByIdController);

// Admin Route
router.get("/admin", authorizeRoles("admin"), orderController.getAllOrdersController);

export default router;
