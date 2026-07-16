import { handleRequest } from "./handleRequest";

export type RegisterResponse = {
  id: string;
  email: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
  };
};

export function registerUser(email: string, password: string) {
  return handleRequest<RegisterResponse>("POST", "/api/auth/register", {
    email,
    password,
  });
}

export function loginUser(email: string, password: string) {
  return handleRequest<LoginResponse>("POST", "/api/auth/login", {
    email,
    password,
  });
}
