const COLLECTION = "shelves";

function getShelvesCollection(db) {
  return db.collection(COLLECTION);
}

module.exports = { getShelvesCollection, COLLECTION };
