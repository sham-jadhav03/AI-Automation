import * as orderService from "../services/order.service.js";

export const createOrderController = async (req, res, next) => {
    try {
        const userId = req.user._id;
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
