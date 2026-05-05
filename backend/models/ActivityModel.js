import { Schema, model } from "mongoose";

const ActivitySchema = new Schema({
    boardId:{
        type:Schema.Types.ObjectId,
        ref:"BoardModel",
        required:true
    },

    listId:{
        type:Schema.Types.ObjectId,
        ref:"ListModel"
    },

    cardId:{
        type:Schema.Types.ObjectId,
        ref:"CardModel"
    },

    userId:{
        type:Schema.Types.ObjectId,
        ref:"UserModel",
        required:true
    },

    action:{
        type:String,
        required:true
    },

    details:{
        type:String
    }

},{
    timestamps:true
});

export default model("ActivityModel", ActivitySchema);