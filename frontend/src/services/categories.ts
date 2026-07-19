import { handleRequest } from "./handleRequest";

export type Category = {
  id: string;
  name: string;
};

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

export function listCategories(token: string) {
  return handleRequest<Category[]>(
    "GET",
    "/api/categories",
    undefined,
    authHeaders(token)
  );
}

export function createCategory(token: string, name: string) {
  return handleRequest<Category>(
    "POST",
    "/api/categories",
    { name },
    authHeaders(token)
  );
}
