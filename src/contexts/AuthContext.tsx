import * as SecureStore from "expo-secure-store";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { loginRequest } from "../services/authService";
import { configureApiSession } from "../services/api";
import type { User } from "../types/models";
import { isTokenExpired } from "../utils/post";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  loadError: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  retrySessionLoad: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_KEY = "edublog.jwt";
const USER_KEY = "edublog.user";

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    configureApiSession(
      () => SecureStore.getItemAsync(TOKEN_KEY),
      logout,
    );
  }, [logout]);

  useEffect(() => {
    let active = true;
    async function restoreSession() {
      setIsLoading(true);
      setLoadError("");
      try {
        const [token, storedUser] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(USER_KEY),
        ]);
        if (!active) return;
        if (!token || !storedUser || isTokenExpired(token)) {
          await logout();
          return;
        }
        setUser(JSON.parse(storedUser) as User);
      } catch {
        if (active) {
          setLoadError(
            "Não foi possível restaurar a sessão segura. Tente novamente.",
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void restoreSession();
    return () => {
      active = false;
    };
  }, [loadAttempt, logout]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginRequest(email, password);
    await SecureStore.setItemAsync(TOKEN_KEY, result.token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(result.user));
    setUser(result.user);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      loadError,
      login,
      logout,
      retrySessionLoad: () => setLoadAttempt((attempt) => attempt + 1),
    }),
    [user, isLoading, loadError, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
