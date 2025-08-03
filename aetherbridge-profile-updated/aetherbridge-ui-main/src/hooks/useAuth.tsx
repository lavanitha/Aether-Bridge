import { useEffect, useState, useContext, createContext, ReactNode } from "react";

interface User {
  uid: string;
  email: string;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    uid: 'dev-user-123',
    email: 'dev@example.com',
    displayName: 'Development User'
  });
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    // Mock login for development
    setUser({
      uid: 'dev-user-123',
      email: email,
      displayName: 'Development User'
    });
  };

  const signup = async (email: string, password: string) => {
    // Mock signup for development
    setUser({
      uid: 'dev-user-123',
      email: email,
      displayName: 'Development User'
    });
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
} 