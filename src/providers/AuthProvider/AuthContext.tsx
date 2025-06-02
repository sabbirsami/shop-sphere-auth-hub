import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type User = {
  _id: string;
  username: string;
  email: string;
  shops: string[];
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  userRegister: (data: {
    username: string;
    password: string;
    shops: string[];
  }) => Promise<{ success: boolean; user?: User }>;
  userLogin: (data: {
    username: string;
    password: string;
    rememberMe: boolean;
  }) => Promise<{ success: boolean; user?: User }>;
  logout: () => Promise<void>;
  verifySubdomainAccess: (shopName: string) => Promise<boolean>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const userRegister = async (data: { username: string; password: string; shops: string[] }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      setUser(result.data.user);
      return { success: true, user: result.data.user };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const userLogin = async (data: { username: string; password: string; rememberMe: boolean }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      setUser(result.data.user);
      return { success: true, user: result.data.user };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (err) {
      console.log({ err });
      setError('Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  const verifySubdomainAccess = async (shopName: string) => {
    if (!user) return false;

    try {
      const response = await fetch(`http://${shopName}.localhost:5173/api/auth/verify`, {
        credentials: 'include',
      });
      return response.ok;
    } catch (err) {
      console.log({ err });
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.data.user);
        }
      } catch (err) {
        console.log({ label: 'Auth check error', error: err });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        userRegister,
        userLogin,
        logout,
        verifySubdomainAccess,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
