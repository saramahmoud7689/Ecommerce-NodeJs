import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    address: [
        {country: String},
        {city: String},
        {street: String},
        {building: Number},
        {floor: Number},
        {apartment: Number},
        {postal_code: Number},
    ],
    payment_details: {           //optinal
        type: String,
    },
    social_media_gmail: {        //optinal
        type: String,
        unique: true
    },
    is_confirmed: {
        type: Boolean,
    },
    role: {
        type: String,
        default: 'user'
    },
    // if +seller[roles](o)
    wishlist: [{             //optinal
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    order_history:[{
        order_details: [{   //optinal
            product_id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
            }
        }],
        payment_details: { //TODO what is payment details to be stored
            type: String,
        },
    }],
    my_cart:[{        //optinal
        product_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
        } 
    }] 
},{
    timestamps: true
});

const User = mongoose.model("User" , userSchema);

export default User;
