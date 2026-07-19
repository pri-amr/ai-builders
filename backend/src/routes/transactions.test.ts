import request from "supertest";
import { Types } from "mongoose";
import app from "../app";
import Transaction from "../models/Transaction";
import MoneySource from "../models/MoneySource";
import Category from "../models/Category";
import { signToken } from "../utils/jwt";

jest.mock("../models/Transaction");
jest.mock("../models/MoneySource");
jest.mock("../models/Category");

const mockedTransactionCreate = Transaction.create as unknown as jest.Mock;
const mockedMoneySourceFindOne = MoneySource.findOne as unknown as jest.Mock;
const mockedCategoryFindOne = Category.findOne as unknown as jest.Mock;

const moneySourceId = new Types.ObjectId().toString();
const categoryId = new Types.ObjectId().toString();

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    type: "expense",
    amount: 1500,
    moneySourceId,
    currency: "ARS",
    categoryId,
    date: "15-06-2026",
    description: "Supermercado",
    ...overrides,
  };
}

describe("POST /api/transactions", () => {
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
    mockedTransactionCreate.mockReset();
    mockedMoneySourceFindOne.mockReset();
    mockedCategoryFindOne.mockReset();
    mockedMoneySourceFindOne.mockResolvedValue({ _id: moneySourceId });
    mockedCategoryFindOne.mockResolvedValue({ _id: categoryId });
  });

  function post(body: unknown) {
    return request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send(body);
  }

  it("responde 401 si no hay token", async () => {
    const response = await request(app)
      .post("/api/transactions")
      .send(validPayload());

    expect(response.status).toBe(401);
    expect(mockedTransactionCreate).not.toHaveBeenCalled();
  });

  it("responde 400 si el tipo no es income ni expense", async () => {
    const response = await post(validPayload({ type: "otro" }));

    expect(response.status).toBe(400);
    expect(mockedTransactionCreate).not.toHaveBeenCalled();
  });

  it("responde 400 si falta el monto", async () => {
    const response = await post(validPayload({ amount: undefined }));

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/monto es obligatorio/i);
  });

  it("responde 400 si el monto no es numérico", async () => {
    const response = await post(validPayload({ amount: "no-es-numero" }));

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/monto debe ser un número/i);
  });

  it("responde 400 si el monto es cero o negativo", async () => {
    const response = await post(validPayload({ amount: 0 }));

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/monto debe ser mayor a cero/i);
  });

  it("responde 400 si falta la fuente de dinero", async () => {
    const response = await post(validPayload({ moneySourceId: undefined }));

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/fuente de dinero es obligatoria/i);
  });

  it("responde 400 si falta la moneda", async () => {
    const response = await post(validPayload({ currency: undefined }));

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/moneda es obligatoria/i);
  });

  it("responde 400 si falta la categoría", async () => {
    const response = await post(validPayload({ categoryId: undefined }));

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/categoría es obligatoria/i);
  });

  it("responde 400 si falta la fecha", async () => {
    const response = await post(validPayload({ date: undefined }));

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/fecha es obligatoria/i);
  });

  it("responde 400 si la fecha no tiene el formato DD-MM-YYYY", async () => {
    const response = await post(validPayload({ date: "2026-06-15" }));

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/formato DD-MM-YYYY/i);
  });

  it("responde 400 si falta la descripción", async () => {
    const response = await post(validPayload({ description: "   " }));

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/descripción es obligatoria/i);
  });

  it("responde 400 si la fuente de dinero no existe o no es del usuario", async () => {
    mockedMoneySourceFindOne.mockResolvedValue(null);

    const response = await post(validPayload());

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/fuente de dinero no existe/i);
    expect(mockedMoneySourceFindOne).toHaveBeenCalledWith({
      _id: moneySourceId,
      userId: "user-id-123",
    });
    expect(mockedTransactionCreate).not.toHaveBeenCalled();
  });

  it("responde 400 si la categoría no existe o no es del usuario", async () => {
    mockedCategoryFindOne.mockResolvedValue(null);

    const response = await post(validPayload());

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/categoría no existe/i);
    expect(mockedCategoryFindOne).toHaveBeenCalledWith({
      _id: categoryId,
      userId: "user-id-123",
    });
    expect(mockedTransactionCreate).not.toHaveBeenCalled();
  });

  it("responde 400 si el id de la fuente de dinero no es un ObjectId válido", async () => {
    const response = await post(validPayload({ moneySourceId: "no-es-un-id" }));

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/fuente de dinero no existe/i);
    expect(mockedMoneySourceFindOne).not.toHaveBeenCalled();
  });

  it("crea la transacción con los datos válidos y responde 201", async () => {
    mockedTransactionCreate.mockResolvedValue({
      _id: "transaction-id-1",
      type: "expense",
      amount: 1500,
      moneySourceId,
      currency: "ARS",
      categoryId,
      date: new Date(Date.UTC(2026, 5, 15)),
      description: "Supermercado",
    });

    const response = await post(validPayload());

    expect(response.status).toBe(201);
    expect(mockedTransactionCreate).toHaveBeenCalledWith({
      userId: "user-id-123",
      type: "expense",
      amount: 1500,
      moneySourceId,
      currency: "ARS",
      categoryId,
      date: new Date(Date.UTC(2026, 5, 15)),
      description: "Supermercado",
    });
    expect(response.body).toEqual({
      id: "transaction-id-1",
      type: "expense",
      amount: 1500,
      moneySourceId,
      currency: "ARS",
      categoryId,
      date: "15-06-2026",
      description: "Supermercado",
    });
  });
});
