import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, errorMessage } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("lg_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("lg_token");
    if (!token) {
      setReady(true);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem("lg_user", JSON.stringify(res.data.user));
      })
      .catch(() => {
        localStorage.removeItem("lg_token");
        localStorage.removeItem("lg_user");
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("lg_token", res.data.token);
      localStorage.setItem("lg_user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      return { ok: true, user: res.data.user };
    } catch (err) {
      return { ok: false, error: errorMessage(err, "Invalid email or password") };
    }
  }, []);

  const register = useCallback(async (payload) => {
    try {
      const res = await api.post("/auth/register", payload);
      localStorage.setItem("lg_token", res.data.token);
      localStorage.setItem("lg_user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      return { ok: true, user: res.data.user };
    } catch (err) {
      return { ok: false, error: errorMessage(err, "Could not create account") };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("lg_token");
    localStorage.removeItem("lg_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
