const request = require("supertest");

jest.mock("../db/connect", () => {
  const shelves = [
    {
      _id: "507f1f77bcf86cd799439031",
      name: "Favorites",
      visibility: "public",
      ownerUserId: "u1",
    },
  ];

  return {
    getDB: jest.fn(() => ({
      collection: jest.fn((name) => {
        if (name !== "shelves") {
          throw new Error(`Unexpected collection: ${name}`);
        }

        return {
          findOne: jest.fn(async (query) => {
            const id = String(query?._id || "");
            return shelves.find((s) => s._id === id) || null;
          }),
          find: jest.fn(() => ({
            sort: jest.fn(() => ({
              toArray: jest.fn(async () => shelves),
            })),
          })),
        };
      }),
    })),
    connectDB: jest.fn(),
  };
});

const app = require("../app");

describe("Shelves API", () => {
  it("GET /shelves should return 200 and an array of shelves", async () => {
    const res = await request(app).get("/shelves");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /shelves/:id should return 200 and a shelf", async () => {
    const res = await request(app).get("/shelves/507f1f77bcf86cd799439031");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("name", "Favorites");
  });

  it("POST /shelves should require authentication", async () => {
    const res = await request(app).post("/shelves").send({ name: "Weekend Reads" });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", true);
  });
});
