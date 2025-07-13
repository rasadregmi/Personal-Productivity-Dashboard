import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchStartTime, setStopwatchStartTime] = useState(null);
  const [stopwatchElapsed, setStopwatchElapsed] = useState(0);
  const [sessionHistory, setSessionHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('stopwatchSessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [customTime, setCustomTime] = useState({ minutes: 25, seconds: 0 });
  const [mode, setMode] = useState('stopwatch'); 
  const [countdownTime, setCountdownTime] = useState(25 * 60); 
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const [presets] = useState([
    { name: 'Pomodoro', minutes: 25, emoji: '🍅' },
    { name: 'Short Break', minutes: 5, emoji: '☕' },
    { name: 'Long Break', minutes: 15, emoji: '🛋️' },
    { name: 'Focus Session', minutes: 45, emoji: '🎯' },
    { name: 'Meeting', minutes: 60, emoji: '👥' }
  ]);

  useEffect(() => {
    try {
      localStorage.setItem('stopwatchSessions', JSON.stringify(sessionHistory));
    } catch (error) {
      console.error('Failed to save session history:', error);
    }
  }, [sessionHistory]);

  useEffect(() => {
    let interval = null;
    
    if (mode === 'stopwatch' && stopwatchRunning && stopwatchStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - stopwatchStartTime) / 1000);
        setStopwatchElapsed(elapsed);
      }, 1000);
    } else if (isCountdownRunning && countdownTime > 0) {
      interval = setInterval(() => {
        setCountdownTime(prev => {
          if (prev <= 1) {
            setIsCountdownRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, stopwatchRunning, stopwatchStartTime, isCountdownRunning, countdownTime]);

  const startStopwatch = () => {
    const now = Date.now();
    setStopwatchStartTime(now);
    setStopwatchElapsed(0);
    setStopwatchRunning(true);
  };

  const stopStopwatch = () => {
    setStopwatchRunning(false);
    
    if (stopwatchElapsed > 1) {
      const session = {
        id: Date.now(),
        duration: stopwatchElapsed,
        startTime: new Date(stopwatchStartTime),
        endTime: new Date(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      };
      
      setSessionHistory(prev => [session, ...prev].slice(0, 10)); 
    }
  };

  const resetStopwatch = () => {
    setStopwatchRunning(false);
    setStopwatchStartTime(null);
    setStopwatchElapsed(0);
  };

  const clearSessionHistory = () => {
    setSessionHistory([]);
    try {
      localStorage.removeItem('stopwatchSessions');
    } catch (error) {
      console.error('Failed to clear session history:', error);
    }
  };

  const startCountdown = () => {
    if (countdownTime > 0) {
      setIsCountdownRunning(true);
    }
  };

  const stopCountdown = () => {
    setIsCountdownRunning(false);
  };

  const resetCountdown = () => {
    setIsCountdownRunning(false);
    setCountdownTime(customTime.minutes * 60 + customTime.seconds);
  };

  const setPresetTime = (minutes) => {
    setCustomTime({ minutes, seconds: 0 });
    setCountdownTime(minutes * 60);
    setIsCountdownRunning(false);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCircularProgress = (current, total) => {
    if (total === 0) return 0;
    return ((total - current) / total) * 100;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">⏱️ Timer</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setMode('stopwatch');
              setStopwatchRunning(false);
              setStopwatchStartTime(null);
              setStopwatchElapsed(0);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              mode === 'stopwatch' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            ⏱️ Stopwatch
          </button>
          <button
            onClick={() => setMode('countdown')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              mode === 'countdown' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            ⏰ Countdown
          </button>
        </div>
      </div>

      {mode === 'stopwatch' && (
        <div className="space-y-6">
          <div className="card text-center">
            <h2 className="text-xl font-semibold mb-6">Stopwatch</h2>
            <div className="text-6xl font-mono font-bold text-primary-600 mb-6">
              {formatTime(stopwatchElapsed)}
            </div>
            <div className="flex justify-center space-x-4">
              {!stopwatchRunning ? (
                <>
                  <button onClick={startStopwatch} className="btn-primary text-lg px-8 py-3">
                    ▶️ Start
                  </button>
                  <button onClick={resetStopwatch} className="btn-secondary text-lg px-8 py-3">
                    🔄 Reset
                  </button>
                </>
              ) : (
                <button onClick={stopStopwatch} className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-lg text-lg">
                  ⏹️ Stop
                </button>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Status: {stopwatchRunning ? '🟢 Running' : '🔴 Stopped'}
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">⏳ Session History</h3>
              {sessionHistory.length > 0 && (
                <button 
                  onClick={clearSessionHistory}
                  className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded"
                >
                  🗑️ Clear History
                </button>
              )}
            </div>
            <div className="space-y-2">
              {(stopwatchRunning || stopwatchElapsed > 0) && (
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                  <div>
                    <span className="font-medium">Current session</span>
                    {stopwatchRunning && <span className="ml-2 text-green-600 text-sm">● Running</span>}
                  </div>
                  <span className="font-mono text-lg">{formatTime(stopwatchElapsed)}</span>
                </div>
              )}
              
              {sessionHistory.length > 0 ? (
                <>
                  <div className="text-sm text-gray-600 mt-4 mb-2 font-medium">Previous Sessions:</div>
                  {sessionHistory.map((session, index) => (
                    <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div className="flex flex-col">
                        <span className="text-sm">Session {sessionHistory.length - index}</span>
                        <span className="text-xs text-gray-500">{session.date} at {session.time}</span>
                      </div>
                      <span className="font-mono">{formatTime(session.duration)}</span>
                    </div>
                  ))}
                  
                  <div className="mt-4 p-3 bg-green-50 rounded border-l-4 border-green-400">
                    <div className="text-sm font-medium text-green-800 mb-1">📊 Today's Stats</div>
                    <div className="text-xs text-green-700">
                      Total sessions: {sessionHistory.filter(s => s.date === new Date().toLocaleDateString()).length} | 
                      Total time: {formatTime(sessionHistory
                        .filter(s => s.date === new Date().toLocaleDateString())
                        .reduce((sum, s) => sum + s.duration, 0)
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500 p-3 text-center">
                  No previous sessions yet. Start and stop the timer to track your work sessions!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {mode === 'countdown' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Quick Presets</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setPresetTime(preset.minutes)}
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors"
                >
                  <div className="text-2xl mb-1">{preset.emoji}</div>
                  <div className="text-sm font-medium">{preset.name}</div>
                  <div className="text-xs text-gray-600">{preset.minutes}m</div>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Custom Timer</h3>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={customTime.minutes}
                  onChange={(e) => {
                    const minutes = parseInt(e.target.value) || 0;
                    setCustomTime(prev => ({ ...prev, minutes }));
                    if (!isCountdownRunning) {
                      setCountdownTime(minutes * 60 + customTime.seconds);
                    }
                  }}
                  className="w-20 text-center input-field"
                />
              </div>
              <div className="text-2xl">:</div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={customTime.seconds}
                  onChange={(e) => {
                    const seconds = parseInt(e.target.value) || 0;
                    setCustomTime(prev => ({ ...prev, seconds }));
                    if (!isCountdownRunning) {
                      setCountdownTime(customTime.minutes * 60 + seconds);
                    }
                  }}
                  className="w-20 text-center input-field"
                />
              </div>
            </div>
          </div>

          <div className="card text-center">
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - getCircularProgress(countdownTime, customTime.minutes * 60 + customTime.seconds) / 100)}`}
                  className="text-primary-600 transition-all duration-1000 ease-linear"
                  strokeLinecap="round"
                />
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-primary-600">
                    {formatTime(countdownTime)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {isCountdownRunning ? 'Running' : 'Stopped'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              {!isCountdownRunning ? (
                <button
                  onClick={startCountdown}
                  disabled={countdownTime === 0}
                  className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ▶️ Start
                </button>
              ) : (
                <button onClick={stopCountdown} className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-lg text-lg">
                  ⏸️ Pause
                </button>
              )}
              <button onClick={resetCountdown} className="btn-secondary text-lg px-8 py-3">
                🔄 Reset
              </button>
            </div>

            {countdownTime === 0 && (
              <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg">
                <div className="text-2xl mb-2">🎉</div>
                <div className="font-semibold text-green-800">Time's up!</div>
                <div className="text-sm text-green-700">Your timer has finished.</div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">💡 Productivity Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-800 mb-1">🍅 Pomodoro Technique</div>
                <div className="text-blue-700">Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break.</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-green-800 mb-1">🎯 Focus Sessions</div>
                <div className="text-green-700">Use longer 45-60 minute sessions for deep work that requires sustained concentration.</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="font-medium text-yellow-800 mb-1">⏰ Time Blocking</div>
                <div className="text-yellow-700">Allocate specific time blocks for different tasks to maintain structure and accountability.</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="font-medium text-purple-800 mb-1">🛋️ Break Reminders</div>
                <div className="text-purple-700">Regular breaks prevent burnout and help maintain focus throughout the day.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
