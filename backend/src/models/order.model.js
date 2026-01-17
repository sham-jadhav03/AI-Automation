import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },

},
    { _id: false }
)

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    items: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: function (items) {
                return Array.isArray(items) && items.length > 0
            },
            message: "Order must contain at least one item"
        }
    },
    status: {
        type: String,
        required: true,
        enum: ["PENDING", "CONFIRMED", "CANCELLED"],
        default: "PENDING",
        index: true
    },
    requiresPrescription: {
        type: Boolean,
        required: true,
    },
    totalItems: {
        type: Number,
        required: true,
    }

},
    { timestamps: true }
)

const Order = mongoose.model("Order", orderSchema)

export default Order
