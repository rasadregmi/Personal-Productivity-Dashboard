import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:4000/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    notes: 0,
    todos: { total: 0, completed: 0, pending: 0 },
    reminders: { total: 0, active: 0 },
    bookmarks: 0
  });
  const [quote, setQuote] = useState(null);
  const [health, setHealth] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchStats();
    fetchRandomQuote();
    fetchHealth();
    
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    const dataInterval = setInterval(() => {
      fetchStats();
      fetchHealth();
    }, 30000);
    
    return () => {
      clearInterval(timeInterval);
      clearInterval(dataInterval);
    };
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      const data = await response.json();
      console.log('Received stats:', data);
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRandomQuote = async () => {
    try {
      const response = await fetch(`http://localhost:4000/quotes/random`);
      const data = await response.json();
      setQuote(data);
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  const fetchHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      setHealth(data);
    } catch (error) {
      console.error('Error fetching health:', error);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, onClick, stats }) => {
    const displayValue = typeof value === 'object' ? JSON.stringify(value) : value;

    return (
      <div
        className="group relative bg-white rounded-xl border border-slate-200 p-6 cursor-pointer hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{title}</p>
              <p className="text-3xl font-bold text-slate-900 mb-1">{displayValue}</p>
              {subtitle && (
                <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
              )}
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">{icon}</span>
            </div>
          </div>
          
          {stats && stats.length > 0 && (
            <div className="space-y-2 mb-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">{stat.label}</span>
                  <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center text-blue-600 text-sm font-semibold group-hover:text-blue-700 transition-colors">
            <span>View Details</span>
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getProductivityScore = () => {
    const total = stats.todos?.total || 0;
    const completed = stats.todos?.completed || 0;
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-slate-200">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-teal-600/5"></div>
          <div className="relative p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white pulse-ring"></div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                      {getGreeting()}!
                    </h1>
                    <p className="text-lg text-slate-600 font-medium">Ready to boost your productivity?</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="font-medium">{formatDate(currentTime)}</span>
                  </div>
                  <div className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-mono font-bold">{formatTime(currentTime)}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center lg:text-right">
                <div className="relative inline-block">
                  <div className="text-5xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {getProductivityScore()}%
                  </div>
                  <div className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wide">Productivity Score</div>
                  <div className="relative w-40 h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 rounded-full transition-all duration-1000 shadow-sm"
                      style={{ width: `${getProductivityScore()}%` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Notes"
            value={stats.notes || 0}
            subtitle="Knowledge base entries"
            icon="�"
            onClick={() => navigate('/notes')}
          />
          <StatCard
            title="Tasks"
            value={stats.todos?.total || 0}
            subtitle="Total tasks created"
            icon="✅"
            onClick={() => navigate('/todos')}
            stats={[
              { label: 'Completed', value: stats.todos?.completed || 0, color: 'text-green-600' },
              { label: 'Pending', value: stats.todos?.pending || 0, color: 'text-amber-600' }
            ]}
          />
          <StatCard
            title="Reminders"
            value={stats.reminders?.total || 0}
            subtitle="Scheduled reminders"
            icon="🔔"
            onClick={() => navigate('/reminders')}
            stats={[
              { label: 'Active', value: stats.reminders?.active || 0, color: 'text-blue-600' }
            ]}
          />
          <StatCard
            title="Bookmarks"
            value={stats.bookmarks || 0}
            subtitle="Saved links"
            icon="�"
            onClick={() => navigate('/bookmarks')}
          />
        </div>

        {quote && (
          <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 opacity-60"></div>
            <div className="relative p-8">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Daily Inspiration
                    </h2>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    </div>
                  </div>
                  <blockquote className="text-xl text-slate-700 mb-6 italic leading-relaxed font-medium">
                    "{quote.text}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <cite className="text-slate-600 font-semibold text-lg">— {quote.author}</cite>
                    <button 
                      onClick={fetchRandomQuote}
                      className="group px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg font-semibold"
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        New Quote
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-slate-200">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 opacity-40"></div>
          <div className="relative p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                System Status
              </h2>
            </div>
            {health ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group text-center p-6 bg-white rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-bold text-green-700 text-lg mb-1">System Healthy</p>
                  <p className="text-sm text-green-600">All services operational</p>
                </div>
                <div className="group text-center p-6 bg-white rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-bold text-blue-700 text-lg mb-1">
                    {Math.floor(health.uptime / 60)}m Uptime
                  </p>
                  <p className="text-sm text-blue-600">Server running smooth</p>
                </div>
                <div className="group text-center p-6 bg-white rounded-xl border border-teal-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="font-bold text-teal-700 text-lg mb-1">Data Synced</p>
                  <p className="text-sm text-teal-600">Latest information</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-300 border-t-blue-600"></div>
                  <span className="text-slate-600 font-medium text-lg">Loading system status...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;