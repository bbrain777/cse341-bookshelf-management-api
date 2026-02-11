// src/validation/loanSchema.js

function validateLoan(data) {
  const errors = [];
  const value = {};

  // Book ID is required
  if (!data.bookId || typeof data.bookId !== "string") {
    errors.push("bookId is required and must be a string");
  } else {
    value.bookId = data.bookId.trim();
  }

  // Member ID is required
  if (!data.memberId || typeof data.memberId !== "string") {
    errors.push("memberId is required and must be a string");
  } else {
    value.memberId = data.memberId.trim();
  }

  // Loan date defaults to now
  value.loanDate = data.loanDate ? new Date(data.loanDate) : new Date();

  // Due date is optional but recommended
  if (data.dueDate) {
    const due = new Date(data.dueDate);
    if (isNaN(due.getTime())) {
      errors.push("dueDate must be a valid date");
    } else {
      value.dueDate = due;
    }
  }

  // Status defaults to "active"
  value.status = data.status || "active";

  return { value, errors };
}

function validateLoanUpdate(data) {
  const errors = [];
  const value = {};

  if (data.status) {
    if (!["active", "returned", "overdue"].includes(data.status)) {
      errors.push("status must be one of: active, returned, overdue");
    } else {
      value.status = data.status;
    }
  }

  if (data.dueDate) {
    const due = new Date(data.dueDate);
    if (isNaN(due.getTime())) {
      errors.push("dueDate must be a valid date");
    } else {
      value.dueDate = due;
    }
  }

  return { value, errors };
}

module.exports = { validateLoan, validateLoanUpdate };
