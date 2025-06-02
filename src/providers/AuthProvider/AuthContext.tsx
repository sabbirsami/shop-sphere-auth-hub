import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type User = {
  _id: string;
  username: string;
  email: string;
  shops: Array<
    | {
        name: string;
        displayName: string;
      }
    | string
  >;
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
  refreshUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with true for initial auth check
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Helper function to make authenticated requests with automatic token refresh
  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('accessToken');

    const attemptRequest = async (authToken: string | null) => {
      const headers = {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...options.headers,
      };

      return fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });
    };

    let response = await attemptRequest(token);

    // If token expired, try to refresh
    if (response.status === 401 && token) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        response = await attemptRequest(refreshed);
      }
    }

    return response;
  };

  // Function to refresh access token
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        const newAccessToken = result.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        return newAccessToken;
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
    }

    // If refresh fails, clear everything
    localStorage.removeItem('accessToken');
    setUser(null);
    return null;
  };

  const refreshUserProfile = async () => {
    try {
      const response = await makeAuthenticatedRequest('http://localhost:5000/api/auth/profile');

      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user || data.data);
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (err) {
      console.error('Profile refresh failed:', err);
      // Don't clear user here as it might be a temporary network issue
    }
  };

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

      // If registration includes login, store the access token
      if (result.data.accessToken) {
        localStorage.setItem('accessToken', result.data.accessToken);
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

      // Store access token
      const token = result.data.accessToken;
      localStorage.setItem('accessToken', token);

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

      // Clear all tokens and user data
      setUser(null);
      localStorage.removeItem('accessToken');
    } catch (err) {
      console.log('Logout error:', err);
      // Still clear local data even if server request fails
      setUser(null);
      localStorage.removeItem('accessToken');
    } finally {
      setLoading(false);
    }
  };

  const verifySubdomainAccess = async (shopName: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const response = await makeAuthenticatedRequest(
        `http://localhost:5000/api/auth/shop/${shopName}`,
        {
          method: 'GET',
        },
      );

      if (response.ok) {
        return true;
      } else if (response.status === 403) {
        // User is authenticated but doesn't have access to this shop
        return false;
      } else if (response.status === 401) {
        // Authentication failed
        return false;
      } else {
        // Other server errors
        console.error('Subdomain verification failed with status:', response.status);
        return false;
      }
    } catch (err) {
      console.error('Subdomain verification error:', err);
      return false;
    }
  };

  // Enhanced auth check with better error handling
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await makeAuthenticatedRequest('http://localhost:5000/api/auth/profile');

        if (response.ok) {
          const data = await response.json();
          setUser(data.data.user || data.data);
        } else if (response.status === 401) {
          // Token is invalid, clear it
          localStorage.removeItem('accessToken');
        }
      } catch (err) {
        console.log('Auth check error:', err);
        // Don't remove token here as it might be a network issue
        // Let the user try to use the app and handle errors as they come
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Set up periodic token refresh for long-lived sessions
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await refreshAccessToken();
      }
    }, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => clearInterval(interval);
  }, [user]);

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
        refreshUserProfile,
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

// Hook for making authenticated requests throughout the app
export const useAuthenticatedRequest = () => {
  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('accessToken');

    const attemptRequest = async (authToken: string | null) => {
      const headers = {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...options.headers,
      };

      return fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });
    };

    let response = await attemptRequest(token);

    // If token expired, try to refresh
    if (response.status === 401 && token) {
      try {
        const refreshResponse = await fetch('http://localhost:5000/api/auth/refresh-token', {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          const result = await refreshResponse.json();
          const newAccessToken = result.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          response = await attemptRequest(newAccessToken);
        }
      } catch (err) {
        console.error('Token refresh failed:', err);
      }
    }

    return response;
  };

  return makeAuthenticatedRequest;
};
