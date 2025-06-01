import express from "express";
import { test, updateUser,deleteUser, getUsers, getUser, signOut, interest } from "../controller/user.controller.js";
import varifyToken from "../utils/varifyUser.js";
import {  getSavedPosts, savePost } from "../controller/savedPost.controller.js";
const router = express.Router();


router.get('/users', getUsers);     
router.get('/:userId' , getUser);
router.put('/update/:userId',varifyToken, updateUser);
router.delete('/delete/:userId',varifyToken, deleteUser);
router.post('/signout' , signOut);
router.post('/interests', varifyToken , interest)








export default router;