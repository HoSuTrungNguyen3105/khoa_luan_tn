import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import UserModel from "../Models/userModel.js";
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET_KEY,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "email", "username"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      const user = await UserModel.findOne({
        accountId: profile.id,
        provider: "facebook",
      });
      if (!user) {
        console.log("Adding new facebook user to DB..");
        const user = new UserModel({
          accountId: profile.id,
          username: profile.displayName,
          provider: profile.provider,
        });
        await user.save();
        // console.log(user);
        return cb(null, profile);
      } else {
        console.log("Facebook User already exist in DB..");
        // console.log(profile);
        return cb(null, profile);
      }
    }
  )
);
export const loginFB = passport.authenticate("facebook", { scope: "email" });

export const callbackFB = function (req, res) {
  // Successful authentication, redirect to success screen.
  res.redirect("/auth/facebook/success");
};

export const successFB = async (req, res) => {
  const userInfo = {
    id: req.session.passport.user.id,
    displayName: req.session.passport.user.displayName,
    provider: req.session.passport.user.provider,
  };
  res.render("fb-github-success", { user: userInfo });
};

export const errorFB = (req, res) =>
  res.send("Error logging in via Facebook..");

export const signOutFB = (req, res) => {
  try {
    req.session.destroy(function (err) {
      console.log("session destroyed.");
    });
    res.render("auth");
  } catch (err) {
    res.status(400).send({ message: "Failed to sign out fb user" });
  }
};
