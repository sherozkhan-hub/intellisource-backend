import express from "express";
import varifyToken from "../utils/varifyUser.js";
import { deleteNotification, getNotifications } from "../controller/notification.controller.js";



const router = express.Router();


router.get('/getNotifications' , getNotifications)
router.delete('/deleteNotification/:notificationId' , deleteNotification)

export default router;