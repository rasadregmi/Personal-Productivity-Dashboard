import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-accent-500/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card p-12 max-w-sm mx-4 text-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 via-secondary-600 to-accent-600 rounded-3xl flex items-center justify-center shadow-2xl animate-float mx-auto">
            <span className="text-3xl text-white font-bold">P</span>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-success-400 rounded-full border-2 border-white animate-pulse"></div>
        </div>

        <h1 className="text-2xl font-bold text-brand mb-2">ProductiveHub</h1>
        <p className="text-neutral-600 font-medium mb-8">Loading your workspace...</p>

        <div className="loading-dots justify-center mb-6">
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className="w-full bg-neutral-200/50 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-full animate-shimmer bg-[length:200%_100%]"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;