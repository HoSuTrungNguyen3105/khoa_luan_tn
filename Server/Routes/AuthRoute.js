import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  authUser,
  updateProfile,
  deleteAccount,
  forgetPassword,
  resetPassword,
  updateUserInfo,
  dataRoute,
  checkUserStatus,
  resetPasswordFromForget,
  verifyEmail,
  sendEmails,
  emailUser,
  badgeslist,
} from "../Controllers/AuthController.js";
import { protectRoute } from "../middleware/auth_middleware.js";
import authenticateToken from "../lib/auth.js";
import { checkAuth } from "../lib/checkAuth.js";
const router = express.Router();
router.get("/data/role", dataRoute);
router.post("/verify-email", verifyEmail);
router.get("/check-status", protectRoute, checkUserStatus);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgetPassword);
router.post("/reset-password-from-forget/:token", resetPasswordFromForget);
router.post("/send-email", sendEmails);
router.get("/badges", (req, res) => {
  res.json(badgeslist); // Trả về dữ liệu tỉnh thành
});
router.get("/get-emails", emailUser);
router.post("/reset-password/:token", resetPassword);
router.get("/get-user-info", authenticateToken, authUser);
router.put("/update-profile", protectRoute, updateProfile);
router.put("/update-profile-info", protectRoute, updateUserInfo);
router.get("/check", protectRoute, checkAuth);
router.delete("/delete", protectRoute, deleteAccount);

export default router;
