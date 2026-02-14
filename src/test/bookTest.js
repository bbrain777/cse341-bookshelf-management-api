const request = require("supertest");

jest.mock("../db/connect", () => {
  const books = [
    { _id: "507f1f77bcf86cd799439011", title: "Clean Code" },
    { _id: "507f1f77bcf86cd799439012", title: "Refactoring" },
  ];

  const makeCursor = (rows) => ({
    sort: jest.fn(() => makeCursor(rows)),
    skip: jest.fn(() => makeCursor(rows)),
    limit: jest.fn(() => ({
      toArray: jest.fn(async () => rows),
    })),
    toArray: jest.fn(async () => rows),
  });

  return {
    getDB: jest.fn(() => ({
      collection: jest.fn((name) => {
        if (name !== "books") {
          throw new Error(`Unexpected collection: ${name}`);
        }

        return {
          findOne: jest.fn(async (query) => {
            const id = String(query?._id || "");
            return books.find((b) => b._id === id) || null;
          }),
          find: jest.fn(() => makeCursor(books)),
          countDocuments: jest.fn(async () => books.length),
        };
      }),
    })),
    connectDB: jest.fn(),
  };
});

const app = require("../app");

describe("Books API", () => {
  it("GET /books should return 200 and an array of books", async () => {
    const res = await request(app).get("/books");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty("pagination");
  });

  it("GET /books/:id should return 200 and a book", async () => {
    const res = await request(app).get("/books/507f1f77bcf86cd799439011");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("title", "Clean Code");
  });
});
