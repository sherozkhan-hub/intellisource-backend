import Follow from "../models/follow.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

const followUser = async(req,res,next)=>{
    try{
          const currentUser = await User.findById(req.user.id);   // someone who is following others
          const followedUser = await User.findById(req.params.followId);  //someone who is followed by others
    
        if(!currentUser || !followedUser){
            return next(errorHandler(400,"user does not exist"));
        }

        const checkFollowing = currentUser.following.indexOf(req.params.followId)

        if(checkFollowing === -1){
            
             currentUser.numberOfFollowing +=1;
             currentUser.following.push(req.params.followId);
             followedUser.follower.push(req.user.id);

             const notification = new Notification({
                type: "follow",
                sender: req.user.id,
                receiver: followedUser._id,
                message: `${currentUser.username} started following you.`,
                read: false
            });

            followedUser.notification.push(notification._id);
            await notification.save();

        }
        else{
            return next(errorHandler(400 , "user already following"))
        }
        // else{

        //     currentUser.numberOfFollowing -=1;
        //     currentUser.following.splice(req.params.id, 1);
        //     followedUser.follower.splice(req.user.id,1);
        // }

        await currentUser.save();
        await followedUser.save();

        res.status(200).json({currentUser,followedUser});


    }
    catch(error){
        next(error)
    }
}
const unfollowUser = async (req,res,next)=>{
    try{

        const currentUser = await User.findById(req.user.id);   // someone who is following others
        const followedUser = await User.findById(req.params.unfollowId);  //someone who is followed by others
  

      if(!currentUser || !followedUser){
          return next(errorHandler(400,"user does not exist"));
      }

      const checkFollowing = currentUser.following.indexOf(req.params.unfollowId)

      if(checkFollowing !== -1){

            currentUser.numberOfFollowing -=1;
            currentUser.following.splice(req.params.id, 1);
            followedUser.follower.splice(req.user.id,1);

          // Find and remove the notification
          const notification = await Notification.findOneAndDelete({
            type: "follow",
            sender: req.user.id,
            receiver: followedUser._id
        });

        if (notification) {
            const notificationIndex = followedUser.notification.indexOf(notification._id);
            if (notificationIndex !== -1) {
                followedUser.notification.splice(notificationIndex, 1);
            }
        }
       

      }
      else{
        return next(errorHandler(400 , "cannot unfollow twice"))
      }

      
     
      await currentUser.save();
      await followedUser.save();

      res.status(200).json({currentUser,followedUser});
    }
    catch(error){
        next(error)
    }
}

const getFollowers = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        const followers = await User.find({ _id: { $in: user.follower } });

        const notifications = await User.findById(userId).populate('notification');

    res.status(200).json(followers);
    } catch (error) {
        next(error);
    }
}
const getFollowing = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        const following = await User.find({ _id: { $in: user.following } });

    res.status(200).json(following);
    } catch (error) {
        next(error);
    }
}

export {followUser,unfollowUser,getFollowers,getFollowing}



