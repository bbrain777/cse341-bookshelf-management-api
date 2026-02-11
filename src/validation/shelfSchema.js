function validateShelf(payload = {}) {
  const errors = [];
  const value = {};

  if (typeof payload.name !== "string" || payload.name.trim() === "") {
    errors.push("name is required");
  } else {
    value.name = payload.name.trim();
  }

  if (payload.description !== undefined) {
    if (
      typeof payload.description !== "string" ||
      payload.description.trim() === ""
    ) {
      errors.push("description must be a non-empty string when provided");
    } else {
      value.description = payload.description.trim();
    }
  }

  if (payload.visibility !== undefined) {
    const allowed = ["private", "shared", "public"];
    if (typeof payload.visibility !== "string" || !allowed.includes(payload.visibility)) {
      errors.push("visibility must be one of: private, shared, public");
    } else {
      value.visibility = payload.visibility;
    }
  } else {
    value.visibility = "private";
  }

  if (payload.bookIds !== undefined) {
    if (!Array.isArray(payload.bookIds) || !payload.bookIds.every((id) => typeof id === "string")) {
      errors.push("bookIds must be an array of string ids when provided");
    } else {
      value.bookIds = payload.bookIds;
    }
  } else {
    value.bookIds = [];
  }

  return { value, errors };
}

function validateShelfUpdate(payload = {}) {
  const errors = [];
  const value = {};

  if (payload.name !== undefined) {
    if (typeof payload.name !== "string" || payload.name.trim() === "") {
      errors.push("name must be a non-empty string when provided");
    } else {
      value.name = payload.name.trim();
    }
  }

  if (payload.description !== undefined) {
    if (
      typeof payload.description !== "string" ||
      payload.description.trim() === ""
    ) {
      errors.push("description must be a non-empty string when provided");
    } else {
      value.description = payload.description.trim();
    }
  }

  if (payload.visibility !== undefined) {
    const allowed = ["private", "shared", "public"];
    if (typeof payload.visibility !== "string" || !allowed.includes(payload.visibility)) {
      errors.push("visibility must be one of: private, shared, public");
    } else {
      value.visibility = payload.visibility;
    }
  }

  if (payload.bookIds !== undefined) {
    if (!Array.isArray(payload.bookIds) || !payload.bookIds.every((id) => typeof id === "string")) {
      errors.push("bookIds must be an array of string ids when provided");
    } else {
      value.bookIds = payload.bookIds;
    }
  }

  return { value, errors };
}

module.exports = { validateShelf, validateShelfUpdate };
