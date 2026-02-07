function validateAuthor(payload = {}) {
  const errors = [];
  const value = {};

  if (typeof payload.firstName !== "string" || payload.firstName.trim() === "") {
    errors.push("firstName is required");
  } else {
    value.firstName = payload.firstName.trim();
  }

  if (typeof payload.lastName !== "string" || payload.lastName.trim() === "") {
    errors.push("lastName is required");
  } else {
    value.lastName = payload.lastName.trim();
  }

  if (typeof payload.nationality !== "string" || payload.nationality.trim() === "") {
    errors.push("nationality is required");
  } else {
    value.nationality = payload.nationality.trim();
  }

  if (!Array.isArray(payload.genres) || payload.genres.length === 0) {
    errors.push("genres must be a non-empty array");
  } else if (!payload.genres.every((g) => typeof g === "string" && g.trim() !== "")) {
    errors.push("genres must contain non-empty strings");
  } else {
    value.genres = payload.genres.map((g) => g.trim());
  }

  if (typeof payload.bio !== "string" || payload.bio.trim() === "") {
    errors.push("bio is required");
  } else {
    value.bio = payload.bio.trim();
  }

  return { value, errors };
}

function validateAuthorUpdate(payload = {}) {
  const errors = [];
  const value = {};

  if (payload.firstName !== undefined) {
    if (typeof payload.firstName !== "string" || payload.firstName.trim() === "") {
      errors.push("firstName must be a non-empty string when provided");
    } else {
      value.firstName = payload.firstName.trim();
    }
  }

  if (payload.lastName !== undefined) {
    if (typeof payload.lastName !== "string" || payload.lastName.trim() === "") {
      errors.push("lastName must be a non-empty string when provided");
    } else {
      value.lastName = payload.lastName.trim();
    }
  }

  if (payload.nationality !== undefined) {
    if (typeof payload.nationality !== "string" || payload.nationality.trim() === "") {
      errors.push("nationality must be a non-empty string when provided");
    } else {
      value.nationality = payload.nationality.trim();
    }
  }

  if (payload.genres !== undefined) {
    if (!Array.isArray(payload.genres) || payload.genres.length === 0) {
      errors.push("genres must be a non-empty array when provided");
    } else if (!payload.genres.every((g) => typeof g === "string" && g.trim() !== "")) {
      errors.push("genres must contain non-empty strings when provided");
    } else {
      value.genres = payload.genres.map((g) => g.trim());
    }
  }

  if (payload.bio !== undefined) {
    if (typeof payload.bio !== "string" || payload.bio.trim() === "") {
      errors.push("bio must be a non-empty string when provided");
    } else {
      value.bio = payload.bio.trim();
    }
  }

  return { value, errors };
}

module.exports = { validateAuthor, validateAuthorUpdate };
