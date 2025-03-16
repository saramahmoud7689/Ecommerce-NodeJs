const Cart = require("../models/Cart");
const Product = require("../models/product");
const User = require("../models/User");
const PromoCode = require("../models/PromoCode");
const product = require("../models/product");
const Payment = require('../models/Payment')


//                  user cart

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // console.log(req.body);

        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        // console.log(user)

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });
        // console.log(product)

        const existingProduct = user.cart.find(p => p.productId.toString() === productId);
        console.log("product exist: " + existingProduct)
        if (existingProduct) {
            if (existingProduct.quantity + quantity > product.quantity) return res.status(400).json({ message: `There are ${product.quantity - quantity} other items left in stock` });
            existingProduct.quantity += quantity;
        } else {
            user.cart.push({ productId, quantity });
        }

        await user.save();
        res.status(201).json(user.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("cart");
        if (!user) return res.status(404).json({ message: "user not found" });

        res.json({ user_Cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;

        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        console.log(user);

        user.cart = user.cart.filter(p => p.productId.toString() !== productId);
        // user.cart = user.cart.filter(p => p._id.toString() !== productId);


        await user.save();
        console.log(user.cart)
        res.status(200).json({ message: "product deleted successfully!", user_cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.editQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        console.log(req.user.id);
        let user = await User.findById(req.user.id);
        console.log(user)
        if (!user) return res.status(404).json({ message: "User not found" });

        const product = await Product
            .findById(productId)
            .select("quantity");
        if (!product) return res.status(404).json({ message: "Product not found" });
        console.log(product)
        console.log("before: " + user.cart)
        let over = false
        user.cart = user.cart.map(p => {
            if (p.productId.toString() === productId) {
                if (quantity > product.quantity) {
                    over = true;
                } else {
                    p.quantity = quantity;
                }
            }
            return p;
        });
        if (over) return res.status(400).json({ message: "Quantity is more than the available quantity" });
        await user.save();
        console.log("after: " + user.cart)
        res.status(200).json({ message: "Quantity updated successfully", user_cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.clearCart = async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.cart = [];
        await user.save();

        res.status(200).json({ message: "cart cleard successfully", user_cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//                  user orders  (orderHistory)
exports.checkout = async (req, res) => {
    try {
        const promoCode = req.body.promoCode;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        const cart = user.cart;
        if (cart.length === 0) return res.status(404).json({ message: "Cart is empty" });


        let total = 0;
        for (let item of cart) {
            const productId = item.productId;
            const product = await Product.findById(productId);
            if (!product) return res.status(404).json({ message: "Product not found", productId });
            if (product.quantity < item.quantity) return res.status(400).json({ message: "Product quantity is not enough" });
            product.quantity -= item.quantity;
            await product.save();
            let productPrice = product.priceAfterDiscount ? product.priceAfterDiscount : product.price;
            total += productPrice * item.quantity;
        }
        let new_order = { userId: req.user.id, products: cart, total: total };

        if (promoCode) {
            promo = await PromoCode.findOne({ code: promoCode });
            if (!promo) return res.status(404).json({ message: "Promo code not found" });
            total -= total * promo.discount;
            new_order.total = total;
            new_order.promoCode = promo._id;
        }  
      

        const order = await Cart.create(new_order);
        if (!order) return res.status(400).json({ message: "Failed to create order" });
        

        user.orderHistory.push({ orderId: order._id, orderDetails: cart, paymentDetails: `Total: ${total}` });
        user.cart = [];
        await user.save();

        const {paymentMethod} = req.body;

        console.log(order._id.toString())
        
        let paymentObject = {
            userId: req.user.id,
            orderId: order._id,
            amount: total,
            paymentMethod,
        }
        console.log(paymentObject)

        const paymentCheck = await Payment.insertOne(paymentObject);
        console.log(paymentCheck)
        // const newPayment = await Payment.create({
        //     userId: req.user.id,
        //     orderId: order._id,
        //     amount: total,
        //     paymentMethod
        //   });

        //   console.log(newPayment);
        //   if(newPayment){
        //     newPayment.status = "completed";
        //     await newPayment.save();
        //   }else{
        //     newPayment.status = "failed";
        //     await newPayment.save();
        //     res.status(500).json({ message: "transaction failed please try again later"})
        //   }

        res.status(200).json({ message: "Checkout successful", user, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getOrders = async (req, res) => {
    try {
        let userId = req.user.id;
        const user = await User.findById(userId);

        res.status(200).json(user.orderHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Cart.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if(req.user.id != order.userId) res.status(400).json({ message: "you must own this order to cancel it"})

        if (order.status !== 'canceled') {
            order.orderStatus = "canceled";
            await order.save();

            for (item of order.products) {
                let product = await Product.findById(item.productId);
                product.quantity += item.quantity;
                await product.save();
            }

            res.status(200).json({ message: "order canceled successfully!" });
        }else{
            res.status(200).json({ message: "order already canceled!" });
        }

        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



//                  Admin only
exports.updateOrderStatus = async (req, res) => {
    try {
        const { cartId } = req.params;
        const { orderStatus } = req.body;

        const cart = await Cart.findById(cartId);
        if (!cart) return res.status(404).json({ message: "Order not found" });

        cart.orderStatus = orderStatus;
        await cart.save();

        res.json({ message: "Order status updated successfully", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Cart.find();
        if (!orders) return res.status(404).json({ message: "No orders found" });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Cart.findByIdAndDelete(req.params.orderId);

        for (item of deletedOrder.products) {
            let product = await Product.findById(item.productId);
            product.quantity += item.quantity;
            await product.save();
        }

        let user = await User.findById(deletedOrder.userId);
        user.orderHistory.filter(order => order.orderId != deletedOrder._id);
        console.log(user.orderHistory);
        await user.save();

        //TODO notify user

        res.status(200).json({ message: "Order deleted successfully!", deletedOrder });
    } catch {
        res.status(500).json({ message: error.message });
    }
}
exports.deleteAllOrders = async (req, res) => {
    try {
        const deleteOrders = await Cart.deleteMany();

        for (deletedOrder of deleteOrders) {
            if (deletedOrder.orderStatus === 'ordered') {
                for (item of deletedOrder.products) {
                    let product = await Product.findById(item.productId);
                    product.quantity += item.quantity;
                    await product.save();
                }

                let user = await User.findById(deletedOrder.userId);
                user.orderHistory.filter(order => order.orderId != deletedOrder._id);
                console.log(user.orderHistory);
                await user.save();
            }

            //TODO notify user
        }

        res.status(200).json({ message: `Deleted ${deleteOrders.deletedCount} Orders` })
    } catch {
        res.status(500).json({ message: error.message });
    }
}

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Cart.find({ userId: req.params.uid }).populate("products.productId");
        if (!orders) return res.status(404).json({ message: "user doesn't have orders yet" });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPayments = async(req, res) =>{
    try{
        const payments = await Payment.find();
        if(!payments) res.status(500).json({ message: "can't get payments"});

        res.status(200).json({payments});
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}