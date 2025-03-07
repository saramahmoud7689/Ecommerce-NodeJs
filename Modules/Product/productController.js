import { productModel } from "../../DB/Models/productModel.js"
import mongoose from "mongoose";
import { catchError } from "../../Middleware/catchError.js";
//get
export const getAll = catchError(async(req, res) => {
        const allproudct = await productModel.find();
        res.status(200).json({ message: "Done", allproudct })
    })
    //post
export const createProudct = catchError(async(req, res) => {
        const createdProudct = await productModel.insertMany(req.body);
        res.status(201).json(createdProudct);

    })
    //put
export const updateProudct = catchError(async(req, res) => {
        const proudctId = req.params.id;
        const proudct = await productModel.findById(proudctId);

        if (!proudct) {
            return res.status(404).json({ message: "Note not found" });
        }

        const updateProudct = await productModel.findByIdAndUpdate(proudctId, req.body, { new: true });

        res.status(200).json({ message: "proudct updated successfully", updateProudct });
    })
    // delete one 
export const deleteProudct = catchError(async(req, res) => {
        const proudctId = req.params.id;
        const proudct = await productModel.findById(proudctId);
        if (!proudct) {
            return res.status(404).json({ message: "Note not found" });
        }

        await productModel.findByIdAndDelete(proudctId);
        res.status(200).json({ message: "proudct deleted successfully" });
    })
    // get proudct by id 
export const getProudctbyId = catchError(async(req, res) => {
    const proudctId = req.params.id;
    const proudct = await productModel.findById(proudctId);
    if (!proudct) {
        return res.status(404).json({ message: "proudct not found" });
    }
    res.status(200).json({ proudct });
})