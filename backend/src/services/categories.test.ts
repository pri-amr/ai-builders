import Category from "../models/Category";
import { seedPredefinedCategories } from "./categories";
import { PREDEFINED_CATEGORIES } from "../constants/categories";

jest.mock("../models/Category");

const mockedInsertMany = Category.insertMany as unknown as jest.Mock;

describe("seedPredefinedCategories", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockedInsertMany.mockReset();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("siembra las categorías predefinidas para el usuario en el primer intento", async () => {
    mockedInsertMany.mockResolvedValue(undefined);

    await seedPredefinedCategories("user-id-123");

    expect(mockedInsertMany).toHaveBeenCalledTimes(1);
    expect(mockedInsertMany).toHaveBeenCalledWith(
      PREDEFINED_CATEGORIES.map((name) => ({ userId: "user-id-123", name }))
    );
  });

  it("reintenta hasta 3 veces y tiene éxito si un intento posterior funciona", async () => {
    mockedInsertMany
      .mockRejectedValueOnce(new Error("fallo de red"))
      .mockRejectedValueOnce(new Error("fallo de red"))
      .mockResolvedValueOnce(undefined);

    await seedPredefinedCategories("user-id-123", { retryDelayMs: 0 });

    expect(mockedInsertMany).toHaveBeenCalledTimes(3);
  });

  it("no lanza error si los 3 intentos fallan; solo lo loguea", async () => {
    mockedInsertMany.mockRejectedValue(new Error("fallo de red"));

    await expect(
      seedPredefinedCategories("user-id-123", { retryDelayMs: 0 })
    ).resolves.toBeUndefined();

    expect(mockedInsertMany).toHaveBeenCalledTimes(3);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
