import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Views from "../models/views.model.js";
import { errorHandler } from "../utils/error.js"

const create = async (req,res,next)=>{
   

     if(!req.body.title || !req.body.content)
          {
               return next(errorHandler(401 , "please provide all required fields"));
          }
     const slug  =req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g, '');    
     
     const newpost = new Post({
          ...req.body , slug , userId:req.user.id,
         
     });

     try{
           const savedPost  = await newpost.save();
           res.status(201).json(savedPost);
     }
     catch(error){
          next(error)
     }

}


const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 12;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        const query = {};

        if (req.query.userId) {
            query.userId = req.query.userId;
        }

        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.slug) {
            query.slug = req.query.slug;
        }

        if (req.query.postId) {
            query._id = req.query.postId;
        }

        if (req.query.searchTerm) {
            query.$or = [
                { title: { $regex: req.query.searchTerm, $options: 'i' } },
                { content: { $regex: req.query.searchTerm, $options: 'i' } },
            ];
        }

        const posts = await Post.find(query).populate("comments userId")
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalPosts = await Post.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });
    } catch (error) {
        next(error);
    }
};


// const getPosts = async (req, res, next) => {
//      try {
//          const startIndex = parseInt(req.query.startIndex) || 0;
//          const limit = parseInt(req.query.limit) || 9;
//          const sortDirection = req.query.order === 'asc' ? 1 : -1;
 
//          const query = {};
 
//          if (req.query.userId) {
//              query.userId = req.query.userId;
//          }
 
//          if (req.query.category) {
//              query.category = req.query.category;
//          }
 
//          if (req.query.slug) {
//              query.slug = req.query.slug;
//          }
 
//          if (req.query.postId) {
//              query._id = req.query.postId;
//          }
 
//          if (req.query.searchTerm) {
//              query.$or = [
//                  { title: { $regex: req.query.searchTerm, $options: 'i' } },
//                  { content: { $regex: req.query.searchTerm, $options: 'i' } },
//              ];
//          }
 
//          const posts = await Post.find(query).populate("comments")
//              .sort({ updatedAt: sortDirection })
//              .skip(startIndex)
//              .limit(limit);
 
//          const totalPosts = await Post.countDocuments();
//          const now = new Date();
//          const oneMonthAgo = new Date(
//              now.getFullYear(),
//              now.getMonth() - 1,
//              now.getDate()
//          );
 
//          const lastMonthPosts = await Post.countDocuments({
//              createdAt: { $gte: oneMonthAgo },
//          });
 
//          res.status(200).json({
//              posts,
//              totalPosts,
//              lastMonthPosts,
//          });
//      } catch (error) {
//          next(error);
//      }
//  };

//  const getPost = async (req,res,next)=>{
//     try{
//           const singlePost = await Post.findOne({_id : req.params.postId});

//           if(!singlePost){
//             return next(errorHandler(400 , "post is not available"))
//           }
//           await singlePost.save();
//           res.status(200).json(singlePost);

//     }catch(error){
//         next(error)
//     }
//  }

const getPost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const userId = req.user.id;
      const { timeSpent } = req.body;
  
      // Check if the view already exists
      let existingView = await Views.findOne({ userId, postId });
  
      // Fetch the post
      const post = await Post.findById(postId).populate('userId');
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // If the view doesn't exist, create a new view and increment the view count
      if (!existingView) {
        const newView = new Views({ userId, postId, timeSpent: timeSpent || 0 });
        await newView.save();
  
        post.noOfViews += 1;
        post.views.push(newView._id);
        await post.save();
      } else {
        // Update existing view with time spent
        if (timeSpent) {
          existingView.timeSpent += timeSpent;
          await existingView.save();
        }
      }
  
      res.status(200).json({ message: 'Post fetched successfully', post });
    } catch (error) {
      next(error);
    }
  };
  

 
const deletePost = async(req,res,next)=>{

     
     if(req.user.id !== req.params.userId){
         return next(errorHandler(400,"you are not allowed to delete this post."))
     }
     try{
         await Post.findByIdAndDelete(req.params.postId);
         res.status(200).json("post has been deleted successfully");
     }
     catch(error)
     {
          next(error)
     }
}

const updatePost = async (req,res,next)=>{

     if( req.user.id !== req.params.userId){
          return next(errorHandler(400 , "you are not allowed to update this post"))
     }
     // console.log(req.user.id)
     // console.log(req.params.userId)

     try{
         const updatedPost = await Post.findByIdAndUpdate(
          req.params.postId,
          {
               $set:{
                    title: req.body.title,
                    content:req.body.content,
                    category:req.body.category,
                    image:req.body.image
               }
          },{new :true}
         
         )
         res.status(200).json(updatedPost);
     }
     catch(error){
          next(error)
     }
}

const likePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);
        const sender = await User.findById(req.user.id);
        const likedPostUser = await User.findById(post.userId);

        if (!post) {
            return next(errorHandler(400, "post not found"));
        }

        const userIndex = post.likes.indexOf(req.user.id);

        if (userIndex === -1) {
            // User is liking the post
            post.numberOfLikes += 1;
            post.likes.push(req.user.id);

            const notification = new Notification({
                type: "like",
                sender: req.user.id,
                receiver: post.userId,
                message: `${sender.username} has liked your post.`,
                read: false
            });

            likedPostUser.notification.push(notification._id);
            await notification.save();
        } else {
            return next(errorHandler(400, "you have already liked the post"));
        }

        await post.save();
        await likedPostUser.save();
        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
}

const unlikePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return next(errorHandler(400, "post not found"));
        }

        const userIndex = post.likes.indexOf(req.user.id);

        if (userIndex !== -1) {
            post.numberOfLikes -= 1;
            post.likes.splice(userIndex, 1);

            // Find the user who created the post
            const likedPostUser = await User.findById(post.userId);

            // Find and remove the notification
            const notification = await Notification.findOneAndDelete({
                type: "like",
                sender: req.user.id,
                receiver: post.userId
            });

            if (notification) {
                const notificationIndex = likedPostUser.notification.indexOf(notification._id);
                if (notificationIndex !== -1) {
                    likedPostUser.notification.splice(notificationIndex, 1);
                }
            }

            await likedPostUser.save();
        } else {
            return next(errorHandler(400, "you have not liked this post"));
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
}




const getViews = async(req,res,next)=>{
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    try{
       const  query ={};
        if(req.query.userId){
            query.userId = req.query.userId
        }
        if(req.query.postId){
            query.postId = req.query.postId;
        }

        const allViews = await Views.find(query).populate("postId userId")
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);

        const totalviews = await Views.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthViews = await Views.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            allViews,
            totalviews,
            lastMonthViews,
        });

        res.status(200).json(allViews);

    }catch(error){
        next(error)
    }
}


export {create,getPosts,deletePost,updatePost,likePost,unlikePost,getPost,getViews}