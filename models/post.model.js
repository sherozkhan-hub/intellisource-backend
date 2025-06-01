import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

    userId :{
        type:String,
        ref:"User",
        required:true
    },
    content:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        default:"c:\Users\PMLS\AppData\Local\Temp\Untitled.jpeg"
    },
    category:{
        type:String,
        default:"uncategorized"
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    tags: {
        type: [String],
        default:[]
    },
    likes:{
        type:Array,
        default:[]
    },
    numberOfLikes:{
        type:Number,
        default:0
    },
    views:[{
          type: mongoose.Schema.Types.ObjectId,
          ref:"Views"
    }],
    noOfViews:{
        type:Number,
        default:0
    },
},{timestamps:true});
const Post = mongoose.model('Post' , postSchema);

export default Post;