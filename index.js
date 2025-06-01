import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import savedRoutes from "./routes/savedPosts.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import followRoutes from "./routes/follow.routes.js";
import varifyToken from "./utils/varifyUser.js";
import User from "./models/user.model.js";
import axios from "axios";
import Post from "./models/post.model.js";
dotenv.config();
const server = express();

server.use(cors());
server.use(express.json()); //body parser
server.use(cookieParser()); //we can access cookie from the browser using this.
//mongodb connection
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO);
  console.log("database connected");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

server.use("/api/user", followRoutes);
server.use("/api/user", notificationRoutes);
server.use("/api/user", savedRoutes);
server.use("/api/user", userRoutes);
server.use("/api/auth", authRoutes);
server.use("/api/post", postRoutes);
server.use("/api/comment", commentRoutes);

server.get("/api/recommend", async (req, res) => {
  try {
    const userId = req.query.userId;
    const user = await User.findById(userId).select("interests");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);
    const interestsString = user.interests.join(", ");
    // Call Flask API for recommendations
    console.log(typeof interestsString);
    const response = await axios.post("http://127.0.0.1:5000/recommend", {
      interest: interestsString,
    });

    console.log(response.data);

    const recommendedArticles = response.data; // This is the array of recommended articles
    const recommendedTitles = recommendedArticles.map(
      (article) => article.title
    );

    // Fetch posts matching the recommended titles
    const posts = await Post.find({ title: { $in: recommendedTitles } });

    res.status(200).json(posts);
  } catch (error) {
    // console.error("Error fetching recommended articles:", error);
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

server.use((err, req, res, next) => {
  const statuscode = err.statuscode || 500;
  const message = err.message || "internal server error";
  res.status(statuscode).json({
    success: false,
    statuscode,
    message,
  });
});

server.listen(8080, () => {
  console.log("server started");
});
