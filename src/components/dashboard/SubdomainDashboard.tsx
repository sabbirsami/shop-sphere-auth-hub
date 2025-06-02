/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider/AuthContext';
import { getMainDomain, getSubdomain } from '../../utils/subdomain';
import LoadingSpinner from '../shared/LoadingSpinner';

const SubdomainDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shopData, setShopData] = useState<any>(null);
  const { user, verifySubdomainAccess, loading: authLoading } = useAuth();
  const subdomain = getSubdomain();

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        if (!subdomain) {
          setError('Invalid subdomain');
          setLoading(false);
          return;
        }

        // Wait for auth to complete loading
        if (authLoading) {
          return; // Still loading, wait for next render
        }

        // Check if user is authenticated after auth loading is complete
        if (!user) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        // Verify user has access to this subdomain
        const hasAccess = await verifySubdomainAccess(subdomain);
        if (!hasAccess) {
          setError('You do not have access to this shop');
          setLoading(false);
          return;
        }

        // Fetch shop-specific data using authenticated request
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:5000/api/shop/${subdomain}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: 'include',
        });

        if (!response.ok) {
          setError('Failed to load shop data');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setShopData(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    verifyAccess();
  }, [subdomain, user, verifySubdomainAccess, authLoading]); // Added authLoading dependency

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => (window.location.href = `http://${getMainDomain()}/dashboard`)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            {shopData?.displayName || subdomain} Dashboard
          </h1>
          <button
            onClick={() => (window.location.href = `http://${getMainDomain()}/dashboard`)}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Main Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900">
              Welcome to {shopData?.displayName || subdomain} shop!
            </h2>
            <p className="mt-2 text-gray-600">
              This is your dedicated shop dashboard. Manage your shop operations here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubdomainDashboard;
