const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../Email/email.js")


// Register User
exports.createUser = async (req, res) => {

    try {
        const { email, password, role } = req.body;

        // Prevent users from registering as admin
        if (role === "admin") {
            return res.status(403).json({ message: "Admin accounts can only be created by an existing admin." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const user = new User(req.body);
        await user.save();

        console.log("Sending email to:", req.body.email);
        sendEmail(req.body.email);
        console.log("Email function executed");

        // const token = jwt.sign({ id: user._id, role: user.role }, "secret", { expiresIn: "1d" });

        res.status(201).json({  message: "success" , user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        if(!user.isConfirmed){
            return res.status(400).json({ message: "user not confirmed yet!"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, "secret" , { expiresIn: "1d" });

        res.json({ message: "success" , user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin - Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin - Delete User
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.deleteOne();
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyEmail =  (req,res) => {
    const token = req.params.token
    console.log(token)
    jwt.verify(token, "myemail",async (err, decoded) => {
        if(err){
         return  res.status(401).json({message: "Invalid token"})
        }
        const email = decoded;
        // const email = decoded.email; 

        console.log(email)
        await User.findOneAndUpdate({email: email}, {isConfirmed: true})


        res.json({message: "Email verified"})
    })
}