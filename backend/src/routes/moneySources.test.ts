import request from "supertest";
import app from "../app";
import MoneySource from "../models/MoneySource";
import { signToken } from "../utils/jwt";

jest.mock("../models/MoneySource");

const mockedFindOne = MoneySource.findOne as unknown as jest.Mock;
const mockedCreate = MoneySource.create as unknown as jest.Mock;

describe("POST /api/money-sources", () => {
  const originalSecret = process.env.JWT_SECRET;
  let token: string;

  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
    token = signToken({ sub: "user-id-123", email: "user@example.com" });
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  beforeEach(() => {
    mockedFindOne.mockReset();
    mockedCreate.mockReset();
  });

  it("responde 401 si no hay token", async () => {
    const response = await request(app)
      .post("/api/money-sources")
      .send({ name: "Uala" });

    expect(response.status).toBe(401);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("responde 400 si falta el nombre", async () => {
    const response = await request(app)
      .post("/api/money-sources")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("responde 400 si el nombre es solo espacios", async () => {
    const response = await request(app)
      .post("/api/money-sources")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "   " });

    expect(response.status).toBe(400);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("responde 409 si ya existe una fuente con ese nombre para el usuario (case-insensitive)", async () => {
    mockedFindOne.mockResolvedValue({ _id: "existing-id", name: "Lemon" });

    const response = await request(app)
      .post("/api/money-sources")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "lemon" });

    expect(response.status).toBe(409);
    expect(mockedFindOne).toHaveBeenCalledWith({
      userId: "user-id-123",
      name: expect.any(RegExp),
    });
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("no deja que un nombre con caracteres especiales de regex rompa la búsqueda de duplicados", async () => {
    mockedFindOne.mockResolvedValue(null);
    mockedCreate.mockResolvedValue({ _id: "new-id", name: "Banco (Test)" });

    const response = await request(app)
      .post("/api/money-sources")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Banco (Test)" });

    expect(response.status).toBe(201);
    const usedRegex = mockedFindOne.mock.calls[0][0].name as RegExp;
    expect(usedRegex.test("Banco (Test)")).toBe(true);
    expect(usedRegex.test("Banco X")).toBe(false);
  });

  it("crea la fuente de dinero asociada al usuario autenticado y responde 201", async () => {
    mockedFindOne.mockResolvedValue(null);
    mockedCreate.mockResolvedValue({ _id: "new-id", name: "Uala" });

    const response = await request(app)
      .post("/api/money-sources")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "  Uala  " });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: "new-id", name: "Uala" });
    expect(mockedCreate).toHaveBeenCalledWith({
      userId: "user-id-123",
      name: "Uala",
    });
  });
});
