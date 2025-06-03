/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider/AuthContext';
import { getSubdomain, isSubdomain } from '../../utils/subdomain';

interface SubdomainAuthState {
  isLoading: boolean;
  isAuthorized: boolean;
  shopName: string | null;
  shopData: any;
  error: string | null;
}

export const useSubdomainAuth = () => {
  const { user } = useAuth();
  const [state, setState] = useState<SubdomainAuthState>({
    isLoading: true,
    isAuthorized: false,
    shopName: null,
    shopData: null,
    error: null,
  });

  useEffect(() => {
    const verifySubdomainAccess = async () => {
      if (!isSubdomain()) {
        setState((prev) => ({ ...prev, isLoading: false, isAuthorized: false }));
        return;
      }

      const shopName = getSubdomain();
      if (!shopName) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isAuthorized: false,
          error: 'Invalid subdomain',
        }));
        return;
      }

      setState((prev) => ({ ...prev, shopName }));

      // Wait for user to be loaded
      if (!user) {
        // Give it some time for auth context to load
        setTimeout(() => {
          if (!user) {
            setState((prev) => ({
              ...prev,
              isLoading: false,
              isAuthorized: false,
              error: 'Authentication required',
            }));
          }
        }, 2000);
        return;
      }

      try {
        // Check if user owns this shop
        const userShops = user.shops.map((shop) => (typeof shop === 'string' ? shop : shop.name));

        if (!userShops.includes(shopName)) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isAuthorized: false,
            error: 'Access denied: Shop not found in your account',
          }));
          return;
        }

        // Verify with backend
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isAuthorized: false,
            error: 'Authentication token missing',
          }));
          return;
        }

        const response = await fetch(
          `https://shop-sphere-auth-hub-backend.vercel.app/api/auth/shop/${shopName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );

        if (!response.ok) {
          throw new Error('Shop verification failed');
        }

        const result = await response.json();

        setState((prev) => ({
          ...prev,
          isLoading: false,
          isAuthorized: true,
          shopData: result.data,
          error: null,
        }));
      } catch (error) {
        console.error('Subdomain auth error:', error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isAuthorized: false,
          error: 'Failed to verify shop access',
        }));
      }
    };

    verifySubdomainAccess();
  }, [user]);

  return state;
};
