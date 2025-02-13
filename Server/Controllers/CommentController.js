import PostModel from "../Models/postModel.js";
import Comment from "../Models/commentModel.js";
import UserModel from "../Models/userModel.js";
// export const getComment = async (req, res) => {
//   try {
//     const comments = await Comment.find({ postId: req.params.postId })
//       .populate("userId", "username") // Lấy thông tin người bình luận (username)
//       .populate("postId", "userId") // Lấy thông tin người đăng bài (userId của bài viết)
//       .exec();

//     // Lấy thông tin người đăng bài từ bài viết
//     const enhancedComments = await Promise.all(
//       comments.map(async (comment) => {
//         const postOwner = await User.findById(comment.postId.userId);
//         return {
//           ...comment._doc,
//           commentOwner: comment.userId.username, // Tên người bình luận
//           postOwner: postOwner ? postOwner.username : "N/A", // Tên người đăng bài
//         };
//       })
//     );

//     res.status(200).json(enhancedComments);
//   } catch (error) {
//     res.status(500).json({ message: "Đã xảy ra lỗi khi lấy bình luận", error });
//   }
// };
export const getCommentsByPostId = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate("userId", "username email") // Lấy thông tin người bình luận
      .sort({ createdAt: -1 }) // Sắp xếp mới nhất lên đầu
      .lean(); // Trả về Object thuần để tối ưu hiệu suất

    res.status(200).json({ status: "Success", comments });
  } catch (error) {
    console.error("Lỗi khi lấy bình luận:", error);
    res.status(500).json({ message: "Lỗi khi tải bình luận." });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId, userId, content } = req.body;

    if (!postId || !userId || !content) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc." });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài viết." });
    }

    const newComment = new Comment({
      postId,
      userId,
      content,
    });

    await newComment.save();

    res
      .status(201)
      .json({ message: "Bình luận đã được thêm.", comment: newComment });
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
