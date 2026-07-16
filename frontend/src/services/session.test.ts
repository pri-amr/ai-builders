import { handleRequest } from "./handleRequest";
import { registerUser, loginUser } from "./session";

jest.mock("./handleRequest");

const mockedHandleRequest = handleRequest as jest.Mock;

describe("session service", () => {
  beforeEach(() => {
    mockedHandleRequest.mockReset();
  });

  it("registerUser llama a POST /api/auth/register con email y password", async () => {
    mockedHandleRequest.mockResolvedValue({ id: "1", email: "user@example.com" });

    const result = await registerUser("user@example.com", "secreto123");

    expect(mockedHandleRequest).toHaveBeenCalledWith(
      "POST",
      "/api/auth/register",
      { email: "user@example.com", password: "secreto123" }
    );
    expect(result).toEqual({ id: "1", email: "user@example.com" });
  });

  it("loginUser llama a POST /api/auth/login con email y password", async () => {
    mockedHandleRequest.mockResolvedValue({
      token: "jwt-token",
      user: { id: "1", email: "user@example.com" },
    });

    const result = await loginUser("user@example.com", "secreto123");

    expect(mockedHandleRequest).toHaveBeenCalledWith(
      "POST",
      "/api/auth/login",
      { email: "user@example.com", password: "secreto123" }
    );
    expect(result).toEqual({
      token: "jwt-token",
      user: { id: "1", email: "user@example.com" },
    });
  });
});
