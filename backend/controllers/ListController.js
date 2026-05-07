import ListModel from "../models/listModel.js";
import BoardModel from "../models/boardModel.js";


// CREATE LIST
export const createList = async (req, res) => {
  try {

    const { title, boardId } = req.body;

    // validation
    if (!title || !boardId) {
      return res.status(400).json({
        message: "Title and boardId required",
      });
    }

    // check board exists
    const board = await BoardModel.findById(boardId);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    // create list
    const list = await ListModel.create({
      title,
      boardId,

      // latest position
      order: Date.now(),
    });

    res.status(201).json({
      message: "List created successfully",
      list,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



// GET BOARD LISTS
export const getBoardLists = async (req, res) => {
  try {

    const { boardId } = req.params;

    const lists = await ListModel.find({
      boardId,
    }).sort({ order: 1 });

    res.json(lists);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



//UPDATE LIST 
export const updateList = async (req, res) => {
  try {

    const { id } = req.params;

    const { title } = req.body;

    const list = await ListModel.findByIdAndUpdate(
      id,
      {
        title,
      },
      {
        new: true,
      }
    );

    if (!list) {
      return res.status(404).json({
        message: "List not found",
      });
    }

    res.json({
      message: "List updated successfully",
      list,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



//  DELETE LIST 
export const deleteList = async (req, res) => {
  try {

    const { id } = req.params;

    const list = await ListModel.findById(id);

    if (!list) {
      return res.status(404).json({
        message: "List not found",
      });
    }

    await ListModel.findByIdAndDelete(id);

    res.json({
      message: "List deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



//REORDER LISTS
export const reorderLists = async (req, res) => {
  try {

    const { lists } = req.body;

    // lists = [{id, order}]

    for (const item of lists) {
      await ListModel.findByIdAndUpdate(
        item.id,
        {
          order: item.order,
        }
      );
    }

    res.json({
      message: "Lists reordered successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};