import request from "supertest";
import app from "../app";
import Category from "../models/Category";
import { signToken } from "../utils/jwt";

jest.mock("../models/Category");

const mockedFindOne = Category.findOne as unknown as jest.Mock;
const mockedCreate = Category.create as unknown as jest.Mock;
const mockedFind = Category.find as unknown as jest.Mock;

describe("POST /api/categories", () => {
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
      .post("/api/categories")
      .send({ name: "Ocio" });

    expect(response.status).toBe(401);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("responde 400 si falta el nombre", async () => {
    const response = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("responde 400 si el nombre es solo espacios", async () => {
    const response = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "   " });

    expect(response.status).toBe(400);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("responde 409 si ya existe una categoría con ese nombre para el usuario (case-insensitive)", async () => {
    mockedFindOne.mockResolvedValue({ _id: "existing-id", name: "Comida" });

    const response = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "comida" });

    expect(response.status).toBe(409);
    expect(mockedFindOne).toHaveBeenCalledWith({
      userId: "user-id-123",
      name: expect.any(RegExp),
    });
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("crea la categoría asociada al usuario autenticado y responde 201", async () => {
    mockedFindOne.mockResolvedValue(null);
    mockedCreate.mockResolvedValue({ _id: "new-id", name: "Ocio" });

    const response = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "  Ocio  " });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: "new-id", name: "Ocio" });
    expect(mockedCreate).toHaveBeenCalledWith({
      userId: "user-id-123",
      name: "Ocio",
    });
  });
});

describe("GET /api/categories", () => {
  const originalSecret = process.env.JWT_SECRET;
  let token: string;
  let mockedSort: jest.Mock;

  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
    token = signToken({ sub: "user-id-123", email: "user@example.com" });
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  beforeEach(() => {
    mockedFind.mockReset();
    mockedSort = jest.fn();
    mockedFind.mockReturnValue({ sort: mockedSort });
  });

  it("responde 401 si no hay token", async () => {
    const response = await request(app).get("/api/categories");

    expect(response.status).toBe(401);
    expect(mockedFind).not.toHaveBeenCalled();
  });

  it("devuelve únicamente las categorías del usuario autenticado, ordenadas por nombre", async () => {
    mockedSort.mockResolvedValue([
      { _id: "id-1", name: "comida" },
      { _id: "id-2", name: "transporte" },
    ]);

    const response = await request(app)
      .get("/api/categories")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(mockedFind).toHaveBeenCalledWith({ userId: "user-id-123" });
    expect(mockedSort).toHaveBeenCalledWith({ name: 1 });
    expect(response.body).toEqual([
      { id: "id-1", name: "comida" },
      { id: "id-2", name: "transporte" },
    ]);
  });

  it("devuelve una lista vacía si el usuario no tiene categorías", async () => {
    mockedSort.mockResolvedValue([]);

    const response = await request(app)
      .get("/api/categories")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
