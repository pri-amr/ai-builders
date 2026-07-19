import { handleRequest } from "./handleRequest";

export type MoneySource = {
  id: string;
  name: string;
};

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

export function listMoneySources(token: string) {
  return handleRequest<MoneySource[]>(
    "GET",
    "/api/money-sources",
    undefined,
    authHeaders(token)
  );
}

export function createMoneySource(token: string, name: string) {
  return handleRequest<MoneySource>(
    "POST",
    "/api/money-sources",
    { name },
    authHeaders(token)
  );
}
