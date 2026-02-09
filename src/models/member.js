const COLLECTION = "members";

function getMembersCollection(db) {
  return db.collection(COLLECTION);
}

module.exports = { getMembersCollection, COLLECTION };
