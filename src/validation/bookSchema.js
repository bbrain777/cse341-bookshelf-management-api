function validateBook(payload = {}) {
  const errors = [];
  const value = {};

  if (typeof payload.title !== "string" || payload.title.trim() === "") {
    errors.push("title is required");
  } else {
    value.title = payload.title.trim();
  }

  if (typeof payload.author !== "string" || payload.author.trim() === "") {
    errors.push("author is required");
  } else {
    value.author = payload.author.trim();
  }

  if (payload.isbn !== undefined) {
    if (typeof payload.isbn !== "string" || payload.isbn.trim() === "") {
      errors.push("isbn must be a non-empty string when provided");
    } else {
      value.isbn = payload.isbn.trim();
    }
  }

  if (typeof payload.genre !== "string" || payload.genre.trim() === "") {
    errors.push("genre is required");
  } else {
    value.genre = payload.genre.trim();
  }

  if (
    typeof payload.copiesAvailable !== "number" ||
    !Number.isInteger(payload.copiesAvailable) ||
    payload.copiesAvailable < 0
  ) {
    errors.push("copiesAvailable must be a non-negative integer");
  } else {
    value.copiesAvailable = payload.copiesAvailable;
  }

  if (typeof payload.shelfNumber !== "string" || payload.shelfNumber.trim() === "") {
    errors.push("shelfNumber is required");
  } else {
    value.shelfNumber = payload.shelfNumber.trim();
  }

  if (payload.status !== undefined) {
    const allowed = ["reading", "completed", "planned"];
    if (typeof payload.status !== "string" || !allowed.includes(payload.status)) {
      errors.push("status must be one of: reading, completed, planned");
    } else {
      value.status = payload.status;
    }
  }

  return { value, errors };
}

function validateBookUpdate(payload = {}) {
  const errors = [];
  const value = {};

  if (payload.title !== undefined) {
    if (typeof payload.title !== "string" || payload.title.trim() === "") {
      errors.push("title must be a non-empty string when provided");
    } else {
      value.title = payload.title.trim();
    }
  }

  if (payload.author !== undefined) {
    if (typeof payload.author !== "string" || payload.author.trim() === "") {
      errors.push("author must be a non-empty string when provided");
    } else {
      value.author = payload.author.trim();
    }
  }

  if (payload.isbn !== undefined) {
    if (typeof payload.isbn !== "string" || payload.isbn.trim() === "") {
      errors.push("isbn must be a non-empty string when provided");
    } else {
      value.isbn = payload.isbn.trim();
    }
  }

  if (payload.genre !== undefined) {
    if (typeof payload.genre !== "string" || payload.genre.trim() === "") {
      errors.push("genre must be a non-empty string when provided");
    } else {
      value.genre = payload.genre.trim();
    }
  }

  if (payload.copiesAvailable !== undefined) {
    if (
      typeof payload.copiesAvailable !== "number" ||
      !Number.isInteger(payload.copiesAvailable) ||
      payload.copiesAvailable < 0
    ) {
      errors.push("copiesAvailable must be a non-negative integer when provided");
    } else {
      value.copiesAvailable = payload.copiesAvailable;
    }
  }

  if (payload.shelfNumber !== undefined) {
    if (typeof payload.shelfNumber !== "string" || payload.shelfNumber.trim() === "") {
      errors.push("shelfNumber must be a non-empty string when provided");
    } else {
      value.shelfNumber = payload.shelfNumber.trim();
    }
  }

  if (payload.status !== undefined) {
    const allowed = ["reading", "completed", "planned"];
    if (typeof payload.status !== "string" || !allowed.includes(payload.status)) {
      errors.push("status must be one of: reading, completed, planned");
    } else {
      value.status = payload.status;
    }
  }

  return { value, errors };
}

module.exports = { validateBook, validateBookUpdate };
