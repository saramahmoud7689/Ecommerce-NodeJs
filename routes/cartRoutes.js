const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middlewares/authMiddleware.js");
const cartController = require("../controllers/cartController.js");

const router = express.Router();

router.post("/add-to-cart", authenticateUser, cartController.addToCart);//
router.get("/get-cart", authenticateUser, cartController.getUserCart);//
router.patch("/remove-from-cart", authenticateUser, cartController.removeFromCart);//
router.patch("/edit-quantity", authenticateUser, cartController.editQuantity); //
router.patch("/clear-cart", authenticateUser, cartController.clearCart);//
router.post("/checkout", authenticateUser, cartController.checkout);//
router.get("/get-orders", authenticateUser, cartController.getOrders);//
router.patch("/cancel-order/:orderId", authenticateUser, cartController.cancelOrder); //


router.patch("/status/:cartId", authenticateUser, authorizeRoles("admin"), cartController.updateOrderStatus);//
router.get("/get-all-orders", authenticateUser, authorizeRoles("admin"), cartController.getAllOrders);//
router.get("/get-user-orders/:uid", authenticateUser, authorizeRoles("admin"), cartController.getUserOrders);//
router.delete("/delete-order/:orderId", authenticateUser, authorizeRoles("admin"), cartController.deleteOrder); //
router.delete("/delete-all-orders", authenticateUser, authorizeRoles("admin"), cartController.deleteAllOrders);//
router.get("/payments" , authenticateUser , authorizeRoles("admin"), cartController.getPayments);

module.exports = router;
