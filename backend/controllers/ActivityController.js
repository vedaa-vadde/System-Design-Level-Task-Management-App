import ActivityModel from "../models/activityModel.js";
import { getIO } from "../sockets/socket.js";


// CREATE ACTIVITY
export const createActivity = async ({
  boardId,
  listId = null,
  cardId = null,
  userId,
  action,
  details = "",
}) => {
  try {
    const activity = await ActivityModel.create({
      boardId,
      listId,
      cardId,
      userId,
      action,
      details,
    });

    // populate user details
    const populatedActivity = await ActivityModel.findById(
      activity._id
    ).populate("userId", "name email");

    // socket emit realtime activity feed
    const io = getIO();

    io.to(boardId.toString()).emit(
      "activity-created",
      populatedActivity
    );

    console.log("Socket emitted: activity-created");

    return populatedActivity;

  } catch (err) {
    console.error(
      "Activity creation failed:",
      err.message
    );

    throw err;
  }
};



// GET BOARD ACTIVITIES
export const getBoardActivities = async (
  req,
  res,
  next
) => {
  try {
    console.log("Get Activities API called");

    const { boardId } = req.params;

    const activities = await ActivityModel.find({
      boardId,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(activities);

  } catch (err) {
    next(err);
  }
};