import { handleRequest } from "./handleRequest";
import { createTransaction } from "./transactions";

jest.mock("./handleRequest");

const mockedHandleRequest = handleRequest as jest.Mock;

describe("transactions service", () => {
  beforeEach(() => {
    mockedHandleRequest.mockReset();
  });

  it("createTransaction llama a POST /api/transactions con el body y el token", async () => {
    const input = {
      type: "expense" as const,
      amount: 1500,
      moneySourceId: "source-1",
      currency: "ARS" as const,
      categoryId: "category-1",
      date: "15-06-2026",
      description: "Supermercado",
    };
    mockedHandleRequest.mockResolvedValue({ id: "tx-1", ...input });

    const result = await createTransaction("jwt-token", input);

    expect(mockedHandleRequest).toHaveBeenCalledWith(
      "POST",
      "/api/transactions",
      input,
      { Authorization: "Bearer jwt-token" }
    );
    expect(result).toEqual({ id: "tx-1", ...input });
  });
});
