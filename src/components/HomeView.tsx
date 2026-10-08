import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  Users,
  AlertTriangle,
  Bell,
  Mic,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle,
  ChevronRight,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    currentUser,
    t,
    setActiveTab,
    setActiveModal,
    tasks,
    moneyReminders,
    toggleTask,
    toggleReminderPaid,
    unreadNotificationsCount,
  } = useApp();

  // Determine greeting based on current time (simulated or real)
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.greetingMorning;
    if (hour < 17) return t.greetingAfternoon;
    return t.greetingEvening;
  };

  // Important reminders due soon / today
  const pendingReminders = moneyReminders.filter((r) => !r.paid).slice(0, 3);
  const pendingTasks = tasks.filter((t) => !t.completed).slice(0, 3);

  // 8 Dashboard tiles required by specification
  const dashboardButtons = [
    {
      id: 'ai',
      label: t.askAI,
      sub: 'মুখে বা লিখে প্রশ্ন করুন',
      icon: Bot,
      color: 'from-emerald-600 to-teal-700',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      action: () => setActiveTab('ai'),
    },
    {
      id: 'work',
      label: t.findWork,
      sub: 'রংমিস্ত্রি, ড্রাইভার, রাজমিস্ত্রি',
      icon: Briefcase,
      color: 'from-blue-600 to-indigo-700',
      badgeColor: 'bg-blue-100 text-blue-800',
      action: () => setActiveTab('work'),
    },
    {
      id: 'tasks',
      label: t.myTasks,
      sub: 'দৈনিক করণীয় তালিকা',
      icon: Calendar,
      color: 'from-cyan-600 to-blue-600',
      badgeColor: 'bg-cyan-100 text-cyan-800',
      action: () => setActiveTab('tasks'),
    },
    {
      id: 'money',
      label: t.moneyReminders,
      sub: 'ইএমআই, ভাড়া ও বিদ্যুৎ বিল',
      icon: DollarSign,
      color: 'from-amber-600 to-orange-600',
      badgeColor: 'bg-amber-100 text-amber-800',
      action: () => {
        setActiveTab('profile');
      },
    },
    {
      id: 'documents',
      label: t.myDocuments,
      sub: 'আধার, প্যান, ড্রাইভিং লাইসেন্স',
      icon: FileText,
      color: 'from-purple-600 to-violet-700',
      badgeColor: 'bg-purple-100 text-purple-800',
      action: () => {
        setActiveTab('profile');
      },
    },
    {
      id: 'family',
      label: t.family,
      sub: 'সদস্য ও জরুরি যোগাযোগ',
      icon: Users,
      color: 'from-pink-600 to-rose-600',
      badgeColor: 'bg-pink-100 text-pink-800',
      action: () => {
        setActiveTab('profile');
      },
    },
    {
      id: 'emergency',
      label: t.emergency,
      sub: '১১২ পুলিশ, অ্যাম্বুলেন্স, দমকল',
      icon: AlertTriangle,
      color: 'from-red-600 to-rose-700',
      badgeColor: 'bg-red-100 text-red-800',
      action: () => setActiveModal('sos'),
    },
    {
      id: 'notifications',
      label: t.notifications,
      sub: 'বকেয়া বিল ও কাজের খবর',
      icon: Bell,
      color: 'from-slate-700 to-slate-800',
      badgeColor: 'bg-slate-200 text-slate-800',
      badgeCount: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
      action: () => setActiveModal('notifications'),
    },
  ];

  return (
    <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-4">
      {/* Top Greeting Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-5 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute right-4 top-4 text-emerald-300/20 pointer-events-none">
          <Sparkles className="w-16 h-16" />
        </div>

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>জীবনসাথী সক্রিয়</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {getGreeting()}, {currentUser.name}!
          </h2>
          <p className="text-xs text-emerald-100/90 leading-relaxed max-w-[280px]">
            আজ আপনার ৩টি কাজ ও ১টি টাকার তাগাদা বাকি আছে।
          </p>
        </div>

        {/* Quick Voice Assistant Banner Trigger */}
        <button
          onClick={() => setActiveModal('voice')}
          className="mt-4 w-full bg-white/15 hover:bg-white/20 active:scale-98 backdrop-blur-md border border-white/25 rounded-2xl p-2.5 flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold shadow-xs">
              <Mic className="w-4 h-4 animate-bounce" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold block leading-tight text-white">
                {t.voiceAssistantPrompt}
              </span>
              <span className="text-[10px] text-emerald-200">
                ট্যাপ করে বাংলায় কথা বলুন
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-200" />
        </button>
      </div>

      {/* Today's Important Reminders Banner */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{t.todayReminders}</h3>
          </div>
          <button
            onClick={() => setActiveModal('add_reminder')}
            className="text-xs font-bold text-emerald-700 flex items-center gap-1 hover:underline"
          >
            <PlusCircle className="w-3.5 h-3.5" /> যোগ করুন
          </button>
        </div>

        {pendingReminders.length === 0 && pendingTasks.length === 0 ? (
          <p className="text-xs text-slate-500 py-2 text-center">
            {t.noRemindersToday}
          </p>
        ) : (
          <div className="space-y-2">
            {/* Money Reminders */}
            {pendingReminders.map((rem) => (
              <div
                key={rem.id}
                className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                    ₹
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{rem.title}</h4>
                    <p className="text-[11px] text-amber-800 font-medium">
                      ₹{rem.amount.toLocaleString('en-IN')} • শেষ তারিখ: {rem.dueDate}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleReminderPaid(rem.id)}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-xl text-[11px] font-bold shrink-0 transition-colors"
                >
                  পরিশোধ
                </button>
              </div>
            ))}

            {/* Tasks */}
            {pendingTasks.map((tsk) => (
              <div
                key={tsk.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() => toggleTask(tsk.id)}
                    className="w-5 h-5 rounded-md border-2 border-slate-400 hover:border-emerald-600 flex items-center justify-center shrink-0"
                  >
                    {tsk.completed && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                  </button>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-slate-900 truncate">{tsk.title}</h4>
                    <p className="text-[10px] text-slate-500">
                      তারিখ: {tsk.dueDate} {tsk.dueTime ? `(${tsk.dueTime})` : ''}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 shrink-0">
                  {tsk.priority === 'high' ? 'জরুরি' : 'সাধারণ'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 8 Main Dashboard Buttons */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h3 className="font-bold text-slate-900 text-sm">প্রধান সেবাসমূহ (Services)</h3>
          <span className="text-[11px] text-slate-400 font-medium">এক ট্যাপে পরিচালনা</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {dashboardButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={btn.action}
                className="p-4 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all text-left flex flex-col justify-between h-32 group active:scale-98 relative overflow-hidden"
              >
                <div className="flex items-start justify-between w-full">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${btn.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {btn.badgeCount && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {btn.badgeCount}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors flex items-center justify-between">
                    <span>{btn.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {btn.sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
          {t.scamWarning}
        </p>
      </div>
    </div>
  );
};
