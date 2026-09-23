import React, { useEffect, useState } from 'react';
import { ActiveTab } from '../types/client';
import { 
  Server, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Terminal, 
  AlertTriangle, 
  BookOpen, 
  RotateCcw,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onResetData }) => {
  const [serverHealthy, setServerHealthy] = useState<boolean | null>(null);
  const [pingMs, setPingMs] = useState<number | null>(null);

  const checkHealth = async () => {
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setServerHealthy(true);
        setPingMs(Math.round(performance.now() - start));
      } else {
        setServerHealthy(false);
      }
    } catch {
      setServerHealthy(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'rest', label: 'REST Explorer', icon: <Layers className="w-4 h-4" />, badge: 'Module 1' },
    { id: 'overfetching', label: 'Over-Fetching Lab', icon: <Zap className="w-4 h-4 text-amber-500" />, badge: 'Module 3' },
    { id: 'idempotency', label: 'Idempotency & Orders', icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />, badge: 'Order Safety' },
    { id: 'graphql', label: 'GraphQL Playground', icon: <Terminal className="w-4 h-4 text-pink-500" />, badge: 'GraphQL' },
    { id: 'errors', label: 'Error Schema Matrix', icon: <AlertTriangle className="w-4 h-4 text-sky-500" />, badge: 'Module 2' },
    { id: 'docs', label: 'Architecture Docs', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Server className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">
                  E-Commerce API Modernization
                </h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Daraz & Bazaar Analogy
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                RESTful Pillars • GraphQL Field Selection • Idempotency Resilience
              </p>
            </div>
          </div>

          {/* Right controls: Health Pill & Reset */}
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono"
              title="Real-time Express API health status"
            >
              <span className={`w-2 h-2 rounded-full ${serverHealthy ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-slate-700 font-semibold">
                {serverHealthy ? 'Node/Express UP' : 'Connecting...'}
              </span>
              {pingMs !== null && (
                <span className="text-slate-400 text-[11px] border-l border-slate-200 pl-2">
                  {pingMs}ms
                </span>
              )}
            </div>

            <button
              onClick={onResetData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
              title="Reset catalog and idempotency store back to baseline"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Reset State</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto no-scrollbar border-t border-slate-100 pt-1 pb-1">
          {navItems.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive
                        ? 'bg-slate-800 text-indigo-300'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
