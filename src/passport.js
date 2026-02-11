const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const { ObjectId } = require("mongodb");
const { getDB } = require("./db/connect");

const oauthConfigured =
  !!process.env.GITHUB_CLIENT_ID &&
  !!process.env.GITHUB_CLIENT_SECRET &&
  !!process.env.GITHUB_CALLBACK_URL;

if (oauthConfigured) {
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
            const newUser = {
              oauthProvider: "github",
              providerId: profile.id,
              name: profile.displayName || profile.username,
              email: profile.emails?.[0]?.value || null,
              role: "member",
              createdAt: new Date(),
              lastLoginAt: new Date(),
            };
            const insertResult = await users.insertOne(newUser);
            user = { _id: insertResult.insertedId, ...newUser };
          } else {
            await users.updateOne(
              { _id: user._id },
              { $set: { lastLoginAt: new Date() } },
            );
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      },
    ),
  );
} else {
  console.warn("GitHub OAuth is not configured. Auth login routes will be unavailable.");
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = getDB();
    const objectId = typeof id === "string" ? new ObjectId(id) : id;
    const user = await db.collection("users").findOne({ _id: objectId });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
