import express from "express";
import {
  callbackFB,
  errorFB,
  loginFB,
  signOutFB,
  successFB,
} from "../middleware/facebook_auth.js";
import passport from "passport";

const router = express.Router();

router.get("/", loginFB);

router.get(
  "/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/auth/facebook/error",
  }),
  callbackFB
);

router.get("/success", successFB);

router.get("/error", errorFB);

router.get("/signout", signOutFB);
export default router;
