import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Search, AlertCircle, Globe, Sparkles } from 'lucide-react';
import { Language } from '../types';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t, currentUser, unreadNotificationsCount, setActiveModal } = useApp();
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Bengali / Indian formatted date
  const getFormattedDate = () => {
    const now = new Date('2026-10-08T16:30:00');
    if (language === 'bn') {
      const bengaliMonths = [
        'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
      ];
      const bengaliDays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
      const bengaliDigits = (num: number) => num.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);
      
      const dayName = bengaliDays[now.getDay()];
      const day = bengaliDigits(now.getDate());
      const month = bengaliMonths[now.getMonth()];
      const year = bengaliDigits(now.getFullYear());
      return `${dayName}, ${day} ${month} ${year}`;
    } else if (language === 'hi') {
      return now.toLocaleDateString('hi-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    }
    return now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const languagesList: { code: Language; label: string; native: string }[] = [
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'en', label: 'English', native: 'English' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 shadow-xs transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Brand & Greeting snippet */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 font-bold text-lg">
            <span>সা</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-slate-900 text-base leading-tight tracking-tight flex items-center gap-1">
                {t.appName}
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 inline" />
              </h1>
              {currentUser.isPremium && (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                  PRO
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[170px]">
              {getFormattedDate()}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Universal Search Button */}
          <button
            onClick={() => setActiveModal('search')}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
            title="Search"
            aria-label="Universal Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="px-2 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full flex items-center gap-1 active:scale-95 transition-all"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'bn' ? 'বাংলা' : language === 'hi' ? 'हिंदी' : 'EN'}</span>
            </button>

            {showLangMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLangMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {languagesList.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                        language === l.code
                          ? 'bg-emerald-50 text-emerald-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{l.native}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{l.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notification Bell */}
          <button
            onClick={() => setActiveModal('notifications')}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Quick SOS Trigger Button */}
          <button
            onClick={() => setActiveModal('sos')}
            className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-full transition-all active:scale-95"
            title="Emergency SOS"
            aria-label="Emergency SOS"
          >
            <AlertCircle className="w-5 h-5 fill-red-500 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
};
