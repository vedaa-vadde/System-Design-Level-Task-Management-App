import {Schema,model} from 'mongoose'

const ListSchema=new Schema({
    title:{
        type:String,
        required:[true,"title required"],
        trim:true,
    },

    //which boardthis lst belongs
    boardId:{
        type:Schema.Types.ObjectId,
        ref:"BoardModel",
        required:true,
    },
     //position of list
    order:{
        type:Number,
        default:0
    },

},
{timestamps:true}
);

export default model("ListModel",ListSchema);