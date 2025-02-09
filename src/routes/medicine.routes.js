import { MedicineData } from "../controllers/Medicine.controller.js";
import { Router } from "express";

const medicineRouter = Router() 
medicineRouter.get("/MedicineData" , MedicineData );

export {medicineRouter}