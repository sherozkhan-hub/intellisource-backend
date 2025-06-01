
import savedPost from "../models/savedPost.model.js";

// Save a post
const savePost = async (req, res, next) => {
    try {
        const { postId } = req.body;
        const newSavedPost = new savedPost({ userId: req.user.id, postId });

        
        await newSavedPost.save();
        res.status(201).json(newSavedPost);
    } catch (error) {
        next(error);
    }
};

// Get saved posts for a user

const getSavedPosts = async (req, res, next) => {
    try {

        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        const query = {};

        if (req.query.userId) {
            query.userId = req.query.userId;
        }

        const newsavedPosts = await savedPost.find(query).populate("userId postId")
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit)

        const fullyPopulatedPosts = await savedPost.populate(newsavedPosts, {
            path: "postId.userId",
        });

        res.status(200).json(fullyPopulatedPosts);

      
    } catch (error) {
        next(error);
    }
};


export {savePost , getSavedPosts}