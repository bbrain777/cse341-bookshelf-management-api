const COLLECTION = "authors";

function getAuthorsCollection(db) {
  return db.collection(COLLECTION);
}

module.exports = { getAuthorsCollection, COLLECTION };
