'use client';

import { ExternalLink, ShoppingBag, Store, TrendingUp, Users } from 'lucide-react';

type Shop =
  | {
      name?: string;
      displayName?: string;
    }
  | string;

type ShopGridProps = {
  shops: Shop[];
  selectedShop: string | null;
  onShopSelect: (shop: string) => void;
};

const ShopGrid = ({ shops, selectedShop, onShopSelect }: ShopGridProps) => {
  const getShopName = (shop: Shop): string => {
    return typeof shop === 'string' ? shop : shop.displayName || shop.name || '';
  };

  const handleShopClick = (shopName: string) => {
    onShopSelect(shopName);
    // Redirect to subdomain
    window.open(`http://${shopName}.localhost:5173`, '_blank');
  };

  const getShopStats = () => {
    // Mock stats for demonstration
    return {
      totalRevenue: '$12,345',
      totalOrders: '234',
      activeCustomers: '1,234',
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your Shops</h2>
            <p className="text-sm text-gray-600">Manage and access your shop dashboards</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {shops.length} shop{shops.length !== 1 ? 's' : ''} total
        </div>
      </div>

      {/* Shop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {shops.map((shop, index) => {
          const shopName = getShopName(shop);
          const stats = getShopStats();

          return (
            <div
              key={index}
              className={`group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105 ${
                selectedShop === shopName
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleShopClick(shopName)}
            >
              {/* Shop Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedShop === shopName
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 group-hover:bg-blue-600 group-hover:text-white'
                    } transition-all duration-300`}
                  >
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">{shopName}</h3>
                    <p className="text-sm text-gray-600">Active Shop</p>
                  </div>
                </div>
                <ExternalLink
                  className={`w-5 h-5 ${
                    selectedShop === shopName
                      ? 'text-blue-600'
                      : 'text-gray-400 group-hover:text-blue-600'
                  } transition-colors duration-300`}
                />
              </div>

              {/* Shop Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Revenue</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.totalRevenue}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Orders</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.totalOrders}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Customers</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.activeCustomers}</span>
                </div>
              </div>

              {/* Visit Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div
                  className={`w-full py-2 px-4 rounded-lg text-center text-sm font-medium transition-all duration-300 ${
                    selectedShop === shopName
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 group-hover:bg-blue-600 group-hover:text-white'
                  }`}
                >
                  Visit {shopName}.localhost:5173
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedShop === shopName && (
                <div className="absolute top-3 right-3 w-3 h-3 bg-blue-600 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {shops.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No shops yet</h3>
          <p className="text-gray-600">Create your first shop to get started</p>
        </div>
      )}
    </div>
  );
};

export default ShopGrid;
