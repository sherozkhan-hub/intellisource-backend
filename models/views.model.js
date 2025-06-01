
import mongoose from "mongoose";

const viewsSchema = mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        postId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Post"
        },
        timeSpent: {
          type: Number, // Time spent in seconds
          default: 0
        }
    },{timestamps:true}
)

const Views =mongoose.model("Views", viewsSchema);

export default Views;