const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/userModel");
const OAuthAccount = require("../models/oauthAccountModel");

if (!process.env.GOOGLE_CLIENT_ID) {
  console.error("Missing GOOGLE_CLIENT_ID in .env");
}
if (!process.env.GITHUB_CLIENT_ID) {
  console.error("Missing GITHUB_CLIENT_ID in .env");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Google Profile Received:", profile);
      try {
        let oauthAccount = await OAuthAccount.findOne({
          provider: "google",
          providerAccountId: profile.id,
        });
        let user;
        if (oauthAccount) {
          user = await User.findById(oauthAccount.userId);
        } else {
          user =
            (await User.findOne({ email: profile.emails[0].value })) ||
            (await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
            }));
          console.log("Created/Found User:", user);
          oauthAccount = await OAuthAccount.create({
            userId: user._id,
            provider: "google",
            providerAccountId: profile.id,
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("GitHub Profile Received:", profile);
      try {
        let oauthAccount = await OAuthAccount.findOne({
          provider: "github",
          providerAccountId: profile.id,
        });
        let user;
        if (oauthAccount) {
          user = await User.findById(oauthAccount.userId);
        } else {
          user =
            (await User.findOne({ email: profile.emails[0].value })) ||
            (await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
            }));
          console.log("Created/Found User:", user);
          oauthAccount = await OAuthAccount.create({
            userId: user._id,
            provider: "github",
            providerAccountId: profile.id,
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;
