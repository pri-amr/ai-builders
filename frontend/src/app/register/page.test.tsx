import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/session";
import RegisterPage from "./page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/services/session", () => ({
  registerUser: jest.fn(),
}));

const mockedUseRouter = useRouter as jest.Mock;
const mockedRegisterUser = registerUser as jest.Mock;

describe("RegisterPage", () => {
  const push = jest.fn();

  beforeEach(() => {
    push.mockReset();
    mockedRegisterUser.mockReset();
    mockedUseRouter.mockReturnValue({ push });
  });

  function fillForm(
    email: string,
    password: string,
    confirmPassword: string
  ) {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: email },
    });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), {
      target: { value: password },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: confirmPassword },
    });
    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));
  }

  it("registra al usuario y redirige a /login cuando las contraseñas coinciden", async () => {
    mockedRegisterUser.mockResolvedValue({ id: "1", email: "user@example.com" });

    fillForm("user@example.com", "secreto123", "secreto123");

    await waitFor(() =>
      expect(mockedRegisterUser).toHaveBeenCalledWith(
        "user@example.com",
        "secreto123"
      )
    );
    expect(push).toHaveBeenCalledWith("/login?registered=1");
  });

  it("muestra un error y no llama al backend si las contraseñas no coinciden", () => {
    fillForm("user@example.com", "secreto123", "otraCosa");

    expect(screen.getByRole("alert")).toHaveTextContent(
      /las contraseñas no coinciden/i
    );
    expect(mockedRegisterUser).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it("muestra el mensaje de error del backend si el registro falla", async () => {
    mockedRegisterUser.mockRejectedValue({
      isAxiosError: true,
      response: { data: { error: "Ya existe una cuenta con ese email" } },
    });

    fillForm("user@example.com", "secreto123", "secreto123");

    expect(
      await screen.findByText(/ya existe una cuenta con ese email/i)
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});
