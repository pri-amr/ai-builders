import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import { requireAuth } from "./auth";
import { signToken } from "../utils/jwt";

function buildTestApp() {
  const app = express();
  app.get("/protected", requireAuth, (req, res) => {
    res.status(200).json({ userId: req.userId, userEmail: req.userEmail });
  });
  return app;
}

describe("requireAuth", () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  const app = buildTestApp();

  it("responde 401 si no hay header Authorization", async () => {
    const response = await request(app).get("/protected");

    expect(response.status).toBe(401);
  });

  it("responde 401 si el header no tiene formato Bearer", async () => {
    const response = await request(app)
      .get("/protected")
      .set("Authorization", "token-sin-bearer");

    expect(response.status).toBe(401);
  });

  it("responde 401 si el token es inválido", async () => {
    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer token-invalido");

    expect(response.status).toBe(401);
  });

  it("responde 401 si el token está expirado", async () => {
    const expiredToken = jwt.sign(
      { sub: "user-id-123", email: "user@example.com" },
      "test-secret",
      { expiresIn: -10 }
    );

    const response = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
  });

  it("adjunta userId y userEmail cuando el token es válido", async () => {
    const token = signToken({ sub: "user-id-123", email: "user@example.com" });

    const response = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      userId: "user-id-123",
      userEmail: "user@example.com",
    });
  });
});
