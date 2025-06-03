'use client';

import { ChevronDown, LogOut, Store } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DEV_FRONTEND_URL, FRONTEND_URL, isDevelopment } from '../../config/constants';
import { useAuth } from '../../providers/AuthProvider/AuthContext';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutConfirm(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email || 'No email provided'}</p>
                  <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block mt-1">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Shop Names */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Store size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Your Shops</span>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {user.shops.map((shop, index) => {
                  const shopName = typeof shop === 'string' ? shop : shop.name || shop.displayName;
                  const baseUrl = isDevelopment ? DEV_FRONTEND_URL : FRONTEND_URL;
                  const shopUrl = `https://${shopName}.${new URL(baseUrl).host}`;

                  return (
                    <button
                      key={index}
                      onClick={() => window.open(shopUrl, '_blank')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200 flex items-center justify-between group"
                    >
                      <span>{typeof shop === 'string' ? shop : shop.displayName || shop.name}</span>
                      <span className="text-xs text-gray-400 group-hover:text-blue-500">
                        Visit →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Menu Items */}
            {/* <div className="py-2">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
              >
                <User size={16} />
                Profile Settings
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
              >
                <Settings size={16} />
                Account Settings
              </button>
            </div> */}

            {/* Logout */}
            <div className="border-t border-gray-100 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors duration-200"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign Out</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to sign out of your account?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileDropdown;
