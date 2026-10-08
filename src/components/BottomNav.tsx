import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Briefcase, Bot, CheckSquare, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t, tasks } = useApp();

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  const tabs = [
    {
      id: 'home' as const,
      label: t.home,
      icon: Home,
    },
    {
      id: 'work' as const,
      label: t.findWork,
      icon: Briefcase,
    },
    {
      id: 'ai' as const,
      label: t.askAI,
      icon: Bot,
      isCenter: true,
    },
    {
      id: 'tasks' as const,
      label: t.myTasks,
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
    },
    {
      id: 'profile' as const,
      label: t.profile,
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="max-w-md mx-auto px-2 flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative -top-3.5 flex flex-col items-center group focus:outline-none"
                aria-label={tab.label}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
                    isActive
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white ring-4 ring-emerald-100 shadow-emerald-500/30'
                      : 'bg-gradient-to-tr from-emerald-700 to-emerald-600 text-white shadow-emerald-700/25 group-hover:scale-105'
                  }`}
                >
                  <Bot className="w-7 h-7 animate-pulse" />
                </div>
                <span
                  className={`text-[11px] font-bold mt-0.5 tracking-tight ${
                    isActive ? 'text-emerald-700' : 'text-slate-600'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors relative active:scale-95 ${
                isActive ? 'text-emerald-700 font-semibold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'stroke-[2.5px] scale-110' : 'stroke-[1.8px]'
                  }`}
                />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-emerald-600 text-white text-[9px] font-bold px-1 py-0.2 rounded-full min-w-[14px] text-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight truncate max-w-[64px]">
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
