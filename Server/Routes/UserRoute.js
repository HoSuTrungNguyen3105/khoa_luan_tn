import express from "express";
import {
  changePassword,
  contract,
  deleteUser,
  fetchFollowingStatus,
  followUser,
  getNotifications,
  getUserProfile,
  rewardPoint,
  searchPost,
  searchUser,
  unfollowUser,
} from "../Controllers/UserController.js";
import { protectRoute } from "../middleware/auth_middleware.js";
const router = express.Router();

router.get("/profile/:id", getUserProfile);
router.get("/search/users", searchUser);
router.get("/search/posts", searchPost);
router.get("/notifications/:userId", getNotifications);
router.delete("/:id", deleteUser);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);
router.get("/:targetUserId/is-following", fetchFollowingStatus);
router.post("/change-password", protectRoute, changePassword);
router.post("/reward-points", rewardPoint);
router.post("/contraction", contract);
export default router;
