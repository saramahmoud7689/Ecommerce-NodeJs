import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Too short"]
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
        minlength: [15, "Too short product description"]
    },
    quantity: {
        type: Number,
        required: [true, "Product quantity is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        max: [200000, "Too high product price"]
    },
    imageCover: {
        type: String,
        required: [true, "Product image cover is required"]
    },
    images: [String],
    category: {
        type: String,
        required: [true, "Product category is required"]
    }
}, { timestamps: true });

export const productModel = mongoose.model("Product", productSchema);