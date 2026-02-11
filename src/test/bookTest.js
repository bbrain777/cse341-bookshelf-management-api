const request = require("supertest");
const app = require("../src/app");

describe("Books API", () => {
  it("GET /books should return 200 and an array of books", async () => {
    const res = await request(app).get("/books");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
