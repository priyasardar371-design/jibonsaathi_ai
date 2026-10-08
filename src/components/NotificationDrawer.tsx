import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, X, Check, Trash2, Calendar, DollarSign, Briefcase, FileText, Users, CheckCircle2 } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    t,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const isOpen = activeModal === 'notifications';
  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'সব নোটিফিকেশন' },
    { id: 'bill', label: 'বিল ও EMI' },
    { id: 'job', label: 'কাজের ডাক' },
    { id: 'interview', label: 'ইন্টারভিউ' },
    { id: 'task', label: 'টাস্ক' },
  ];

  const filteredNotifications =
    activeCategory === 'all'
      ? notifications
      : notifications.filter((n) => n.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bill':
      case 'emi':
        return <DollarSign className="w-4 h-4 text-amber-600" />;
      case 'job':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'interview':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'document':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'family':
        return <Users className="w-4 h-4 text-pink-600" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] mt-10 border border-slate-100">
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-base text-slate-900">বিজ্ঞপ্তি ও স্মরণিকা</h3>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-[11px] font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" /> মুছুন
              </button>
            )}
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="px-4 py-2 border-b border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === c.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-2.5">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-1">
              <Bell className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-medium">কোনো নতুন বিজ্ঞপ্তি নেই</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  notif.read
                    ? 'bg-white border-slate-200 opacity-80'
                    : 'bg-emerald-50/50 border-emerald-200 shadow-xs'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                  {getCategoryIcon(notif.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
