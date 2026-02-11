const request = require("supertest");

jest.mock("../db/connect", () => {
  const books = [
    { _id: "b1", title: "Clean Code" },
    { _id: "b2", title: "Refactoring" },
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
});
