const { ObjectId } = require("mongodb");
const { getDB } = require("../db/connect");
const { getBooksCollection } = require("../models/book");
const { validateBook, validateBookUpdate } = require("../validation/bookSchema");

async function listBooks(req, res, next) {
  try {
    const db = getDB();
    const query = {};
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);

    if (req.query.q) {
      query.title = { $regex: req.query.q, $options: "i" };
    }
    if (req.query.genre) {
      query.genre = req.query.genre;
    }
    if (req.query.authorId) {
      query.authorId = req.query.authorId;
    }

    const cursor = getBooksCollection(db)
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const [books, total] = await Promise.all([
      cursor.toArray(),
      getBooksCollection(db).countDocuments(query),
    ]);

    res.json({
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

async function createBook(req, res, next) {
  try {
    const { value, errors } = validateBook(req.body);
    if (errors.length) {
      return res.status(400).json({ error: true, message: errors.join(", ") });
    }

    const db = getDB();
    const book = {
      ...value,
      status: value.status || "planned",
      createdAt: new Date()
    };

    const result = await getBooksCollection(db).insertOne(book);
    res.status(201).json({ data: { _id: result.insertedId, ...book } });
  } catch (err) {
    next(err);
  }
}

async function getBookById(req, res, next) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: true, message: "Invalid book id" });
    }
    const db = getDB();
    const book = await getBooksCollection(db).findOne({
      _id: new ObjectId(req.params.id)
    });
    if (!book) {
      return res.status(404).json({ error: true, message: "Book not found" });
    }
    res.json({ data: book });
  } catch (err) {
    next(err);
  }
}

async function updateBook(req, res, next) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: true, message: "Invalid book id" });
    }
    const { value, errors } = validateBookUpdate(req.body);
    if (errors.length) {
      return res.status(400).json({ error: true, message: errors.join(", ") });
    }
    if (Object.keys(value).length === 0) {
      return res.status(400).json({ error: true, message: "No fields to update" });
    }

    const db = getDB();
    const updatedBook = await getBooksCollection(db).findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: value },
      { returnDocument: "after" }
    );

    if (!updatedBook) {
      return res.status(404).json({ error: true, message: "Book not found" });
    }

    res.json({ data: updatedBook });
  } catch (err) {
    next(err);
  }
}

async function deleteBook(req, res, next) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: true, message: "Invalid book id" });
    }
    const db = getDB();
    const result = await getBooksCollection(db).deleteOne({
      _id: new ObjectId(req.params.id)
    });
    if (result.deletedCount === 0) {
      return res.status(200).json({
        data: { deleted: false },
        message: "Book not found or already deleted"
      });
    }
    res.status(200).json({ data: { deleted: true } });
  } catch (err) {
    next(err);
  }
}

module.exports = { listBooks, createBook, getBookById, updateBook, deleteBook };
