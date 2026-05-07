import {Schema,model} from "mongoose";

const cardSchema=new Schema({
    title:{
        type:String,
        required:[true,"title required"],
        trim: true,
    },

    description:{
        type:String,
        default:"",
    },
     //lisst cards belon to
    listId:{
        type:Schema.Types.ObjectId,
        ref:"ListModel",
        required:true,
    },
     // which board this card belongs to
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "BoardModel",
      required: true,
    },
   //position in list-drag drop order
    order:{
        type:Number,
        default:0,
    },
   //assigned user
    assignedTo:[{
        type:Schema.Types.ObjectId,
        ref:"UserModel",
    }],
    status:{
        type:String,
        enum:["done","ongoing","pending"],
        default:"ongoing",
    },
//files
<<<<<<< HEAD
    attachments:[
       {
        type:String,
       },
    ],
       },
   
=======
    attachments:[{
        type:String,
 } ]

},
>>>>>>> 6187754177083ba738cd1a4fdd05987f3b47e649
{
timestamps:true
}

);

export default model("Card",cardSchema);