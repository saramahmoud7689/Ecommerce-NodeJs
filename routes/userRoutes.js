const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middlewares/authMiddleware.js");
const { validate } = require("../middlewares/validateMiddleware.js");
const { userValidationRules } = require("../validators/userValidator.js");
const userController = require("../controllers/userController.js");
const {checkEmail} = require("../middlewares/checkEmail.js")

const router = express.Router();

router.post("/register", validate(userValidationRules) , checkEmail, userController.createUser);
router.post("/login", userController.loginUser);
router.get("/verify/:token", userController.verifyEmail)

// Admin Routes
router.get("/users", authenticateUser, authorizeRoles("admin"), userController.getAllUsers);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), userController.deleteUser);

module.exports = router;
