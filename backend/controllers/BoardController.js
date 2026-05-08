import BoardModel from "../models/boardModel.js";
import ListModel from "../models/ListModel.js";
import { createActivity } from "./ActivityController.js";
import { getIO } from "../sockets/socket.js";


// CREATE BOARD
export const createBoard = async (req, res, next) => {
  try {
    console.log("Create Board API called");

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Board title required",
      });
    }

    // create board
    const board = await BoardModel.create({
      title,
      owner: req.user.id,
      members: [req.user.id],
      isDefault: false,
    });

    console.log("Board created:", board._id);

    // activity log
    await createActivity({
      boardId: board._id,
      userId: req.user.id,
      action: "created board",
      details: `Created board ${board.title}`,
    });

    // default lists
    const defaultLists = [
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
      },
    ];

    await ListModel.insertMany(defaultLists);

    console.log("Default lists created");

    // populate owner details
    const populatedBoard = await BoardModel.findById(board._id)
      .populate("owner", "name email");

    // send board + default lists through socket
    const boardWithLists = {
      ...populatedBoard.toObject(),
      lists: defaultLists,
    };

    const io = getIO();

    io.emit("board-created", boardWithLists);

    console.log("Socket emitted: board-created");

    // response
    res.status(201).json({
      message: "Board created successfully",
      board: boardWithLists,
    });

  } catch (err) {
    next(err);
  }
};



// GET ALL BOARDS
export const getBoards = async (req, res, next) => {
  try {
    console.log("Get Boards API called");

    const boards = await BoardModel.find({
      members: req.user.id,
    })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(boards);

  } catch (err) {
    next(err);
  }
};



// GET SINGLE BOARD
export const getSingleBoard = async (req, res, next) => {
  try {
    console.log("Get Single Board API called");

    const { id } = req.params;

    const board = await BoardModel.findById(id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    res.json(board);

  } catch (err) {
    next(err);
  }
};



// DELETE BOARD
export const deleteBoard = async (req, res, next) => {
  try {
    console.log("Delete Board API called");

    const { id } = req.params;

    const board = await BoardModel.findById(id);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    // only owner can delete
    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    // activity log
    await createActivity({
      boardId: board._id,
      userId: req.user.id,
      action: "deleted board",
      details: `Deleted board ${board.title}`,
    });

    // delete board
    await BoardModel.findByIdAndDelete(id);

    // delete board lists
    await ListModel.deleteMany({
      boardId: id,
    });

    // socket emit
    const io = getIO();

    io.emit("board-deleted", id);

    console.log("Socket emitted: board-deleted");

    res.json({
      message: "Board deleted successfully",
    });

  } catch (err) {
    next(err);
  }
};