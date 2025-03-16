const { required } = require("joi");
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true},
    amount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ["credit_card", "paypal", "cash"], required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    paymentDate: { type: Date, default: Date.now },
    transactionId: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;