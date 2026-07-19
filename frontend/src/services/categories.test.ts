import { handleRequest } from "./handleRequest";
import { listCategories, createCategory } from "./categories";

jest.mock("./handleRequest");

const mockedHandleRequest = handleRequest as jest.Mock;

describe("categories service", () => {
  beforeEach(() => {
    mockedHandleRequest.mockReset();
  });

  it("listCategories llama a GET /api/categories con el token en el header", async () => {
    mockedHandleRequest.mockResolvedValue([{ id: "1", name: "comida" }]);

    const result = await listCategories("jwt-token");

    expect(mockedHandleRequest).toHaveBeenCalledWith(
      "GET",
      "/api/categories",
      undefined,
      { Authorization: "Bearer jwt-token" }
    );
    expect(result).toEqual([{ id: "1", name: "comida" }]);
  });

  it("createCategory llama a POST /api/categories con el nombre y el token", async () => {
    mockedHandleRequest.mockResolvedValue({ id: "2", name: "ocio" });

    const result = await createCategory("jwt-token", "ocio");

    expect(mockedHandleRequest).toHaveBeenCalledWith(
      "POST",
      "/api/categories",
      { name: "ocio" },
      { Authorization: "Bearer jwt-token" }
    );
    expect(result).toEqual({ id: "2", name: "ocio" });
  });
});
