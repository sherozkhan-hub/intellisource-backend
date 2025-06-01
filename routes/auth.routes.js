import express from "express";
import { signup,signin, forgotPassword, resetPassword, google } from "../controller/auth.controller.js";


const router = express.Router();

router.post('/signup' , signup)
router.post('/signin' , signin)
router.post('/forgotPassword' , forgotPassword);
router.post('/resetPassword/:userId/:token' , resetPassword);

router.post('/google' , google)

export default router;