import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2
        },

        genericName: {
            type: String,
            trim: true
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true
        },

        unitType: {
            type: String,
            enum: ["tablet", "syrup", "capsule", "injection"],
            required: true
        },

        prescriptionRequired: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;
