import express from 'express';
import  { createComment,deleteComment,editComment,getComments,getPostComments, likeComment } from '../controller/comment.controller.js';
import varifyToken from '../utils/varifyUser.js';

const router = express.Router();


router.post('/create' ,varifyToken, createComment);
router.get('/getComments' ,varifyToken, getComments);

router.get('/getPostComments/:postId' , getPostComments);
router.put('/likeComment/:commentId' ,varifyToken, likeComment);
router.put('/editComment/:commentId' ,varifyToken, editComment);
router.delete('/deleteComment/:commentId' ,varifyToken, deleteComment);


export default router;