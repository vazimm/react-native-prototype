import api from "./api";
import type { LoginResponse } from "../types/models";

export async function loginRequest(email: string, password: string) {
  const response = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
  return response.data.data;
}
