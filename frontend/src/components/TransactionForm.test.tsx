import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { listMoneySources } from "@/services/moneySources";
import { listCategories } from "@/services/categories";
import { createTransaction } from "@/services/transactions";
import { TransactionForm } from "./TransactionForm";

jest.mock("@/services/moneySources", () => ({
  listMoneySources: jest.fn(),
}));

jest.mock("@/services/categories", () => ({
  listCategories: jest.fn(),
}));

jest.mock("@/services/transactions", () => ({
  createTransaction: jest.fn(),
}));

const mockedListMoneySources = listMoneySources as jest.Mock;
const mockedListCategories = listCategories as jest.Mock;
const mockedCreateTransaction = createTransaction as jest.Mock;

async function renderFormWithOptions() {
  mockedListMoneySources.mockResolvedValue([
    { id: "source-1", name: "Lemon" },
  ]);
  mockedListCategories.mockResolvedValue([
    { id: "category-1", name: "comida" },
  ]);

  render(<TransactionForm token="jwt-token" />);

  await screen.findByRole("option", { name: "Lemon" });
}

function fillValidForm() {
  fireEvent.change(screen.getByLabelText(/monto/i), {
    target: { value: "1500" },
  });
  fireEvent.change(screen.getByLabelText(/fuente de dinero/i), {
    target: { value: "source-1" },
  });
  fireEvent.change(screen.getByLabelText(/moneda/i), {
    target: { value: "ARS" },
  });
  fireEvent.change(screen.getByLabelText(/categoría/i), {
    target: { value: "category-1" },
  });
  fireEvent.change(screen.getByLabelText(/fecha/i), {
    target: { value: "2026-06-15" },
  });
  fireEvent.change(screen.getByLabelText(/descripción/i), {
    target: { value: "Supermercado" },
  });
}

