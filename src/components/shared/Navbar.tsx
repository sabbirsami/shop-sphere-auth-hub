'use client';

import { LogOut, Store } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider/AuthContext';
import Register from '../auth/Register';
import SignIn from '../auth/SignIn';
import Logo from '../icons/Logo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfile(false);
      setShowLogoutConfirm(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // const visitShop = (shop: { name: string; displayName: string }) => {
  //   window.open(`http://${shop.name}.localhost:5173`, '_blank');
  // };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-2">
          {/* Logo Section */}
          <div className="bg-white/15 backdrop-blur-sm p-3 rounded-lg">
            <Logo className="w-10 h-10" />
          </div>

          {/* Content Section */}
          <div className="bg-white/15 backdrop-blur-sm p-2 flex items-center gap-16 rounded-lg ps-6 text-white relative">
            <h2 className="text-lg whitespace-nowrap">Shop Sphere Auth Hub</h2>

            {user ? (
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-4 px-3 py-2 bg-[#756FB3]/50 rounded-lg text-white cursor-pointer hover:bg-[#756FB3]/70 transition-colors duration-200"
                  onClick={() => setShowProfile((prev) => !prev)}
                >
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.username}</span>
                </div>
                <NavLink
                  to={'/dashboard'}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Get Started
                </NavLink>
              </div>
            ) : (
              <button
                onClick={() => setIsSignInModalOpen(true)}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              >
                Get Started
              </button>
            )}

            {/* Profile dropdown */}
            {user && showProfile && (
              <div className="absolute right-0 top-14 w-80 bg-white rounded-xl shadow-lg border z-50 text-black">
                {/* User Info */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.email || 'No email provided'}</p>
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block mt-1">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shop Names */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Store size={16} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Your Shops</span>
                  </div>
                </div>

                {/* Logout */}
                <div className="p-4">
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 w-full p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

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

      {/* Modals */}
      <SignIn
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSwitchToRegister={() => {
          setIsSignInModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      <Register
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToSignIn={() => {
          setIsRegisterModalOpen(false);
          setIsSignInModalOpen(true);
        }}
      />
    </>
  );
};

export default Navbar;
