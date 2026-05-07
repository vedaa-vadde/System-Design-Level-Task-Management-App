import {Schema,model}from "mongoose";

const BoardSchema=new Schema({
    title:{
        type:String,
        required:true
    },
   //creator of board
    owner:{
        type:Schema.Types.ObjectId,
        ref:"UserModel",
        required:true,
    },
//team members
    members: [{
        type:Schema.Types.ObjectId,
        ref:"UserModel",
    }],

    isDefault:{
        type:Boolean,
        default:false,
    },
},
{ timestamps: true}

);

export default model("BoardModel",BoardSchema);