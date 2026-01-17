import * as orderService from "../services/order.service.js";

export const createOrderController = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // 1. Check if body exists (Parser issue or empty body)
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: "Request body received is empty. Did you set 'Content-Type: application/json' and allow a raw JSON body?"
            });
        }

        // 2. Check for items array
        if (!req.body.items) {
            return res.status(400).json({
                error: "Missing required field: 'items'. Payload must look like: { items: [{ medicine: 'ID', quantity: 1 }] }"
            });
        }

        const { items } = req.body;

        const order = await orderService.createOrder({ userId, items });

        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

export const getMyOrdersController = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const orders = await orderService.getUserOrders(userId);

        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

export const getOrderByIdController = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        const order = await orderService.getOrderById(orderId, userId);

        res.status(200).json(order);
    } catch (error) {
        // If it's a "Not Found" error, we might want 404, but default middleware usually handles errors.
        if (error.message === "Order not found") {
            return res.status(404).json({ error: "Order not found" });
        }
        next(error);
    }
};

export const getAllOrdersController = async (req, res, next) => {
    try {
        const orders = await orderService.getAllOrders();

        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};
