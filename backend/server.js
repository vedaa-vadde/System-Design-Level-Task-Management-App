import express from 'express'
import {config} from 'dotenv'
import {connect} from 'mongoose'
import cookieParser from "cookie-parser";
import AuthRoutes from "./routes/AuthRoutes.js"
import BoardRoutes from "./rou tes/BoardRoutes.js"


config()

const app=express()

//importing port
const port =process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

//routes
  //user
app.use("/api/auth",AuthRoutes);

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