describe("TransactionForm", () => {
  beforeEach(() => {
    mockedListMoneySources.mockReset();
    mockedListCategories.mockReset();
    mockedCreateTransaction.mockReset();
  });

  it("carga las fuentes de dinero y categorías al montar", async () => {
    await renderFormWithOptions();

    expect(mockedListMoneySources).toHaveBeenCalledWith("jwt-token");
    expect(mockedListCategories).toHaveBeenCalledWith("jwt-token");
    expect(screen.getByRole("option", { name: "comida" })).toBeInTheDocument();
  });

  it("valida que el monto sea obligatorio", async () => {
    await renderFormWithOptions();

    fireEvent.click(
      screen.getByRole("button", { name: /guardar transacción/i })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /el monto es obligatorio/i
    );
    expect(mockedCreateTransaction).not.toHaveBeenCalled();
  });

  it("valida que el monto sea mayor a cero", async () => {
    await renderFormWithOptions();

    fireEvent.change(screen.getByLabelText(/monto/i), {
      target: { value: "0" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /guardar transacción/i })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /el monto debe ser mayor a cero/i
    );
    expect(mockedCreateTransaction).not.toHaveBeenCalled();
  });

  it("valida que la fuente de dinero sea obligatoria", async () => {
    await renderFormWithOptions();

    fireEvent.change(screen.getByLabelText(/monto/i), {
      target: { value: "1500" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /guardar transacción/i })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /la fuente de dinero es obligatoria/i
    );
  });

  it("valida que la moneda sea obligatoria", async () => {
    await renderFormWithOptions();

    fireEvent.change(screen.getByLabelText(/monto/i), {
      target: { value: "1500" },
    });
    fireEvent.change(screen.getByLabelText(/fuente de dinero/i), {
      target: { value: "source-1" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /guardar transacción/i })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /la moneda es obligatoria/i
    );
  });

  it("valida que la categoría sea obligatoria", async () => {
    await renderFormWithOptions();

    fireEvent.change(screen.getByLabelText(/monto/i), {
      target: { value: "1500" },
    });
    fireEvent.change(screen.getByLabelText(/fuente de dinero/i), {
      target: { value: "source-1" },
    });
    fireEvent.change(screen.getByLabelText(/moneda/i), {
      target: { value: "ARS" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /guardar transacción/i })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /la categoría es obligatoria/i
    );
  });

  it("valida que la fecha sea obligatoria", async () => {
    await renderFormWithOptions();

    fireEvent.change(screen.getByLabelText(/monto/i), {
      target: { value: "1500" },
    });
    fireEvent.change(screen.getByLabelText(/fuente de dinero/i), {
      target: { value: "source-1" },
    });
    fireEvent.change(screen.getByLabelText(/moneda/i), {
      target: { value: "ARS" },
    });
    fireEvent.change(screen.getByLabelText(/categoría/i), {
      target: { value: "category-1" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /guardar transacción/i })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /la fecha es obligatoria/i
    );
  });

  it("valida que la descripción sea obligatoria", async () => {
    await renderFormWithOptions();

    fireEvent.change(screen.getByLabelText(/monto/i), {
      target: { value: "1500" },
    });
    fireEvent.change(screen.getByLabelText(/fuente de dinero/i), {
      target: { value: "source-1" },
    });
    fireEvent.change(screen.getByLabelText(/moneda/i), {
      target: { value: "ARS" },
    });
    fireEvent.change(screen.getByLabelText(/categoría/i), {
      target: { value: "category-1" },
    });
    fireEvent.change(screen.getByLabelText(/fecha/i), {
      target: { value: "2026-06-15" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /guardar transacción/i })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /la descripción es obligatoria/i
    );
  });

  it("envía la transacción con la fecha convertida a DD-MM-YYYY y limpia el formulario al guardar", async () => {
    await renderFormWithOptions();
    mockedCreateTransaction.mockResolvedValue({
      id: "tx-1",
      type: "expense",
      amount: 1500,
      moneySourceId: "source-1",
      currency: "ARS",
      categoryId: "category-1",
      date: "15-06-2026",
      description: "Supermercado",
    });

    fillValidForm();
    fireEvent.click(
      screen.getByRole("button", { name: /guardar transacción/i })
    );

    await waitFor(() =>
      expect(mockedCreateTransaction).toHaveBeenCalledWith("jwt-token", {
        type: "expense",
        amount: 1500,
        moneySourceId: "source-1",
        currency: "ARS",
        categoryId: "category-1",
        date: "15-06-2026",
        description: "Supermercado",
      })
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/monto/i)).toHaveValue(null);
      expect(screen.getByLabelText(/descripción/i)).toHaveValue("");
    });
  });

  it("llama a onCreated con la transacción creada", async () => {
    mockedListMoneySources.mockResolvedValue([
      { id: "source-1", name: "Lemon" },
    ]);
    mockedListCategories.mockResolvedValue([
      { id: "category-1", name: "comida" },
    ]);
    const created = {
      id: "tx-1",
      type: "expense",
      amount: 1500,
      moneySourceId: "source-1",
      currency: "ARS",
      categoryId: "category-1",
      date: "15-06-2026",
      description: "Supermercado",
    };
    mockedCreateTransaction.mockResolvedValue(created);
    const onCreated = jest.fn();

    render(<TransactionForm token="jwt-token" onCreated={onCreated} />);
    await screen.findByRole("option", { name: "Lemon" });

    fillValidForm();
    fireEvent.click(
      screen.getByRole("button", { name: /guardar transacción/i })
    );

    await waitFor(() => expect(onCreated).toHaveBeenCalledWith(created));
  });

  it("mantiene los datos ingresados y muestra el error del backend si falla el guardado", async () => {
    await renderFormWithOptions();
    mockedCreateTransaction.mockRejectedValue({
      isAxiosError: true,
      response: { data: { error: "No se pudo guardar la transacción" } },
    });

    fillValidForm();
    fireEvent.click(
      screen.getByRole("button", { name: /guardar transacción/i })
    );

    expect(
      await screen.findByText(/no se pudo guardar la transacción/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/monto/i)).toHaveValue(1500);
    expect(screen.getByLabelText(/descripción/i)).toHaveValue("Supermercado");
  });
});
