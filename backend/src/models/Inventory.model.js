import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    stockName: {
        type: String,
        required: true,
        unique: true
    },

    stockId: {
        type: String,
        required: true,
        unique: true
    },

    stockQuantity: {
        type: Number,
        required: true
    },
    stockPrice: {
        type: Number,
        required: true
    },

    stockDescription: {
        type: String,
        required: true
    },
    stockCategory: {
        type: String,
        required: true
    },
    stockSubCategory: {
        type: String,
        required: true
    },
    stockSupplier: {
        type: String,
        required: true
    }

});

const Inventory = mongoose.model('inventory', inventorySchema)

export default Inventory;
