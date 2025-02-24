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
  getContractsForFinder,
  getNotifications,
  getUserById,
  getUserProfile,
  getUserXP,
  rewardPoint,
  searchPost,
  searchUser,
  unfollowUser,
  updateUserLevel,
  updateUserXP,
  updateXP,
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
router.post("/rewards/:userId", rewardPoint);
router.get("/contraction", fetchContract);
router.post("/contract", addContract);
router.put("/contracts/:id/status", acceptContract);
router.get("/get-xp/:userId", getUserXP);
router.get("/finder/:userId", getContractsForFinder);
router.put("/update-level", updateUserLevel);
router.put("/update-xp", updateXP);

export default router;
