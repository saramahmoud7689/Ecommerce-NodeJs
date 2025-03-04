import userModel from "../DB/Models/userModel.js";
import bcrypt from "bcrypt"

export const checkEmail = async (req, res, next) => {
// check email 
    const userFound = await userModel.findOne({email: req.body.email})
    if(userFound) return res.json({message: "User Already Exist"})
    // req.body.password = bcrypt.hashSync(req.body.password, 8)
    next()
}