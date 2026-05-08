import express from "express";
import { getBoardActivities } from "../controllers/ActivityController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();


// get all board activity logs
router.get("/:boardId", authMiddleware, getBoardActivities);

export default router;