import MoneySource from "../models/MoneySource";
import { seedPredefinedMoneySources } from "./moneySources";
import { PREDEFINED_MONEY_SOURCES } from "../constants/moneySources";

jest.mock("../models/MoneySource");

const mockedInsertMany = MoneySource.insertMany as unknown as jest.Mock;

describe("seedPredefinedMoneySources", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockedInsertMany.mockReset();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("siembra las fuentes predefinidas para el usuario en el primer intento", async () => {
    mockedInsertMany.mockResolvedValue(undefined);

    await seedPredefinedMoneySources("user-id-123");

    expect(mockedInsertMany).toHaveBeenCalledTimes(1);
    expect(mockedInsertMany).toHaveBeenCalledWith(
      PREDEFINED_MONEY_SOURCES.map((name) => ({ userId: "user-id-123", name }))
    );
  });

  it("reintenta hasta 3 veces y tiene éxito si un intento posterior funciona", async () => {
    mockedInsertMany
      .mockRejectedValueOnce(new Error("fallo de red"))
      .mockRejectedValueOnce(new Error("fallo de red"))
      .mockResolvedValueOnce(undefined);

    await seedPredefinedMoneySources("user-id-123", { retryDelayMs: 0 });

    expect(mockedInsertMany).toHaveBeenCalledTimes(3);
  });

  it("no lanza error si los 3 intentos fallan; solo lo loguea", async () => {
    mockedInsertMany.mockRejectedValue(new Error("fallo de red"));

    await expect(
      seedPredefinedMoneySources("user-id-123", { retryDelayMs: 0 })
    ).resolves.toBeUndefined();

    expect(mockedInsertMany).toHaveBeenCalledTimes(3);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
