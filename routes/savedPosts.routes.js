import express from "express";
import varifyToken from "../utils/varifyUser.js";
import { getSavedPosts, savePost } from "../controller/savedPost.controller.js";

const router = express.Router();


router.post('/savedPost' , varifyToken , savePost);
router.get('/getSavedPosts'  ,varifyToken, getSavedPosts)

export default router;