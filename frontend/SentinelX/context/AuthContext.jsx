import { createContext, useContext, useEffect, useState } from "react";
import { seedUsers } from "../src/data/users";

const AuthContext = createContext(null);

const SESSION_KEY = "sentinelx.user";
const USERS_KEY = "sentinelx.users";

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
      return seedUsers;
    }
    return JSON.parse(raw);
  } catch {
    return seedUsers;
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Restore session + seed users on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    loadUsers();
    setReady(true);
  }, []);

  const persist = (u) => {
    setUser(u);
    if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    else localStorage.removeItem(SESSION_KEY);
  };

  const login = ({ email, password }) => {
    const users = loadUsers();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );
    if (!found) return { ok: false, error: "Invalid email or password." };
    if (found.status !== "Active")
      return { ok: false, error: "This account is not active." };

    const session = { ...found };
    delete session.password;
    persist(session);
    return { ok: true, user: session };
  };

  const register = ({ name, email, password, role, location }) => {
    const users = loadUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }

    const initials = name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const newUser = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      name,
      email,
      password,
      role,
      status: "Active",
      initials,
      location: location || "—",
      joinedAt: new Date().toISOString().slice(0, 10),
    };

    saveUsers([...users, newUser]);

    const session = { ...newUser };
    delete session.password;
    persist(session);
    return { ok: true, user: session };
  };

  const logout = () => persist(null);

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