import mongoose from "mongoose";
import dotenv from "dotenv";

// export const connection = mongoose.connect(process.env.MONGO_URI)
export const connection = mongoose.connect("mongodb://localhost:27017/EcommerceNodeJs")

.then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err.message);
});