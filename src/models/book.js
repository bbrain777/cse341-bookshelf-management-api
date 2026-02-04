const COLLECTION = "books";

function getBooksCollection(db) {
  return db.collection(COLLECTION);
}

module.exports = { getBooksCollection, COLLECTION };
