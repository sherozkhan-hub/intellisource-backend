
import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
    following:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    follower:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
},{timestamps:true})


const Follow = mongoose.model("Follow" , followSchema);

export default Follow;