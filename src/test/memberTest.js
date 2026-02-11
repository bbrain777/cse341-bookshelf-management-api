const request = require("supertest");
const app = require("../app");

describe("Members API", () => {
  it("GET /members should require authentication", async () => {
    const res = await request(app).get("/members");
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", true);
  });

  it("GET /members/:id should require authentication", async () => {
    const fakeId = "64f1c9c2b2d1d9a7c8f1a333"; // replace with a real ID in your DB for full test
    const res = await request(app).get(`/members/${fakeId}`);
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", true);
  });
});
