import express from "express";

import {createBoard,getBoards,getSingleBoard,deleteBoard} from "../controllers/BoardController.js";

import {authMiddleware} from "../middlewares/AuthMiddleware.js";

const router=express.Router();

//create custom board
router.post("/",authMiddleware,createBoard);

//get all boards
router.get("/",authMiddleware,getBoards);

//get signle board
router.get("/:id",authMiddleware,getSingleBoard);

//delete board

router.delete("/:id",authMiddleware,deleteBoard);

export default router;