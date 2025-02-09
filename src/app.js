import express from "express"
// routes 
import { UserRouter } from "./routes/user.routes.js"
import { medicineRouter } from "./routes/medicine.routes.js";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
// import cors from "cors"

dotenv.config({
    path : './.env'
})
const app = express();
app.use(cookieParser())


app.use(express.json({limit : "16kb"}))

 //routes declaration

 app.use("/api/v1/users",UserRouter)
 app.use("/api/v2",medicineRouter)

 // http://localhost:5000/api/v1/users/register

export {app}