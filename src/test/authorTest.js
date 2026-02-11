const request = require("supertest");
const app = require("../src/app");

describe("Authors API", () => {
  it("GET /authors should return 200 and an array of authors", async () => {
    const res = await request(app).get("/authors");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
