import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const api = axios.create({ baseURL: API_BASE_URL });

let tokenProvider: (() => Promise<string | null>) | undefined;
let unauthorizedHandler: (() => Promise<void> | void) | undefined;

export function configureApiSession(
  getToken: () => Promise<string | null>,
  onUnauthorized: () => Promise<void> | void,
) {
  tokenProvider = getToken;
  unauthorizedHandler = onUnauthorized;
}

api.interceptors.request.use(async (config) => {
  const token = await tokenProvider?.();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      await unauthorizedHandler?.();
    }
    return Promise.reject(error);
  },
);

export default api;
