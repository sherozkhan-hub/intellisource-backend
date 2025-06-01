import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'

const test = (req,res)=>{
    res.json("api is working");
}
const getUsers = async (req,res,next)=>{

    // res.json("all users");
    try{
        // const users = await User.find();
        // res.status(200).json(users);

         const startIndex = parseInt(req.query.startIndex) || 0;
         const limit = parseInt(req.query.limit) || 9;
         const sortDirection = req.query.order === 'asc' ? 1 : -1;

         const users = await User.find()
         .sort({createdAt : sortDirection})
         .skip(startIndex)
         .limit(limit)
        
         const totalUsers = await User.countDocuments();

         const usersWithoutPasswords = users.map((user)=>{
            const {password , ...rest} = user._doc;
            return rest;
         })

          const now = new Date();

         const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            users:usersWithoutPasswords,
            totalUsers,
            lastMonthUsers
        });
         

     }
    catch(error){
        next(error)
    }



}
const getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const {password ,...rest} = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}

// const updateUser = async(req,res,next)=>{
//        console.log(req.user);
//        if(req.user.id !== req.params.userId)
//         {
//             return next(errorHandler(403 , "you are not allowed to update this user."));
//         }
//        if(req.body.password)
//         {
//             if(req.body.password.length < 6)
//                 {
//                     return next(errorHandler(403 , "password must be atleast 6 chaacters"));
//                 }
    
//              req.body.password = bcryptjs.hashSync(req.body.password, 10);
//         }
       

//         if(req.body.username.length < 7 || req.body.username.length > 20 )
//             {
//                 return next(errorHandler(400 , "username must be in between 7 and 20"));
//             }

//         try{
            
//             const updateuser = await User.findByIdAndUpdate(req.params.userId,{
//                 $set:{
//                     username: req.body.username,
//                     email:req.body.email,
//                     password:req.body.password,
//                     profilePicture:req.body.profilePicture
//                 }
//             },{new:true}
//             )
//             const {password:pass , ...rest} =updateuser._doc;
//             res.status(200).json(rest);
//         }    
//         catch(error){
//             next(error)
//         }
// }
const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You are not allowed to update this user."));
    }
    
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(403, "Password must be at least 6 characters"));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.body.username && (req.body.username.length < 7 || req.body.username.length > 20)) {
        return next(errorHandler(400, "Username must be between 7 and 20 characters"));
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture,
            }
        }, { new: true });

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

// const deleteUser = async(req,res,next)=>{

//     if(req.user.id !== req.params.userId){
//         return next(errorHandler(400, "user does not exist"))
//     }

//     try{
//         await User.findByIdAndDelete(req.params.userId);
//         res.status(200).json("user has been deleted successfully");
//     }
//     catch(error)
//     {
//         next(error)
//     }
// }

const deleteUser = async (req, res, next) => {
    // if (req.user.id !== req.params.userId) {
    //     return next(errorHandler(400, "User does not exist"));
    // }

    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("User has been deleted successfully");
    } catch (error) {
        next(error);
    }
};

const signOut = async (req,res,next)=>{

    try{
       res.clearCookie('access_token').status(200).json("user has been signed out")
    }
    catch(error)
    {
        next(error)
    }
}
const interest = async (req, res) => {
    const { interests } = req.body;
    const userId = req.user.id; // Assuming you have user authentication middleware
    
    try {
      // Get the user's current interests
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // If user already has interests, update them; otherwise, add them for the first time
      if (user.interests.length > 0) {
        user.interests = interests;
      } else {
        user.interests = user.interests.concat(interests);
      }

      // Save the updated user document
      user = await user.save();

      res.json(user);
    } catch (error) {
      console.error('Error updating user interests:', error);
      res.status(500).json({ error: 'Failed to update user interests' });
    }
}


export {test,updateUser,deleteUser,getUsers,getUser,signOut,interest}