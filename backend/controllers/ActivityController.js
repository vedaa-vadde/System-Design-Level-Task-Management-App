import ActivityModel from "../models/activityModel.js";


// create activity
export const createActivity = async ({
  boardId,
  listId = null,
  cardId = null,
  userId,
  action,
  details = "",
}) => {
  try {
    await ActivityModel.create({
      boardId,
      listId,
      cardId,
      userId,
      action,
      details,
    });
  } catch (err) {
    console.log("Activity log error:", err.message);
  }
};


// get board activities
export const getBoardActivities = async (req, res) => {
  try {
    const { boardId } = req.params;

    const activities = await ActivityModel.find({
      boardId,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(activities);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};