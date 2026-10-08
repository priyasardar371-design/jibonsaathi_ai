import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  FileText,
  Users,
  DollarSign,
  PenTool,
  Award,
  Globe,
  Shield,
  Download,
  Trash2,
  ChevronRight,
  Sparkles,
  Phone,
  MapPin,
  Lock,
  Moon,
  Sun,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { DocumentVaultView } from './DocumentVaultView';
import { FamilyView } from './FamilyView';
import { MoneyReminderView } from './MoneyReminderView';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateCurrentUser,
    language,
    setLanguage,
    theme,
    toggleTheme,
    exportAllData,
    clearAllData,
    setActiveModal,
    t,
  } = useApp();

  const [activeSection, setActiveSection] = useState<'menu' | 'documents' | 'family' | 'money' | 'privacy'>('menu');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editLocation, setEditLocation] = useState(currentUser.location);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name: editName,
      phone: editPhone,
      location: editLocation,
    });
    setShowEditProfile(false);
  };

  if (activeSection === 'documents') {
    return (
      <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-4">
        <button
          onClick={() => setActiveSection('menu')}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
        >
          ← প্রোফাইলে ফিরুন
        </button>
        <DocumentVaultView />
      </div>
    );
  }

  if (activeSection === 'family') {
    return (
      <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-4">
        <button
          onClick={() => setActiveSection('menu')}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
        >
          ← প্রোফাইলে ফিরুন
        </button>
        <FamilyView />
      </div>
    );
  }

  if (activeSection === 'money') {
    return (
      <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-4">
        <button
          onClick={() => setActiveSection('menu')}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
        >
          ← প্রোফাইলে ফিরুন
        </button>
        <MoneyReminderView />
      </div>
    );
  }

  return (
    <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-4">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            {currentUser.name[0] || 'উ'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-base text-slate-900 truncate">
                {currentUser.name}
              </h2>
              {currentUser.role === 'worker' ? (
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.2 rounded-full">
                  কর্মী
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full">
                  মালিক
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>{currentUser.phone}</span>
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{currentUser.location}</span>
            </p>
          </div>
          <button
            onClick={() => setShowEditProfile(!showEditProfile)}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200"
          >
            সংশোধন
          </button>
        </div>

        {/* Edit Form Dropdown */}
        {showEditProfile && (
          <form onSubmit={handleSaveProfile} className="pt-2 border-t border-slate-100 space-y-2.5">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block">নাম</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block">ফোন</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block">এলাকা</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border text-xs"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold"
            >
              পরিবর্তন নিশ্চিত করুন
            </button>
          </form>
        )}
      </div>

      {/* Freemium Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-4 text-white shadow-md flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>জীবনসাথী প্রিমিয়াম (₹৪৯ / মাস)</span>
          </div>
          <p className="text-[11px] text-amber-100">
            সীমাহীন ডকুমেন্টস, অগ্রিম AI সহকারী ও কর্মীর ভেরিফাইড ব্যাজ
          </p>
        </div>
        <button
          onClick={() => {
            updateCurrentUser({ isPremium: true });
            alert('অভিনন্দন! জীবনসাথী প্রিমিয়াম ফিচার সক্রিয় হয়েছে।');
          }}
          className="px-3 py-1.5 bg-white text-amber-900 rounded-xl text-xs font-black shadow-xs shrink-0 active:scale-95"
        >
          {currentUser.isPremium ? 'সক্রিয় আছে ✓' : 'আপগ্রেড করুন'}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {/* Document Vault */}
        <button
          onClick={() => setActiveSection('documents')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t.myDocuments}</h4>
              <p className="text-[11px] text-slate-500">আধার, প্যান, ড্রাইভিং লাইসেন্স</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Money Reminders */}
        <button
          onClick={() => setActiveSection('money')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t.moneyReminders}</h4>
              <p className="text-[11px] text-slate-500">ইএমআই, বাড়িভাড়া ও মাসিক বিল</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Family Circle */}
        <button
          onClick={() => setActiveSection('family')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t.family}</h4>
              <p className="text-[11px] text-slate-500">সদস্য ও জরুরি যোগাযোগ</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* CV Builder */}
        <button
          onClick={() => setActiveModal('cv')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t.cvBuilderTitle}</h4>
              <p className="text-[11px] text-slate-500">কাজের সুন্দর বায়োডাটা তৈরি ও প্রিন্ট</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* AI Message Writer */}
        <button
          onClick={() => setActiveModal('writer')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t.messageWriterTitle}</h4>
              <p className="text-[11px] text-slate-500">মালিক বা স্যারের কাছে দরখাস্ত ও মেসেজ</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Settings & Privacy Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 space-y-3">
        <h4 className="text-xs font-bold text-slate-700">সেটিংস ও নিরাপত্তা (Security & Backup)</h4>

        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <span className="text-xs text-slate-700 font-medium">অ্যাপের ভাষা</span>
          <div className="flex gap-1">
            {(['bn', 'hi', 'en'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  language === l ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {l === 'bn' ? 'বাংলা' : l === 'hi' ? 'हिंदी' : 'EN'}
              </button>
            ))}
          </div>
        </div>

        {/* Export Data */}
        <button
          onClick={exportAllData}
          className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <Download className="w-4 h-4 text-slate-500" />
            <span>সকল তথ্যের ব্যাকআপ ডাউনলোড (Export Data)</span>
          </span>
          <span className="text-[10px] text-slate-400">JSON</span>
        </button>

        {/* Clear Data */}
        <button
          onClick={() => {
            if (confirm('আপনি কি নিশ্চিত যে আপনার সমস্ত ডেটা মুছে ফেলতে চান? এটি পুনরায় ফিরিয়ে আনা সম্ভব নয়।')) {
              clearAllData();
            }
          }}
          className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>অ্যাকাউন্ট ও সমস্ত তথ্য মুছে ফেলুন (Delete Account)</span>
        </button>
      </div>

      {/* Help & Helpline */}
      <div className="p-3 bg-slate-100 rounded-2xl text-center space-y-1">
        <p className="text-[11px] text-slate-500">
          জীবনসাথী AI সংস্করণ ১.০.০ • ভারতীয় কর্মী ও পরিবারের জন্য নিবেদিত
        </p>
        <p className="text-[10px] text-slate-400">
          সাহায্য বা অভিযোগের জন্য যোগাযোগ: support@jibonsaathi.in
        </p>
      </div>
    </div>
  );
};
