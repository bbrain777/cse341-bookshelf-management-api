const COLLECTION = "loans";

function getLoansCollection(db) {
  return db.collection(COLLECTION);
}

module.exports = { getLoansCollection, COLLECTION };