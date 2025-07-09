import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const getCurrentModule = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'dashboard';
    return path.substring(1); 
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.querySelector('.main-content')?.scrollTop || 0;
      setShowScrollTop(scrollTop > 300);
    };

    const mainContent = document.querySelector('.main-content');
    mainContent?.addEventListener('scroll', handleScroll);

    return () => {
      mainContent?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const mainContent = document.querySelector('.main-content');
    mainContent?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex h-screen bg-slate-50 relative overflow-hidden">
      <Sidebar activeModule={getCurrentModule()} />
      
      <main className="flex-1 overflow-hidden relative">
        <div className="main-content h-full overflow-auto custom-scrollbar bg-white relative">
          <div className="min-h-full p-6">
            <div className="max-w-7xl mx-auto animate-fade-in">
              {children}
            </div>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 flex items-center space-x-3 z-10">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-slate-200 flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-slate-700">Online</span>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-slate-200">
            <div className="text-xs font-semibold text-slate-700 tabular-nums">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>
        
        {showScrollTop && (
          <button 
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            aria-label="Scroll to top"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </main>
    </div>
  );
};

export default Layout;