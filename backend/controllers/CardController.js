import CardModel from "../models/cardModel.js";
import ListModel from "../models/listModel.js";

import { createActivity } from "./ActivityController.js";
// create card
export const createCard = async (req, res) => {
  try {

    const {
      title,
      description,
      listId,
      boardId,
      assignedTo,
      status,
    } = req.body;

    // validation
    if (!title || !listId || !boardId) {
      return res.status(400).json({
        message: "Title, listId and boardId required",
      });
    }

    // check list exists
    const list = await ListModel.findById(listId);

    if (!list) {
      return res.status(404).json({
        message: "List not found",
      });
    }

    // create card
    const card = await CardModel.create({
      title,
      description,
      listId,
      boardId,
      assignedTo,
      status,

      // drag-drop ordering
      order: Date.now(),
    });
await createActivity({
  boardId,
  listId,
  cardId: card._id,
  userId: req.user.id,
  action: "created card",
  details: `Created card ${title}`,
});
    res.status(201).json({
      message: "Card created successfully",
      card,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



//get all board cards
export const getBoardCards = async (req, res) => {
  try {

    const { boardId } = req.params;

    const cards = await CardModel.find({
      boardId,
    })
      .populate("assignedTo", "name email")
      .sort({ order: 1 });

    res.json(cards);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



//get list cards
export const getListCards = async (req, res) => {
  try {

    const { listId } = req.params;

    const cards = await CardModel.find({
      listId,
    })
      .populate("assignedTo", "name email")
      .sort({ order: 1 });

    res.json(cards);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



// update cards
export const updateCard = async (req, res) => {
  try {

    const { id } = req.params;

    const updatedCard = await CardModel.findByIdAndUpdate(
      id,
      req.body,
      {
        returnDocument: "after",
      }
    );

    if (!updatedCard) {
      return res.status(404).json({
        message: "Card not found",
      });
    }
await createActivity({
  boardId: updatedCard.boardId,
  listId: updatedCard.listId,
  cardId: updatedCard._id,
  userId: req.user.id,
  action: "updated card",
  details: `Updated card ${updatedCard.title}`,
});
    res.json({
      message: "Card updated successfully",
      updatedCard,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



// delete card
export const deleteCard = async (req, res) => {
  try {

    const { id } = req.params;

    const card = await CardModel.findById(id);

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }
await createActivity({
  boardId: card.boardId,
  listId: card.listId,
  cardId: card._id,
  userId: req.user.id,
  action: "deleted card",
  details: `Deleted card ${card.title}`,
});
    await CardModel.findByIdAndDelete(id);

    res.json({
      message: "Card deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



// move card
export const moveCard = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      newListId,
      newOrder,
    } = req.body;

    const card = await CardModel.findById(id);

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    // move card
    card.listId = newListId;

    // update order
    card.order = newOrder;

    await card.save();
await createActivity({
  boardId: card.boardId,
  listId: newListId,
  cardId: card._id,
  userId: req.user.id,
  action: "moved card",
  details: `Moved card ${card.title}`,
});
    res.json({
      message: "Card moved successfully",
      card,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



// reorder
export const reorderCards = async (req, res) => {
  try {

    const { cards } = req.body;

    // cards = [{id, order}]

    for (const item of cards) {
      await CardModel.findByIdAndUpdate(
        item.id,
        {
          order: item.order,
        }
      );
    }

    res.json({
      message: "Cards reordered successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};