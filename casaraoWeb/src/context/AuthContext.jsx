import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("casarao_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function login(userData) {
    setUser(userData);
    localStorage.setItem("casarao_user", JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("casarao_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}