const request = require("supertest");
const app = require("../src/app");

describe("Members API", () => {
  it("GET /members should return 200 and an array of members", async () => {
    const res = await request(app).get("/members");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /members/:id should return 200 for a valid member ID or 404 if not found", async () => {
    const fakeId = "64f1c9c2b2d1d9a7c8f1a333"; // replace with a real ID in your DB for full test
    const res = await request(app).get(`/members/${fakeId}`);
    expect([200, 404]).toContain(res.statusCode);
  });
});
