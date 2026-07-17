import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import RegisterPage from "./page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/services/session", () => ({
  registerUser: jest.fn(),
}));

const mockedUseRouter = useRouter as jest.Mock;

describe("RegisterPage", () => {
  beforeEach(() => {
    mockedUseRouter.mockReturnValue({ push: jest.fn() });
  });

  it("renderiza el formulario de registro", () => {
    render(<RegisterPage />);

    expect(
      screen.getByRole("heading", { name: /crear cuenta/i })
    ).toBeInTheDocument();
  });
});
