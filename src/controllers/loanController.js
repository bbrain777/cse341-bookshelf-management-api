const { ObjectId } = require("mongodb");
const { getDB } = require("../db/connect");
const { getLoansCollection } = require("../models/loan");
const {
  validateLoan,
  validateLoanUpdate,
} = require("../validation/loanSchema");

// List all loans
async function listLoans(req, res, next) {
  try {
    const db = getDB();
    const loans = await getLoansCollection(db)
      .find({})
      .sort({ loanDate: -1 })
      .toArray();
    res.json({ data: loans });
  } catch (err) {
    next(err);
  }
}

// Create a new loan (issue book to member)
async function createLoan(req, res, next) {
  try {
    const { value, errors } = validateLoan(req.body);
    if (errors.length) {
      return res.status(400).json({ error: true, message: errors.join(", ") });
    }

    const db = getDB();
    const loan = {
      ...value,
      createdAt: new Date(),
    };

    const result = await getLoansCollection(db).insertOne(loan);
    res.status(201).json({ data: { _id: result.insertedId, ...loan } });
  } catch (err) {
    next(err);
  }
}

// Get loan by ID
async function getLoanById(req, res, next) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: true, message: "Invalid loan id" });
    }
    const db = getDB();
    const loan = await getLoansCollection(db).findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!loan) {
      return res.status(404).json({ error: true, message: "Loan not found" });
    }
    res.json({ data: loan });
  } catch (err) {
    next(err);
  }
}

// Update loan (return/renew)
async function updateLoan(req, res, next) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: true, message: "Invalid loan id" });
    }
    const { value, errors } = validateLoanUpdate(req.body);
    if (errors.length) {
      return res.status(400).json({ error: true, message: errors.join(", ") });
    }
    if (Object.keys(value).length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "No fields to update" });
    }

    const db = getDB();
    const result = await getLoansCollection(db).findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: value },
      { returnDocument: "after" },
    );

    if (!result.value) {
      return res.status(404).json({ error: true, message: "Loan not found" });
    }

    res.json({ data: result.value });
  } catch (err) {
    next(err);
  }
}

// Delete loan
async function deleteLoan(req, res, next) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: true, message: "Invalid loan id" });
    }
    const db = getDB();
    const result = await getLoansCollection(db).deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Loan not found or already deleted" });
    }
    res.status(200).json({ data: { deleted: true } });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listLoans,
  createLoan,
  getLoanById,
  updateLoan,
  deleteLoan,
};
