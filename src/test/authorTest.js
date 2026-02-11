const request = require("supertest");

jest.mock("../db/connect", () => {
  const authors = [{ _id: "a1", firstName: "John", lastName: "Doe" }];

  return {
    getDB: jest.fn(() => ({
      collection: jest.fn((name) => {
        if (name !== "authors") {
          throw new Error(`Unexpected collection: ${name}`);
        }

        return {
          find: jest.fn(() => ({
            sort: jest.fn(() => ({
              toArray: jest.fn(async () => authors),
            })),
          })),
        };
      }),
    })),
    connectDB: jest.fn(),
  };
});

const app = require("../app");

describe("Authors API", () => {
  it("GET /authors should return 200 and an array of authors", async () => {
    const res = await request(app).get("/authors");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
