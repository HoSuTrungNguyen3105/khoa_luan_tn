import express from "express";
import {
  acceptContract,
  addContract,
  changePassword,
  contract,
  deleteUser,
  fetchContract,
  fetchFollowingStatus,
  followUser,
  getNotifications,
  getUserById,
  getUserProfile,
  rewardPoint,
  searchPost,
  searchUser,
  unfollowUser,
} from "../Controllers/UserController.js";
import { protectRoute } from "../middleware/auth_middleware.js";
const router = express.Router();

router.get("/profile/:id", getUserProfile);
router.get("/profile/user/:userId", getUserById);
router.get("/search/users", searchUser);
router.get("/search/posts", searchPost);
router.get("/notifications/:userId", getNotifications);
router.delete("/:id", deleteUser);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);
router.get("/:targetUserId/is-following", fetchFollowingStatus);
router.post("/change-password", protectRoute, changePassword);
router.post("/reward-points", rewardPoint);
router.get("/contraction", fetchContract);
router.post("/contraction", addContract);
router.put("/contraction/:id/status", acceptContract);
router.get("/:id/update-level");
export default router;
