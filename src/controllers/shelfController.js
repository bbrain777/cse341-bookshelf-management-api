const { ObjectId } = require("mongodb");
const { getDB } = require("../db/connect");
const { getShelvesCollection } = require("../models/shelf");
const { validateShelf, validateShelfUpdate } = require("../validation/shelfSchema");

async function listShelves(req, res, next) {
  try {
    const db = getDB();
    const query = {};

    if (req.query.ownerUserId) {
      query.ownerUserId = req.query.ownerUserId;
    }

    if (req.query.visibility) {
      query.visibility = req.query.visibility;
    }

    const shelves = await getShelvesCollection(db)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ data: shelves });
  } catch (err) {
    next(err);
  }
}

async function getShelfById(req, res, next) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: true, message: "Invalid shelf id" });
    }

    const db = getDB();
    const shelf = await getShelvesCollection(db).findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!shelf) {
      return res.status(404).json({ error: true, message: "Shelf not found" });
    }

    res.json({ data: shelf });
  } catch (err) {
    next(err);
  }
}

async function createShelf(req, res, next) {
  try {
    const { value, errors } = validateShelf(req.body);
    if (errors.length) {
      return res.status(400).json({ error: true, message: errors.join(", ") });
    }

    const db = getDB();
    const shelf = {
      ...value,
      ownerUserId: String(req.user._id),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await getShelvesCollection(db).insertOne(shelf);
    res.status(201).json({ data: { _id: result.insertedId, ...shelf } });
  } catch (err) {
    next(err);
  }
}

async function loadShelf(req, res, next) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: true, message: "Invalid shelf id" });
    }

    const db = getDB();
    const shelf = await getShelvesCollection(db).findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!shelf) {
      return res.status(404).json({ error: true, message: "Shelf not found" });
    }

    req.resource = shelf;
    return next();
  } catch (err) {
    return next(err);
  }
}

async function updateShelf(req, res, next) {
  try {
    const { value, errors } = validateShelfUpdate(req.body);
    if (errors.length) {
      return res.status(400).json({ error: true, message: errors.join(", ") });
    }
    if (Object.keys(value).length === 0) {
      return res.status(400).json({ error: true, message: "No fields to update" });
    }

    const db = getDB();
    const updatedShelf = await getShelvesCollection(db).findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...value, updatedAt: new Date() } },
      { returnDocument: "after" },
    );

    if (!updatedShelf) {
      return res.status(404).json({ error: true, message: "Shelf not found" });
    }

    res.json({ data: updatedShelf });
  } catch (err) {
    next(err);
  }
}

async function deleteShelf(req, res, next) {
  try {
    const db = getDB();
    const result = await getShelvesCollection(db).deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: true, message: "Shelf not found" });
    }

    return res.status(200).json({ data: { deleted: true } });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listShelves,
  getShelfById,
  createShelf,
  updateShelf,
  deleteShelf,
  loadShelf,
};
