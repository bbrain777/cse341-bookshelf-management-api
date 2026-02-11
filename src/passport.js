const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const { getDB } = require("./db/connect");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = getDB();
        const users = db.collection("users");

        // Find or create user
        let user = await users.findOne({ providerId: profile.id });
        if (!user) {
          user = {
            oauthProvider: "github",
            providerId: profile.id,
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value || null,
            role: "member", // default role
            createdAt: new Date(),
          };
          await users.insertOne(user);
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = getDB();
    const user = await db.collection("users").findOne({ _id: id });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
