import { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Sun, Moon, Wifi, WifiOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { checkBackendHealth } from '../services/api';

export function Header() {
  const { toggleTheme, isDark } = useTheme();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    let isMounted = true;

    async function checkStatus() {
      const health = await checkBackendHealth();
      if (!isMounted) return;

      if (health && health.backend === 'healthy') {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    }

    checkStatus();

    // Re-check every 30 seconds
    const interval = setInterval(checkStatus, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="border-b border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs z-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <Activity id="header-logo-icon" className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 id="header-title" className="text-xl font-bold font-sans tracking-tight text-slate-900 dark:text-neutral-50">
                ECG Analyzer <span className="text-blue-600 dark:text-blue-400">Pro</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50">
                AI Screening
              </span>
            </div>
            <p id="header-subtitle" className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 font-medium">
              AI-powered heart abnormality detection from ECG images
            </p>
          </div>
        </div>

        {/* Status Badges & Controls */}
        <div className="flex items-center gap-3">
          {/* Status Indicators */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Live Backend Status */}
            {backendStatus === 'online' ? (
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/40">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Backend Online</span>
              </div>
            ) : backendStatus === 'checking' ? (
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-900/40">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Connecting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-full border border-amber-100 dark:border-amber-900/40">
                <WifiOff className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Demo Mode</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-900/40">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">94% Accuracy</span>
            </div>
          </div>

          {/* Dark Mode Switcher */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800 text-slate-500 dark:text-neutral-400 transition-colors cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
}

