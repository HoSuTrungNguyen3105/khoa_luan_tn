import PostModel from "../Models/postModel.js";
import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";
import jwt from 'jsonwebtoken';

export const createPost = async (req, res) => {
    try {
        const newPost = new PostModel({
            userId: req.body.userId,  // Lấy userId từ body thay vì req.user.id
            desc: req.body.desc,
            image: req.body.image,
        });

        await newPost.save();
        res.status(200).json({ message: "Post created successfully" });
    } catch (error) {
        console.error("Error saving post:", error);
        res.status(500).json({ message: "Error saving post" });
    }
};


export const getPost = async(req, res) => {
    const postId = req.params.id
    try {
        const post = await PostModel.findById(postId);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error)
    }
}

export const updatePost = async(req, res) => {
    const postId = req.params.id
    const { userId } = req.body
    try {
        const post = await PostModel.findById(postId)
        if (post.userId === userId) 
        {
            await post.updateOne({ $set : req.body})
            res.status(200).json("Post update");
        }
        else {
            res.status(403).json("Unauthorized to update this post");
        }
    } catch (error) {
        res.status(500).json(error)
    }
}
export const deletePost = async(req, res) => {
    const postId = req.params.id;
    const { userId } = req.body
    try {
        const post = await PostModel.findById(postId)
        if (post.userId === userId)
        {
            await post.deleteOne();
            res.status(200).json("Post deleted");
        }
        else {
            res.status(403).json("Unauthorized to delete this post");
        }
    } catch (error) {
        res.status(500).json(error)
    }
}
export const getTimelinepost = async(req, res) => {
    const userId = req.params.id
    try {
        const currentUserPosts = await PostModel.find({ userId : userId})
        const followingPosts = await UserModel.aggregate([
            {
                $match : { 
                    _id : new mongoose.Types.ObjectId(userId)
                } 
            },
            {
                $lookup : {
                    from : "posts",
                    localField : "following",
                    foreignField : "userId",
                    as : "followingPosts"
                }
            },
            {
                $project : {
                    followingPosts : 1,
                    _id : 0
                }
            }
        ])
        res.status(200).json(currentUserPosts.concat(...followingPosts))
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getallPost = async (req, res) => {
    try {
        const posts = await PostModel.find().sort({ createdAt: -1 });

        console.log("Posts found:", posts); // Log để kiểm tra dữ liệu

        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }

        return res.json({
            status: "Success",
            data: posts,
        });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: "Error retrieving posts" });
    }
};



export const getPostbyid = async (req, res) => {
    try {
        const { postId } = req.params;
        console.log("Post ID:", postId); // Log postId để kiểm tra

        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.json({
            status: "Success",
            data: post,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error" });
    }
};

export const getRecentPost = async (req, res) => {
    try {
        const posts = await PostModel.find().sort({ createdAt: -1 }).limit(4);
       
        return res.json({
            status: "Success",
            data: posts,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error" });
    }
};



