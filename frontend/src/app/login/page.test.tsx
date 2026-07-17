import { render, screen } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginPage from "./page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

const mockedUseRouter = useRouter as jest.Mock;
const mockedUseSearchParams = useSearchParams as jest.Mock;

describe("LoginPage", () => {
  beforeEach(() => {
    mockedUseRouter.mockReturnValue({ push: jest.fn() });
    mockedUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  it("renderiza el formulario de inicio de sesión", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("heading", { name: /iniciar sesión/i })
    ).toBeInTheDocument();
  });
});
