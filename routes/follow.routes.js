
import express from 'express';
import { followUser, getFollowers, getFollowing, unfollowUser } from '../controller/follow.controller.js';
import varifyToken from '../utils/varifyUser.js';


const router = express.Router();


//follow API

router.get('/followers/:userId' , getFollowers);
router.get('/following/:userId' , getFollowing);
router.post('/follow/:followId',varifyToken, followUser);
router.put('/unfollow/:unfollowId',varifyToken, unfollowUser);

export default router;