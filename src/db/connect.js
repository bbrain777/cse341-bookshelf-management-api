const { MongoClient } = require("mongodb");

let db;

async function connectDB(uri) {
  if (db) return db;

  const client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  console.log("✅ MongoDB connected");
  return db;
}

function getDB() {
  if (!db) throw new Error("DB not initialized. Call connectDB first.");
  return db;
}

module.exports = { connectDB, getDB };
