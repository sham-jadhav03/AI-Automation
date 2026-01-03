import Inventory from "../models/Inventory.model";


export const inventoryService = async ({
    stockName,
    stockId,
    stockQuantity,
    stockPrice,
    stockDescription,
    stockCategory,
    stockSubCategory,
    stockSupplier
}) => {
    if (!stockName || !stockId || !stockQuantity || !stockPrice || !stockDescription || !stockCategory || !stockSubCategory || !stockSupplier) {
        throw new Error("All fields are required");
    }

    const inventory = await Inventory.create({
        stockName,
        stockId,
        stockQuantity,
        stockPrice,
        stockDescription,
        stockCategory,
        stockSubCategory,
        stockSupplier
    });

    return inventory;

}