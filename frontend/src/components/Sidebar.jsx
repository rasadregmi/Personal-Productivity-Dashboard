import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { id: 'dashboard', name: 'Dashboard', icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z', path: '/dashboard' },
  { id: 'notes', name: 'Notes', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', path: '/notes' },
  { id: 'todos', name: 'Tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', path: '/todos' },
  { id: 'reminders', name: 'Reminders', icon: 'M15 17h5l-5 5v-5zM12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', path: '/reminders' },
  { id: 'bookmarks', name: 'Bookmarks', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z', path: '/bookmarks' },
  { id: 'texttools', name: 'Text Tools', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', path: '/texttools' },
  { id: 'quotes', name: 'Quotes', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', path: '/quotes' },
  { id: 'timer', name: 'Timer', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', path: '/timer' },
];

const Sidebar = ({ activeModule }) => {
  const location = useLocation();

  const isActive = (itemId, itemPath) => {
    if (activeModule === itemId) return true;
    if (location.pathname === itemPath) return true;
    if (location.pathname === '/' && itemId === 'dashboard') return true;
    return false;
  };

  return (
    <div className="w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-teal-900/20"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
      
      <div className="relative p-8 border-b border-slate-700/50">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              ProductiveHub
            </h1>
            <p className="text-sm text-slate-400 font-medium">Enterprise Platform</p>
          </div>
        </div>
      </div>

      <nav className="relative flex-1 overflow-y-auto p-6 space-y-2 scrollbar-thin scrollbar-thumb-slate-600/50 scrollbar-track-transparent">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 px-3 flex items-center">
          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
          Workspace
        </div>
        {menuItems.map((item) => {
          const isItemActive = isActive(item.id, item.path);
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`group relative flex items-center px-4 py-4 rounded-xl cursor-pointer transition-all duration-300 ${
                isItemActive 
                  ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 text-white shadow-lg backdrop-blur-sm border border-blue-400/30' 
                  : 'text-slate-300 hover:bg-white/10 hover:text-white backdrop-blur-sm border border-transparent hover:border-white/20'
              }`}
            >
              {isItemActive && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full shadow-lg"></div>
              )}
              
              <div className={`w-6 h-6 mr-4 transition-all duration-300 ${isItemActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </div>
              
              <span className="font-semibold flex-1">{item.name}</span>
              
              {!isItemActive && (
                <div className="w-2 h-2 bg-slate-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
              
              {isItemActive && (
                <div className="w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-pulse shadow-lg shadow-blue-400/50"></div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="relative p-6 border-t border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
            <div>
              <div className="text-xs font-bold text-green-400 uppercase tracking-wide">Online</div>
              <div className="text-xs text-slate-400">v2.1.0</div>
            </div>
          </div>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-1 h-1 bg-teal-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;