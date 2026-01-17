import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Medicine from "../models/medicine.model.js";
import userModel from "../models/user.model.js";
import { adjustInventoryOnSale } from "./inventory.service.js";

export const createOrder = async ({ userId, items }) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Order must contain at least one item");
    }

    const aggregatedItems = new Map();

    for (const item of items) {
        if (!item.medicine) {
            throw new Error("Each item must have a medicine ID");
        }

        if (!item.quantity || item.quantity <= 0) {
            throw new Error(`Invalid quantity for medicine ${item.medicine}`);
        }

        const key = String(item.medicine);
        aggregatedItems.set(key, (aggregatedItems.get(key) || 0) + item.quantity);
    }

    const medicineIds = Array.from(aggregatedItems.keys());

    for (const id of medicineIds) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`Invalid Medicine ID format: ${id}`);
        }
    }

    const medicines = await Medicine.find({ _id: { $in: medicineIds } });

    if (medicines.length !== medicineIds.length) {
        throw new Error("One or more medicines not found");
    }

    const requiresPrescription = medicines.some(
        m => m.prescriptionRequired === true
    );

    if (requiresPrescription) {
        throw new Error(
            "One or more medicines require a prescription. Ordering not supported yet."
        );
    }

    for (const [medicineId, quantity] of aggregatedItems.entries()) {
        await adjustInventoryOnSale(medicineId, quantity);
    }

    const totalItems = Array.from(aggregatedItems.values())
        .reduce((sum, q) => sum + q, 0);

    const order = await Order.create({
        user: userId,
        items: Array.from(aggregatedItems.entries()).map(
            ([medicine, quantity]) => ({ medicine, quantity })
        ),
        status: "CONFIRMED",
        requiresPrescription: false,
        totalItems
    });

    return order;
};

export const getUserOrders = async (userId) => {
    return Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("items.medicine", "name genericName unitType");
};

export const getOrderById = async (orderId, userId) => {
    const order = await Order.findOne({ _id: orderId, user: userId })
        .populate("items.medicine", "name genericName unitType")
        .populate("user", "name email");

    if (!order) {
        throw new Error("Order not found");
    }

    return order;
};

export const getAllOrders = async () => {
    return Order.find({})
        .sort({ createdAt: -1 })
        .populate("items.medicine", "name genericName unitType")
        .populate("user", "name email role");
};