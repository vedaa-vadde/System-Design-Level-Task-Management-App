import exp from 'express'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import {UserModel} from "../models/userModel.js";

//register

export const registerUser =async (req,res)=>{
    try{
        const {name,email,password}=req.body;

        //check if user exists

        const existingUser=await UserModel.findOne({email});
    

    if(existingUser){
     return res.status(400).json({message:"User already exists"});

    }
    //hashing passowrd
    const hashPassword=await bcrypt.hash(password,10);

    //create user in db
    const user=await UserModel.create({
        name,email,password:hashPassword,
    });

    res.status(201).json({message:"User registered sucesfully",user})


}catch(err){
    res.status(500).json({message:err.message});
}

};

//login

export const loginUser=async (req,res)=>{
try{
    const {name,email,password}=req.body;

    //find user
    const user=await UserModel.findOne({email});

    if(!user){
        return res.status(400).json({message:"Invalid credentials"});
    }

    //compare password

    const ismatch=await bcrypt.compare(password,user.password);

    if(!ismatch){
       return res.status(400).json({message:"Invalid credentials"});
    }
//generating token
    const token=jwt.sign({id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:'1d'});

//set cookie
res.cookie("token",token,{httpOnly:true,secure:false,maxAge:24*60*60*1000,})


res.json({message:"login successful",token,user});
}catch (err){
    res.status(500).json({message:err.message});
}
}; 

//logout

export const logoutUser=(req,res)=>{
    try{
    //clear cookie
    res.clearCookie("token");

    res.json({message:"logged oit sucessfully"});
}catch(err){
    res.status(500).json({message:err.message})
}
};