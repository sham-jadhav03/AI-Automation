import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Medicine from "../models/medicine.model.js";
import Inventory from "../models/inventory.model.js";
import { adjustInventoryOnSale, restockInventory } from "./inventory.service.js";

export const createOrder = async ({ userId, items }) => {
    if (!userId) {
        throw new Error("User ID is required");
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error("Order must contain at least one item");
    }

    const aggregatedItems = new Map();

    for (const item of items) {
        if (!item.medicine) {
            throw new Error("Item must have a medicine ID");
        }
        if (!item.quantity || item.quantity <= 0) {
            throw new Error(`Invalid quantity for medicine ${item.medicine}`);
        }

        const currentQty = aggregatedItems.get(item.medicine) || 0;
        aggregatedItems.set(item.medicine, currentQty + item.quantity);
    }

    const uniqueItemsBuffer = [];
    let totalItems = 0;

    for (const [medicineId, quantity] of aggregatedItems) {
        if (!mongoose.Types.ObjectId.isValid(medicineId)) {
            throw new Error(`Invalid Medicine ID format: ${medicineId}`);
        }
        const medicine = await Medicine.findById(medicineId);

        if (!medicine) {
            throw new Error(`Medicine with ID ${medicineId} not found`);
        }

        if (medicine.prescriptionRequired) {
            throw new Error(`Medicine "${medicine.name}" requires a prescription. Orders for prescription medicines are not supported yet.`);
        }

        uniqueItemsBuffer.push({ medicineId, quantity });
        totalItems += quantity;
    }

    const successfulDeductions = [];

    try {
        for (const { medicineId, quantity } of uniqueItemsBuffer) {
            const result = await adjustInventoryOnSale(medicineId, quantity);
            successfulDeductions.push(result);
        }
    } catch (deductionError) {
        await rollbackInventory(successfulDeductions);
        throw deductionError;
    }

    // Create Order
    try {
        const orderData = {
            user: userId,
            items: Array.from(aggregatedItems.entries()).map(([medicine, quantity]) => ({
                medicine,
                quantity
            })),
            status: "CONFIRMED",
            requiresPrescription: false,
            totalItems: totalItems
        };

        const order = await Order.create(orderData);
        return order;

    } catch (createError) {
        await rollbackInventory(successfulDeductions);
        throw new Error(`Order creation failed: ${createError.message}`);
    }
};

const rollbackInventory = async (successfulDeductions) => {
    for (const deduction of successfulDeductions) {
        for (const batchInfo of deduction.consumedBatches) {
            try {
                const batch = await Inventory.findOne({
                    medicine: deduction.medicine,
                    batchNumber: batchInfo.batchNumber
                });

                if (batch) {
                    await restockInventory(batch._id, batchInfo.deducted);
                } else {
                    await restockInventory(deduction.medicine, batchInfo.deducted);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
};

export const getUserOrders = async (userId) => {
    return await Order.find({ user: userId })
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

/**
 * Get all orders (Admin Only)
 */
export const getAllOrders = async () => {
    return await Order.find({})
        .sort({ createdAt: -1 })
        .populate("items.medicine", "name genericName unitType")
        .populate("user", "name email roles");
};