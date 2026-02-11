require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./db/connect");

const PORT = process.env.PORT || 8080;

async function start() {
  try {
    // await connectDB(process.env.MONGODB_URI);
    await connectDB(process.env.MONGODB_URI); // ✅ this line triggers connection
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();
