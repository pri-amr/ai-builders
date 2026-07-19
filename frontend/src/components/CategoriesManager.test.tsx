import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { listCategories, createCategory } from "@/services/categories";
import { CategoriesManager } from "./CategoriesManager";

jest.mock("@/services/categories", () => ({
  listCategories: jest.fn(),
  createCategory: jest.fn(),
}));

const mockedListCategories = listCategories as jest.Mock;
const mockedCreateCategory = createCategory as jest.Mock;

describe("CategoriesManager", () => {
  beforeEach(() => {
    mockedListCategories.mockReset();
    mockedCreateCategory.mockReset();
  });

  it("carga y muestra el listado de categorías al montar", async () => {
    mockedListCategories.mockResolvedValue([
      { id: "1", name: "comida" },
      { id: "2", name: "transporte" },
    ]);

    render(<CategoriesManager token="jwt-token" />);

    expect(mockedListCategories).toHaveBeenCalledWith("jwt-token");
    expect(await screen.findByText("comida")).toBeInTheDocument();
    expect(screen.getByText("transporte")).toBeInTheDocument();
  });

  it("muestra un mensaje si el usuario todavía no tiene categorías", async () => {
    mockedListCategories.mockResolvedValue([]);

    render(<CategoriesManager token="jwt-token" />);

    expect(
      await screen.findByText(/todavía no tenés categorías/i)
    ).toBeInTheDocument();
  });

  it("muestra un error si falla la carga del listado", async () => {
    mockedListCategories.mockRejectedValue(new Error("network error"));

    render(<CategoriesManager token="jwt-token" />);

    expect(
      await screen.findByText(/no se pudieron cargar las categorías/i)
    ).toBeInTheDocument();
  });

  it("valida que el nombre sea obligatorio antes de llamar al backend", async () => {
    mockedListCategories.mockResolvedValue([]);

    render(<CategoriesManager token="jwt-token" />);
    await screen.findByText(/todavía no tenés categorías/i);

    fireEvent.click(screen.getByRole("button", { name: /agregar categoría/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /el nombre es obligatorio/i
    );
    expect(mockedCreateCategory).not.toHaveBeenCalled();
  });

  it("agrega la nueva categoría al listado cuando el alta es exitosa", async () => {
    mockedListCategories.mockResolvedValue([{ id: "1", name: "comida" }]);
    mockedCreateCategory.mockResolvedValue({ id: "2", name: "ocio" });

    render(<CategoriesManager token="jwt-token" />);
    await screen.findByText("comida");

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: "ocio" },
    });
    fireEvent.click(screen.getByRole("button", { name: /agregar categoría/i }));

    await waitFor(() =>
      expect(mockedCreateCategory).toHaveBeenCalledWith("jwt-token", "ocio")
    );
    expect(await screen.findByText("ocio")).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre/i)).toHaveValue("");
  });

  it("muestra el error del backend cuando el alta falla por nombre duplicado", async () => {
    mockedListCategories.mockResolvedValue([{ id: "1", name: "comida" }]);
    mockedCreateCategory.mockRejectedValue({
      isAxiosError: true,
      response: {
        data: { error: "Ya existe una categoría con ese nombre" },
      },
    });

    render(<CategoriesManager token="jwt-token" />);
    await screen.findByText("comida");

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: "Comida" },
    });
    fireEvent.click(screen.getByRole("button", { name: /agregar categoría/i }));

    expect(
      await screen.findByText(/ya existe una categoría con ese nombre/i)
    ).toBeInTheDocument();
  });
});
