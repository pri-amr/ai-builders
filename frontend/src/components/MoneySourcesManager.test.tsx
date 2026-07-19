import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { listMoneySources, createMoneySource } from "@/services/moneySources";
import { MoneySourcesManager } from "./MoneySourcesManager";

jest.mock("@/services/moneySources", () => ({
  listMoneySources: jest.fn(),
  createMoneySource: jest.fn(),
}));

const mockedListMoneySources = listMoneySources as jest.Mock;
const mockedCreateMoneySource = createMoneySource as jest.Mock;

describe("MoneySourcesManager", () => {
  beforeEach(() => {
    mockedListMoneySources.mockReset();
    mockedCreateMoneySource.mockReset();
  });

  it("carga y muestra el listado de fuentes al montar", async () => {
    mockedListMoneySources.mockResolvedValue([
      { id: "1", name: "Brubank" },
      { id: "2", name: "Santander" },
    ]);

    render(<MoneySourcesManager token="jwt-token" />);

    expect(mockedListMoneySources).toHaveBeenCalledWith("jwt-token");
    expect(await screen.findByText("Brubank")).toBeInTheDocument();
    expect(screen.getByText("Santander")).toBeInTheDocument();
  });

  it("muestra un mensaje si el usuario todavía no tiene fuentes", async () => {
    mockedListMoneySources.mockResolvedValue([]);

    render(<MoneySourcesManager token="jwt-token" />);

    expect(
      await screen.findByText(/todavía no tenés fuentes de dinero/i)
    ).toBeInTheDocument();
  });

  it("muestra un error si falla la carga del listado", async () => {
    mockedListMoneySources.mockRejectedValue(new Error("network error"));

    render(<MoneySourcesManager token="jwt-token" />);

    expect(
      await screen.findByText(/no se pudieron cargar las fuentes de dinero/i)
    ).toBeInTheDocument();
  });

  it("valida que el nombre sea obligatorio antes de llamar al backend", async () => {
    mockedListMoneySources.mockResolvedValue([]);

    render(<MoneySourcesManager token="jwt-token" />);
    await screen.findByText(/todavía no tenés fuentes de dinero/i);

    fireEvent.click(screen.getByRole("button", { name: /agregar fuente/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /el nombre es obligatorio/i
    );
    expect(mockedCreateMoneySource).not.toHaveBeenCalled();
  });

  it("agrega la nueva fuente al listado cuando el alta es exitosa", async () => {
    mockedListMoneySources.mockResolvedValue([{ id: "1", name: "Brubank" }]);
    mockedCreateMoneySource.mockResolvedValue({ id: "2", name: "Uala" });

    render(<MoneySourcesManager token="jwt-token" />);
    await screen.findByText("Brubank");

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: "Uala" },
    });
    fireEvent.click(screen.getByRole("button", { name: /agregar fuente/i }));

    await waitFor(() =>
      expect(mockedCreateMoneySource).toHaveBeenCalledWith("jwt-token", "Uala")
    );
    expect(await screen.findByText("Uala")).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre/i)).toHaveValue("");
  });

  it("muestra el error del backend cuando el alta falla por nombre duplicado", async () => {
    mockedListMoneySources.mockResolvedValue([{ id: "1", name: "Lemon" }]);
    mockedCreateMoneySource.mockRejectedValue({
      isAxiosError: true,
      response: {
        data: { error: "Ya existe una fuente de dinero con ese nombre" },
      },
    });

    render(<MoneySourcesManager token="jwt-token" />);
    await screen.findByText("Lemon");

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: "lemon" },
    });
    fireEvent.click(screen.getByRole("button", { name: /agregar fuente/i }));

    expect(
      await screen.findByText(/ya existe una fuente de dinero con ese nombre/i)
    ).toBeInTheDocument();
  });
});
