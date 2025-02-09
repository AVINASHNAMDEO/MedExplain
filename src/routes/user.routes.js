import { registerUser } from "../controllers/User.controller.js";
import { loginUser } from "../controllers/User.controller.js";
import { Router } from "express";

const UserRouter = Router();
UserRouter.post("/register",registerUser)

UserRouter.get("/login",loginUser) 

export {UserRouter} ;