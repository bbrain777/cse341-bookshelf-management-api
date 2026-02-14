const request = require("supertest");

jest.mock("../db/connect", () => {
  const authors = [
    { _id: "507f1f77bcf86cd799439021", firstName: "John", lastName: "Doe" },
  ];

  return {
    getDB: jest.fn(() => ({
      collection: jest.fn((name) => {
        if (name !== "authors") {
          throw new Error(`Unexpected collection: ${name}`);
        }

        return {
          findOne: jest.fn(async (query) => {
            const id = String(query?._id || "");
            return authors.find((a) => a._id === id) || null;
          }),
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

  it("GET /authors/:id should return 200 and an author", async () => {
    const res = await request(app).get("/authors/507f1f77bcf86cd799439021");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("firstName", "John");
  });
});
