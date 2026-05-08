import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { UserModel } from "../models/userModel.js";
import BoardModel from "../models/boardModel.js";
import ListModel from "../models/ListModel.js";


// REGISTER
export const registerUser = async (req, res, next) => {
  try {
    console.log("Register API called");

    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password required",
      });
    }

    // existing user check
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("User created:", user._id);

    /*
      Create default boards:
      Professional
      Personal
    */
    const defaultBoards = [
      {
        title: "Professional",
        owner: user._id,
        members: [user._id],
        isDefault: true,
      },
      {
        title: "Personal",
        owner: user._id,
        members: [user._id],
        isDefault: true,
        },
    ];

    const createdBoards = await BoardModel.insertMany(
      defaultBoards
    );

    console.log("Default boards created");

    /*
      Create default lists:
      Today
      This Week
      Later
    */
    const defaultLists = [];

    createdBoards.forEach((board) => {
      defaultLists.push(
        {
          title: "Today",
          boardId: board._id,
          order: 1,
        },
        {
          title: "This Week",
          boardId: board._id,
          order: 2,
        },
        {
          title: "Later",
          boardId: board._id,
          order: 3,
        }
      );
    });

    await ListModel.insertMany(defaultLists);

    console.log("Default lists created");

    res.status(201).json({
      message: "User registered successfully",
      user,
    });

  } catch (err) {
    next(err);
  }
};



// LOGIN
export const loginUser = async (req, res, next) => {
  try {
    console.log("Login API called");

    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    // find user
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log("Login successful");

    res.json({
      message: "Login successful",
      token,
      user,
    });

  } catch (err) {
    next(err);
  }
};



// LOGOUT
export const logoutUser = async (req, res, next) => {
  try {
    console.log("Logout API called");

    res.clearCookie("token");

    res.json({
      message: "Logged out successfully",
    });

  } catch (err) {
    next(err);
  }
};