const { ObjectId } = require("mongodb");
const { getDB } = require("../db/connect");
const { getAuthorsCollection } = require("../models/author");
const { validateAuthor, validateAuthorUpdate } = require("../validation/authorSchema");

async function listAuthors(req, res, next) {
  try {
    const db = getDB();
    const authors = await getAuthorsCollection(db)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json({ data: authors });
  } catch (err) {
    next(err);
  }
}

async function createAuthor(req, res, next) {
  try {
    const { value, errors } = validateAuthor(req.body);
    if (errors.length) {
      return res.status(400).json({ error: true, message: errors.join(", ") });
    }

    const db = getDB();
    const author = {
      ...value,
      createdAt: new Date()
    };

    const result = await getAuthorsCollection(db).insertOne(author);
    res.status(201).json({ data: { _id: result.insertedId, ...author } });
  } catch (err) {
    next(err);
  }
}

async function getAuthorById(req, res, next) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: true, message: "Invalid author id" });
    }
    const db = getDB();
    const author = await getAuthorsCollection(db).findOne({
      _id: new ObjectId(req.params.id)
    });
    if (!author) {
      return res.status(404).json({ error: true, message: "Author not found" });
    }
    res.json({ data: author });
  } catch (err) {
    next(err);
  }
}

async function updateAuthor(req, res, next) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: true, message: "Invalid author id" });
    }
    const { value, errors } = validateAuthorUpdate(req.body);
    if (errors.length) {
      return res.status(400).json({ error: true, message: errors.join(", ") });
    }
    if (Object.keys(value).length === 0) {
      return res.status(400).json({ error: true, message: "No fields to update" });
    }

    const db = getDB();
    const result = await getAuthorsCollection(db).findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: value },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ error: true, message: "Author not found" });
    }

    res.json({ data: result.value });
  } catch (err) {
    next(err);
  }
}

async function deleteAuthor(req, res, next) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: true, message: "Invalid author id" });
    }
    const db = getDB();
    const result = await getAuthorsCollection(db).findOneAndDelete({
      _id: new ObjectId(req.params.id)
    });
    if (!result.value) {
      return res.status(404).json({ error: true, message: "Author not found" });
    }
    res.json({ data: result.value });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listAuthors,
  createAuthor,
  getAuthorById,
  updateAuthor,
  deleteAuthor
};
