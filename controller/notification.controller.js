import Notification from "../models/notification.model.js"
import { errorHandler } from "../utils/error.js";


const getNotifications = async (req,res,next)=>{
    try{
         
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        const query = {};

        if (req.query.recieverId) {
            query.receiver = req.query.recieverId;
        }


        const notifications = await Notification.find(query).populate("sender receiver")
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);

        res.status(200).json(notifications);

    }catch(error){
        next(error)
    }
}
const deleteNotification = async (req,res,next)=>{
   
    try{
        await Notification.findByIdAndDelete(req.params.notificationId);
        res.status(200).json("post has been deleted successfully");
    }
    catch(error)
    {
         next(error)
    }
}
export {getNotifications,deleteNotification}