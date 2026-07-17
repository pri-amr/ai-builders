import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { LoginForm } from "./LoginForm";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

const mockedUseRouter = useRouter as jest.Mock;
const mockedUseSearchParams = useSearchParams as jest.Mock;
const mockedSignIn = signIn as jest.Mock;

describe("LoginForm", () => {
  const push = jest.fn();

  beforeEach(() => {
    push.mockReset();
    mockedSignIn.mockReset();
    mockedUseRouter.mockReturnValue({ push });
    mockedUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  function fillForm(email: string, password: string) {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: email },
    });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), {
      target: { value: password },
    });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
  }

  it("inicia sesión y redirige a /dashboard cuando las credenciales son válidas", async () => {
    mockedSignIn.mockResolvedValue({ error: undefined });

    fillForm("user@example.com", "secreto123");

    await waitFor(() =>
      expect(mockedSignIn).toHaveBeenCalledWith("credentials", {
        email: "user@example.com",
        password: "secreto123",
        redirect: false,
      })
    );
    expect(push).toHaveBeenCalledWith("/dashboard");
  });

  it("muestra un error y no redirige cuando las credenciales son inválidas", async () => {
    mockedSignIn.mockResolvedValue({ error: "CredentialsSignin" });

    fillForm("user@example.com", "incorrecta");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /credenciales inválidas/i
    );
    expect(push).not.toHaveBeenCalled();
  });

  it("muestra el aviso de cuenta creada cuando viene de un registro exitoso", () => {
    mockedUseSearchParams.mockReturnValue(new URLSearchParams("registered=1"));

    render(<LoginForm />);

    expect(screen.getByText(/cuenta creada/i)).toBeInTheDocument();
  });
});
