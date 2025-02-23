import Comment from "../Models/commentModel.js";
import { updateUserXP } from "./UserController.js";

export const getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId || postId.length !== 24) {
      return res.status(400).json({ message: "postId không hợp lệ" });
    }

    const comments = await Comment.find({ postId })
      .populate("userId", "username email profilePic")
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ status: "Success", comments });
  } catch (error) {
    console.error("Lỗi khi lấy bình luận:", error);
    res.status(500).json({ message: "Lỗi khi tải bình luận." });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId, userId, content } = req.body;

    const newComment = new Comment({ postId, userId, content });
    await newComment.save();

    // Populate userId để trả về đầy đủ thông tin người dùng
    const populatedComment = await newComment.populate("userId", "username");
    await updateUserXP(userId, 300); // Cộng 300 XP khi bình luận

    res.status(201).json({ status: "Success", comment: populatedComment });
  } catch (error) {
    console.error("Lỗi khi thêm bình luận:", error);
    res.status(500).json({ message: "Lỗi khi gửi bình luận." });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận." });
    }

    res.status(200).json({ message: "Bình luận đã bị xóa." });
  } catch (error) {
    console.error("Lỗi khi xóa bình luận:", error);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};
