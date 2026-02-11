// src/validation/memberSchema.js

function validateMember(data) {
  const errors = [];
  const value = {};

  if (!data.name || typeof data.name !== "string") {
    errors.push("Name is required and must be a string");
  } else {
    value.name = data.name.trim();
  }

  if (!data.email || typeof data.email !== "string") {
    errors.push("Email is required and must be a string");
  } else {
    value.email = data.email.trim();
  }

  // Add other fields as needed (phone, membershipType, etc.)

  return { value, errors };
}

function validateMemberUpdate(data) {
  const errors = [];
  const value = {};

  if (data.name) {
    if (typeof data.name !== "string") {
      errors.push("Name must be a string");
    } else {
      value.name = data.name.trim();
    }
  }

  if (data.email) {
    if (typeof data.email !== "string") {
      errors.push("Email must be a string");
    } else {
      value.email = data.email.trim();
    }
  }

  // Add other updatable fields here

  return { value, errors };
}

module.exports = { validateMember, validateMemberUpdate };
