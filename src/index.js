
import {connectDB} from './dbs/index.js';
import { app } from './app.js';
import dotenv from 'dotenv'
dotenv.config({
    path : "./.env"
})  // Load the .env file

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed!!", error);
  });
