import axios from "axios";
import { handleRequest } from "./handleRequest";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("handleRequest", () => {
  const originalEnv = process.env.NEXT_PUBLIC_API_URL;

  beforeAll(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://backend.local";
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_API_URL = originalEnv;
  });

  beforeEach(() => {
    mockedAxios.request.mockReset();
  });

  it("arma la url concatenando la base con el endpoint y devuelve response.data", async () => {
    mockedAxios.request.mockResolvedValue({ data: { ok: true } });

    const result = await handleRequest("GET", "/api/health");

    expect(mockedAxios.request).toHaveBeenCalledWith({
      method: "GET",
      url: "http://backend.local/api/health",
      data: undefined,
      headers: undefined,
    });
    expect(result).toEqual({ ok: true });
  });

  it("pasa body y headers a axios", async () => {
    mockedAxios.request.mockResolvedValue({ data: { id: "1" } });

    await handleRequest(
      "POST",
      "/api/auth/login",
      { email: "user@example.com", password: "secreto123" },
      { Authorization: "Bearer token" }
    );

    expect(mockedAxios.request).toHaveBeenCalledWith({
      method: "POST",
      url: "http://backend.local/api/auth/login",
      data: { email: "user@example.com", password: "secreto123" },
      headers: { Authorization: "Bearer token" },
    });
  });

  it("lanza un error si NEXT_PUBLIC_API_URL no está definida", async () => {
    delete process.env.NEXT_PUBLIC_API_URL;

    await expect(handleRequest("GET", "/api/health")).rejects.toThrow(
      "NEXT_PUBLIC_API_URL no está definida en el entorno"
    );

    process.env.NEXT_PUBLIC_API_URL = "http://backend.local";
  });
});
