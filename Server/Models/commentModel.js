// models/comment.js
import mongoose from "mongoose";
// Định nghĩa schema cho bình luận
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Liên kết với model User (người dùng bình luận)
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts", // Liên kết với model Post (bài đăng)
      required: true,
    },
    content: {
      type: String,
      required: true, // Nội dung bình luận (bắt buộc)
      trim: true, // Loại bỏ khoảng trắng thừa
    },
  },
  { timestamps: true } // Tự động tạo trường createdAt và updatedAt
);

// Tạo model Comment từ schema
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
