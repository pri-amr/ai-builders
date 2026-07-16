import axios from "axios";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function handleRequest<T = unknown>(
  method: HttpMethod,
  endpoint: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<T> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL no está definida en el entorno");
  }

  const response = await axios.request<T>({
    method,
    url: `${apiBaseUrl}${endpoint}`,
    data: body,
    headers,
  });

  return response.data;
}
