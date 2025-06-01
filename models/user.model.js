import mongoose from 'mongoose';
import Notification from './notification.model.js';
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role:{
      type:String,
      default:"guest"
    },
    profilePicture:{
      type:String,
      default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fprofile-avatar&psig=AOvVaw0AGPJnCoWm0A1Qo3ai7A6Y&ust=1717136770792000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCMC8x43ftIYDFQAAAAAdAAAAABAE"
    },
    following:{
        type:Array,
        default:[]
    },
    numberOfFollowing:{
        type:Number,
        default:0
    },
    follower:{
        type:Array,
        default:[]
    },
    numberOfFollowers:{
        type:Number,
        default:0
    },
    notification:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Notification'
      }
    ],
    savedBlogs:{
      type:Array,
      default:[]
    },
    interests:{
      type: [String],
      default:[]
    }
    //,
    // profilePicture: {
    //   type: String,
    //   default:
    //     'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    // },
    // isAdmin: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;