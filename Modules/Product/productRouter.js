import express from "express";
import { validateProudct } from '../../Middleware/validateProudct'
import { createProudct, deleteProudct, getAll, getProudctbyId, updateProudct } from "./productController.js";
export const proudctRoute = express.Router()
proudctRoute.post("/proudct", validateProudct, createProudct)
proudctRoute.get("/proudcts", getAll)
proudctRoute.get("/proudct/:id", getProudctbyId)
proudctRoute.put("/proudct/:id", validateProudct, updateProudct)
proudctRoute.delete("/proudct/:id", deleteProudct)