import { handleRequest } from "./handleRequest";

export type TransactionType = "income" | "expense";
export type Currency = "ARS" | "USD";

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  moneySourceId: string;
  currency: Currency;
  categoryId: string;
  date: string;
  description: string;
};

export type CreateTransactionInput = {
  type: TransactionType;
  amount: number;
  moneySourceId: string;
  currency: Currency;
  categoryId: string;
  date: string;
  description: string;
};

export function createTransaction(
  token: string,
  input: CreateTransactionInput
) {
  return handleRequest<Transaction>("POST", "/api/transactions", input, {
    Authorization: `Bearer ${token}`,
  });
}
