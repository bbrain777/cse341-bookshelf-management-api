const request = require("supertest");

jest.mock("../db/connect", () => {
  const shelves = [
    { _id: "s1", name: "Favorites", visibility: "public", ownerUserId: "u1" },
  ];

  return {
    getDB: jest.fn(() => ({
      collection: jest.fn((name) => {
        if (name !== "shelves") {
          throw new Error(`Unexpected collection: ${name}`);
        }

        return {
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

  it("POST /shelves should require authentication", async () => {
    const res = await request(app).post("/shelves").send({ name: "Weekend Reads" });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", true);
  });
});
