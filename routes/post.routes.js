import express from 'express';
import varifyToken from '../utils/varifyUser.js';
import {  create, deletePost, getPost, getPosts, getViews, likePost, unlikePost, updatePost } from '../controller/post.controller.js';

const router =express.Router();

router.post('/create' , varifyToken , create);
router.get('/getposts' , getPosts);
router.get('/getpost/:postId', varifyToken , getPost);
router.delete('/deletepost/:postId/:userId' ,varifyToken, deletePost);
router.put('/updatepost/:postId/:userId' , varifyToken ,updatePost );
router.put('/likePost/:postId' ,varifyToken, likePost);
router.put('/unlikePost/:postId' ,varifyToken, unlikePost);

//router.put('/viewPost/:postId' , varifyToken , addView);
router.get('/getViews' , getViews)




export default router;