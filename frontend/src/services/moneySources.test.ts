import { handleRequest } from "./handleRequest";
import { listMoneySources, createMoneySource } from "./moneySources";

jest.mock("./handleRequest");

const mockedHandleRequest = handleRequest as jest.Mock;

describe("moneySources service", () => {
  beforeEach(() => {
    mockedHandleRequest.mockReset();
  });

  it("listMoneySources llama a GET /api/money-sources con el token en el header", async () => {
    mockedHandleRequest.mockResolvedValue([{ id: "1", name: "Lemon" }]);

    const result = await listMoneySources("jwt-token");

    expect(mockedHandleRequest).toHaveBeenCalledWith(
      "GET",
      "/api/money-sources",
      undefined,
      { Authorization: "Bearer jwt-token" }
    );
    expect(result).toEqual([{ id: "1", name: "Lemon" }]);
  });

  it("createMoneySource llama a POST /api/money-sources con el nombre y el token", async () => {
    mockedHandleRequest.mockResolvedValue({ id: "2", name: "Uala" });

    const result = await createMoneySource("jwt-token", "Uala");

    expect(mockedHandleRequest).toHaveBeenCalledWith(
      "POST",
      "/api/money-sources",
      { name: "Uala" },
      { Authorization: "Bearer jwt-token" }
    );
    expect(result).toEqual({ id: "2", name: "Uala" });
  });
});
