import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true,
        index: true
    },
    batchNumber: {
        type: String,
        required: true,
        index: true
    },
    expiryDate: {
        type: Date,
        required: true,
        index: true
    },
    quantityAvailable: {
        type: Number,
        required: true,
        min: 0
    },
    reorderThreshold: {
        type: Number,
        required: true,
        min: 0
    },
    supplier: {
        type: String,
        required: true
    }

},
    {
        timestamps: true
    }
);

inventorySchema.index({
    medicine: 1,
    batchNumber: 1,
},
    { unique: true }
)

const Inventory = mongoose.model('inventory', inventorySchema)

export default Inventory;
