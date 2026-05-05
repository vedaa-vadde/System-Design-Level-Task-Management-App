import {Schema,model} from "mongoose";

const cardSchema=new Schema({
    title:{
        type:String,
        required:[true,"title required"],
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
   //position in list
    order:{
        type:Number,
        default:0,
    },
   //assigned user
    assignedTo:[{
        type:Schema.Types.ObjectId,
        ref:"UserModel",
    }],
//files
    attachments:[
        String
    ]

},
{
timestamps:true
}

);

export default model("Card",cardSchema);