'use client';

import { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider/AuthContext';
import ProfileDropdown from '../dashboard/ProfileDropdown';
import ShopGrid from '../dashboard/ShopGrid';

const DashboardLayout = () => {
  const { user } = useAuth();
  const [selectedShop, setSelectedShop] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {user.shops.length} Shop{user.shops.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Welcome back, <span className="font-medium text-gray-900">{user.username}</span>
              </div>
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:col-span-8">
          <ShopGrid shops={user.shops} selectedShop={selectedShop} onShopSelect={setSelectedShop} />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
