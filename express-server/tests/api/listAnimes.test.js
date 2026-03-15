const supertest = require("supertest");
const server = require("../../src/index");

const api = supertest(server);

describe("GET /api/works", () => {
  test("answer with a JSON", async () => {
    const res = await api
      .get("/api/works")
      .expect(200)
      .expect("Content-Type", /json/);

    expect(res.body.success).toBe(true);
  });

  test("returns an array", async () => {
    const res = await api.get("/api/animes").expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("returns an array with objects that includes the properties id, title and description", async () => {
    const res = await api.get("/api/animes").expect(200);

    const primerObj = res.body.data[0];
    expect(primerObj).toHaveProperty("id");
    expect(primerObj).toHaveProperty("title");
    expect(primerObj).toHaveProperty("description");
  });
});
