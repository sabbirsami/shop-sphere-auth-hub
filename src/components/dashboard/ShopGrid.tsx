'use client';

import { ExternalLink, ShoppingBag, Store, TrendingUp, Users } from 'lucide-react';
import { FRONTEND_URL, isDevelopment } from '../../config/constants';

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

    if (isDevelopment) {
      window.open(`http://${shopName}.localhost:5173`, '_blank');
    } else {
      window.open(`https://${shopName}.shop-sphere-auth-hub.vercel.app`, '_blank');
    }
  };

  const getShopStats = () => {
    return {
      totalRevenue: '$12,345',
      totalOrders: '234',
      activeCustomers: '1,234',
    };
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40">
            <Store className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white mb-1">Your Shops</h2>
            <p className="text-slate-300 text-lg">Manage and access your shop dashboards</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-6 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-xl border border-blue-400/50 text-white shadow-xl">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            {shops.length} Active Shop{shops.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Shop Grid */}
      <div className="space-y-6">
        {shops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {shops.map((shop, index) => {
              const shopName = getShopName(shop);
              const stats = getShopStats();
              const isSelected = selectedShop === shopName;

              return (
                <div
                  key={index}
                  className={`group relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-2 rounded-2xl transition-all duration-500 cursor-pointer hover:scale-105 transform hover:shadow-2xl ${
                    isSelected
                      ? 'border-blue-400/80 shadow-2xl shadow-blue-500/30 bg-gradient-to-br from-slate-800/95 to-slate-700/95'
                      : 'border-white/30 hover:border-blue-400/60 hover:shadow-blue-500/25'
                  }`}
                  onClick={() => handleShopClick(shopName)}
                >
                  {/* Enhanced Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <div className="absolute top-4 right-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl opacity-60" />
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl opacity-60" />

                  {/* Card Header */}
                  <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
                            isSelected
                              ? 'bg-gradient-to-br from-blue-500 to-purple-600 scale-110 shadow-blue-500/50'
                              : 'bg-gradient-to-br from-slate-700 to-slate-600 group-hover:scale-110 group-hover:from-blue-500 group-hover:to-purple-600 group-hover:shadow-blue-500/50'
                          }`}
                        >
                          <Store
                            className={`w-7 h-7 transition-colors duration-300 ${
                              isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="font-black text-xl capitalize text-white mb-1">
                            {shopName}
                          </h3>
                          <p className="text-sm text-slate-400 font-medium">Active Shop</p>
                        </div>
                      </div>
                      <ExternalLink
                        className={`w-5 h-5 transition-all duration-300 ${
                          isSelected
                            ? 'text-blue-400'
                            : 'text-slate-500 group-hover:text-blue-400 group-hover:scale-110'
                        }`}
                      />
                    </div>

                    {/* Stats Cards */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-xl rounded-xl border border-emerald-400/40 shadow-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm font-bold text-white">Revenue</span>
                        </div>
                        <span className="font-black text-white text-lg drop-shadow-sm">
                          {stats.totalRevenue}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl border border-blue-400/40 shadow-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <ShoppingBag className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm font-bold text-white">Orders</span>
                        </div>
                        <span className="font-black text-white text-lg drop-shadow-sm">
                          {stats.totalOrders}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl border border-purple-400/40 shadow-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm font-bold text-white">Customers</span>
                        </div>
                        <span className="font-black text-white text-lg drop-shadow-sm">
                          {stats.activeCustomers}
                        </span>
                      </div>
                    </div>

                    {/* Visit Button */}
                    <div
                      className={`w-full py-4 px-4 rounded-xl text-center text-sm font-bold transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl shadow-blue-500/30'
                          : 'bg-gradient-to-r from-slate-700/80 to-slate-600/80 backdrop-blur-xl border border-white/20 text-white group-hover:from-blue-600 group-hover:to-purple-600 group-hover:shadow-2xl group-hover:shadow-blue-500/30'
                      }`}
                    >
                      Visit {shopName}.
                      {isDevelopment ? 'localhost:5173' : new URL(FRONTEND_URL).host}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-6 right-6 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-xl flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-2 border-white/30 rounded-2xl shadow-2xl">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-slate-500/30">
              <Store className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-white mb-3">No shops yet</h3>
            <p className="text-slate-400 mb-8 text-lg">Create your first shop to get started</p>
            <button className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-105 transform">
              <span className="relative z-10">Create Shop</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopGrid;
