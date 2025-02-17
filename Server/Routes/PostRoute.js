import express from "express";
import {
  createPost,
  getPost,
  updatePost,
  deletePost,
  getPostbyid,
  getOldestPosts,
  getRecentlyPosts,
  getAllPosts,
  approvePosts,
  search,
  provinces,
  reportPost,
  delete1UserPost,
  getPostToProfile,
  getPostApprove,
  getPostbyidNoId,
} from "../Controllers/PostController.js";
import { protectRoute } from "../middleware/auth_middleware.js";
import { uploadMiddleware } from "../lib/multer.js";
import {
  addComment,
  deleteComment,
  getCommentsByPostId,
} from "../Controllers/CommentController.js";
import { getUserById } from "../Controllers/UserController.js";

const router = express.Router();

router.post("/posts", uploadMiddleware, createPost); // Để tạo bài viết
router.get("/posts/:id", getPost); // Để lấy một bài viết theo id
router.get("/posts/user/:id", getPostToProfile); // Để lấy một bài viết theo id
router.put("/update/:id", protectRoute, updatePost);
router.delete("/posts/:id", protectRoute, deletePost); // Để xóa bài viết
router.delete("/user/:id", protectRoute, delete1UserPost); // Để xóa bài viết
router.post("/comments", addComment);
router.get("/comments/:postId", getCommentsByPostId);
router.delete("/comments/:commentId", deleteComment);
router.get("/postsId/allItems", getAllPosts); // Để lấy tất cả bài viết
router.get("/provinces", (req, res) => {
  res.json(provinces); // Trả về dữ liệu tỉnh thành
});
router.get("/profile/:userId", getUserById);
router.post("/report/:postId", reportPost);
router.get("/search", search);
router.get("/posts/detail/:id", getPostbyid); // Để lấy bài viết theo id
router.get("/detail/:id", getPostbyidNoId); // Để lấy bài viết theo id

router.get("/postsId/getRecently", getRecentlyPosts); // Để lấy bài viết theo id
router.get("/postsId/getOldest", getOldestPosts); // Để lấy bài viết theo id
router.get("/getPostAp", getPostApprove); // Để lấy bài viết theo id
router.put("/approve/:id", approvePosts);

export default router;
