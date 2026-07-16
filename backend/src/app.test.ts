import request from "supertest";
import app from "./app";

describe("GET /health", () => {
  it("responde 200 con status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
