const express = require("express");
const {
  RegisterUser,
  LoginUser,
  getuserProfile,
  updateuserProfile,
  oauthCallback,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const passport = require("passport");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/register", RegisterUser);

router.post("/login", LoginUser);

router.get("/profile", protect, getuserProfile);

router.put("/profile", protect, upload, updateuserProfile);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  oauthCallback
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  oauthCallback
);

module.exports = router;
