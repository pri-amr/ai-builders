import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import app from "../app";
import User from "../models/User";

jest.mock("../models/User");

const mockedFindOne = User.findOne as unknown as jest.Mock;
const mockedCreate = User.create as unknown as jest.Mock;

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    mockedFindOne.mockReset();
    mockedCreate.mockReset();
  });

  it("responde 400 si falta el password", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "user@example.com" });

    expect(response.status).toBe(400);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("responde 400 si el email tiene formato inválido", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "no-es-un-email", password: "secreto123" });

    expect(response.status).toBe(400);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("responde 409 si el email ya está registrado", async () => {
    mockedFindOne.mockResolvedValue({ email: "user@example.com" });

    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "user@example.com", password: "secreto123" });

    expect(response.status).toBe(409);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("registra al usuario con el password hasheado y responde 201 sin exponer el hash", async () => {
    mockedFindOne.mockResolvedValue(null);
    mockedCreate.mockImplementation(async (data: { email: string; passwordHash: string }) => ({
      _id: "user-id-123",
      email: data.email,
      passwordHash: data.passwordHash,
    }));

    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "User@Example.com", password: "secreto123" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: "user-id-123", email: "user@example.com" });

    const createdData = mockedCreate.mock.calls[0][0];
    expect(createdData.passwordHash).not.toBe("secreto123");
    await expect(
      bcrypt.compare("secreto123", createdData.passwordHash)
    ).resolves.toBe(true);
  });
});

describe("POST /api/auth/login", () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  beforeEach(() => {
    mockedFindOne.mockReset();
  });

  it("responde 400 si falta el email", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ password: "secreto123" });

    expect(response.status).toBe(400);
  });

  it("responde 401 si el usuario no existe", async () => {
    mockedFindOne.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "no-existe@example.com", password: "secreto123" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Credenciales inválidas" });
  });

  it("responde 401 si el password no matchea", async () => {
    const passwordHash = await bcrypt.hash("password-correcto", 12);
    mockedFindOne.mockResolvedValue({
      _id: "user-id-123",
      email: "user@example.com",
      passwordHash,
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@example.com", password: "password-incorrecto" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Credenciales inválidas" });
  });

  it("responde 200 con un JWT válido cuando las credenciales son correctas", async () => {
    const passwordHash = await bcrypt.hash("secreto123", 12);
    mockedFindOne.mockResolvedValue({
      _id: "user-id-123",
      email: "user@example.com",
      passwordHash,
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@example.com", password: "secreto123" });

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual({ id: "user-id-123", email: "user@example.com" });

    const decoded = jwt.verify(response.body.token, "test-secret") as {
      sub: string;
      email: string;
    };
    expect(decoded.sub).toBe("user-id-123");
    expect(decoded.email).toBe("user@example.com");
  });
});
