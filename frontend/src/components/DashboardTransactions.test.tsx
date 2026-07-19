import { render, screen, act } from "@testing-library/react";
import { TransactionForm } from "@/components/TransactionForm";
import { DashboardTransactions } from "./DashboardTransactions";

jest.mock("@/components/TransactionForm", () => ({
  TransactionForm: jest.fn(() => null),
}));

const mockedTransactionForm = TransactionForm as jest.Mock;

describe("DashboardTransactions", () => {
  beforeEach(() => {
    mockedTransactionForm.mockClear();
  });

  it("no muestra confirmación antes de guardar ninguna transacción", () => {
    render(<DashboardTransactions token="jwt-token" />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("pasa el token al formulario", () => {
    render(<DashboardTransactions token="jwt-token" />);

    expect(mockedTransactionForm).toHaveBeenCalledWith(
      expect.objectContaining({ token: "jwt-token" }),
      undefined
    );
  });

  it("muestra la confirmación con los datos de la transacción cuando el formulario la crea", () => {
    render(<DashboardTransactions token="jwt-token" />);

    const { onCreated } = mockedTransactionForm.mock.calls[0][0];
    act(() => {
      onCreated({
        id: "tx-1",
        type: "expense",
        amount: 1500,
        moneySourceId: "source-1",
        currency: "ARS",
        categoryId: "category-1",
        date: "15-06-2026",
        description: "Supermercado",
      });
    });

    expect(screen.getByRole("status")).toHaveTextContent(
      /transacción guardada: supermercado \(1500 ars\)/i
    );
  });
});
