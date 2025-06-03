const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1s' }}
          ></div>
        </div>
        <div className="mt-6 space-y-2">
          <p className="text-lg font-semibold text-gray-900">Verifying shop access...</p>
          <p className="text-sm text-gray-600">Please wait while we authenticate your request</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
