import express from 'express'
import {config} from 'dotenv'
import {connect} from 'mongoose'
import cookieParser from "cookie-parser";
import AuthRoutes from "./routes/AuthRoutes.js"
<<<<<<< HEAD
import ListRoutes from "./routes/ListRoutes.js";
import CardRoutes from "./routes/CardRoutes.js";
=======
import BoardRoutes from "./routes/BoardRoutes.js"


>>>>>>> 6187754177083ba738cd1a4fdd05987f3b47e649
config()

const app=express()

//importing port
const port =process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
//routes
<<<<<<< HEAD
app.use("/api/lists", ListRoutes);
=======
  //user
>>>>>>> 6187754177083ba738cd1a4fdd05987f3b47e649
app.use("/api/auth",AuthRoutes);
app.use("/api/cards", CardRoutes);

//board routes

app.use("/api/boards",BoardRoutes);


const connectDB=async()=>{
    try{
        await connect(process.env.DB_URL)
        console.log("db connected");
        app.listen(port,()=>{
            console.log(`server running on port  http://localhost:${port}`)
        })
    }catch(err){
        console.log(err)
    }
};
connectDB();