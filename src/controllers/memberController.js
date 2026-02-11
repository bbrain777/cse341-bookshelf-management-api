const { ObjectId } = require("mongodb");
const { getDB } = require("../db/connect");
const { getMembersCollection } = require("../models/member");
const {
  validateMember,
  validateMemberUpdate,
} = require("../validation/memberSchema");

// List all members
async function listMembers(req, res, next) {
  try {
    const db = getDB();
    const members = await getMembersCollection(db)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json({ data: members });
  } catch (err) {
    next(err);
  }
}

// Create a new member
async function createMember(req, res, next) {
  try {
    const { value, errors } = validateMember(req.body);
    if (errors.length) {
      return res.status(400).json({ error: true, message: errors.join(", ") });
    }

    const db = getDB();
    const member = {
      ...value,
      createdAt: new Date(),
    };

    const result = await getMembersCollection(db).insertOne(member);
    res.status(201).json({ data: { _id: result.insertedId, ...member } });
  } catch (err) {
    next(err);
  }
}

// Get member by ID
async function getMemberById(req, res, next) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid member id" });
    }
    const db = getDB();
    const member = await getMembersCollection(db).findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!member) {
      return res.status(404).json({ error: true, message: "Member not found" });
    }
    res.json({ data: member });
  } catch (err) {
    next(err);
  }
}

// Update member
async function updateMember(req, res, next) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid member id" });
    }
    const { value, errors } = validateMemberUpdate(req.body);
    if (errors.length) {
      return res.status(400).json({ error: true, message: errors.join(", ") });
    }
    if (Object.keys(value).length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "No fields to update" });
    }

    const db = getDB();
    const updatedMember = await getMembersCollection(db).findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: value },
      { returnDocument: "after" },
    );

    if (!updatedMember) {
      return res.status(404).json({ error: true, message: "Member not found" });
    }

    res.json({ data: updatedMember });
  } catch (err) {
    next(err);
  }
}

// Delete member
async function deleteMember(req, res, next) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid member id" });
    }
    const db = getDB();
    const result = await getMembersCollection(db).deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Member not found or already deleted" });
    }
    res.status(200).json({ data: { deleted: true } });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listMembers,
  createMember,
  getMemberById,
  updateMember,
  deleteMember,
};
