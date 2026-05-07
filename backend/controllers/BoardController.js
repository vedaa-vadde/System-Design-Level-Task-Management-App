import BoardModel from "../models/boardModel.js";
import ListModel from "../models/ListModel.js";

//create board

export const createBoard =async (req,res)=>{
try{
    console.log("createBoard called");
    const {title}=req.body;
console.log("body received");
    if(!title){
        return res.status(400).json({message:"Boatrd title required"});
    }


    //create board

    const board=await BoardModel.create({
        title,
        owner:req.user.id,

        members:[req.user.id],
        isDefault: false,
    });
console.log("board created");
    //deafult lists

    const defaultLists=[{
        title:"Today",
        boardId:board._id,
        order:1,
    },
    {
        title:"This Weeek",
        boardId:board._id,
        order:2,
    },
    {
        title:"Later",
        boardId:board._id,
        order:3,
    },
];
  console.log(defaultLists);
//insert into database
await ListModel.insertMany(defaultLists);

//send response
res.status(201).json({message:"Board Created succesully",board});
}catch(err){


    console.log(err);
    res.status(500).json({message:err.message,})
}
};


//GET ALL boards

export const getBoards=async(req,res)=>{
    try{

        console.log(req.user);
      const boards=await BoardModel.find({
        members:req.user.id  //ppulate gets name and email of owner
      }) .populate("owner","name email").sort({ createdAt:-1});//descending order
console.log("before response");
      res.json(boards);
    }catch(err){
        res.status(500).json({message:err.message,});
    }
};



//get signle board

export const getSingleBoard=async(req,res)=>{
try{
    const {id}=req.params; //by link

    const board=await BoardModel.findById(id).populate("owner","name email").populate("members","name email");

    if(!board){
       return  res.status(404).json({message:"Board not dound"});
    }
   res.json(board);
}catch(err){
    res.status(500).json({message:err.message,});
}
};

//delete board

export const deleteBoard=async(req,res)=>{
    try{
          const {id}=req.params;

          const board=await BoardModel.findById(id);

          if(!board){
            return res.status(404).json({message:"Board not found"});
          }

          // only owner can delete
          if(board.owner.toString() !==req.user.id){
            return res.status(403).json({message:"Unauthorized"});
          }

          //delete board

          await BoardModel.findByIdAndDelete(id);

          await ListModel.deleteMany({boardId: id,});

          res.json({message:"Board deleted succesfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message})
    }
};