import { redirect } from "next/navigation";
import Home from "./page";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

const mockedRedirect = redirect as unknown as jest.Mock;

describe("Home", () => {
  beforeEach(() => {
    mockedRedirect.mockClear();
  });

  it("redirige a /login", () => {
    expect(() => Home()).toThrow("NEXT_REDIRECT");
    expect(mockedRedirect).toHaveBeenCalledWith("/login");
  });
});
