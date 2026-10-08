import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Globe, CheckCircle2, ArrowRight, ShieldCheck, UserCheck, Bot } from 'lucide-react';
import { Language, UserRole } from '../types';

export const OnboardingModal: React.FC = () => {
  const { onboardingCompleted, completeOnboarding, language, setLanguage, t } = useApp();
  const [step, setStep] = useState<number>(1);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(['Find work', 'Manage money reminders']);
  const [userName, setUserName] = useState('রমেন সরকার');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('worker');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  if (onboardingCompleted) return null;

  const needsList = [
    { id: 'Find work', labelBn: 'কাজের সন্ধান (Find Work)', labelEn: 'Find Work', icon: '💼' },
    { id: 'Manage money reminders', labelBn: 'টাকার তাগাদা ও EMI (Money Reminders)', labelEn: 'Money Reminders', icon: '💰' },
    { id: 'Manage documents', labelBn: 'কাগজপত্র ও ডকুমেন্টস (Documents)', labelEn: 'Document Vault', icon: '📄' },
    { id: 'Manage family', labelBn: 'পরিবারের দায়িত্ব (Family Responsibilities)', labelEn: 'Family Management', icon: '👨‍👩‍👧' },
    { id: 'Daily tasks', labelBn: 'দৈনিক কাজ ও রুটিন (Daily Tasks)', labelEn: 'Daily Tasks', icon: '📅' },
    { id: 'AI assistant', labelBn: 'জীবনসাথী AI সহকারী (AI Assistant)', labelEn: 'AI Life Assistant', icon: '🤖' },
  ];

  const toggleNeed = (id: string) => {
    if (selectedNeeds.includes(id)) {
      setSelectedNeeds(selectedNeeds.filter((n) => n !== id));
    } else {
      setSelectedNeeds([...selectedNeeds, id]);
    }
  };

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('সঠিক ১০ ডিজিটের মোবাইল নম্বর দিন');
      return;
    }
    setOtpSent(true);
    setOtpCode('1234'); // Instant convenient simulation for Indian users
  };

  const handleFinish = (asGuest = false) => {
    completeOnboarding(
      userName.trim() || 'প্রিয় বন্ধু',
      userRole,
      asGuest ? undefined : phoneNumber ? `+91 ${phoneNumber}` : '+91 98310 99881'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-emerald-100">
        {/* Step Progress Bar */}
        <div className="h-1.5 bg-slate-100 flex">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 transition-all duration-300 ${
                s <= step ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Screen 1: Welcome */}
        {step === 1 && (
          <div className="p-6 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
              <span className="text-3xl font-black">সা</span>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ভারত ও পশ্চিমবঙ্গবাসীর জন্য বিশেষ নির্মিত
              </span>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                আপনার জীবন। আপনার কাজ।<br />
                <span className="text-emerald-700">একটি বুদ্ধিমান সহকারী।</span>
              </h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                কাজ খোঁজা, টাকার রিমাইন্ডার, জরুরি ডকুমেন্টস এবং দৈনন্দিন জীবনের সব কিছু সহজে পরিচালনা করুন মুখে বলে বা এক ট্যাপে।
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 active:scale-98 transition-all"
              >
                <span>শুরু করুন (Get Started)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Screen 2: Language Selector */}
        {step === 2 && (
          <div className="p-6 space-y-6">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center mb-2">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">আপনার ভাষা বেছে নিন</h3>
              <p className="text-xs text-slate-500">Choose your preferred language</p>
            </div>

            <div className="space-y-2.5">
              {[
                { code: 'bn' as Language, title: 'বাংলা (Bengali)', desc: 'সহজ ও প্রাঞ্জল বাংলা ভাষা' },
                { code: 'hi' as Language, title: 'हिंदी (Hindi)', desc: 'सरल और स्पष्ट हिंदी भाषा' },
                { code: 'en' as Language, title: 'English', desc: 'Simple & clear English' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    language === lang.code
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{lang.title}</h4>
                    <p className="text-xs text-slate-500">{lang.desc}</p>
                  </div>
                  {language === lang.code && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold text-xs"
              >
                পিছনে
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-2 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20"
              >
                <span>পরের ধাপ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Screen 3: "What do you want help with?" */}
        {step === 3 && (
          <div className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                আপনি কী কী কাজে সাহায্য চান?
              </h3>
              <p className="text-xs text-slate-500">
                What do you want help with? (একাধিক বাছতে পারেন)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {needsList.map((need) => {
                const selected = selectedNeeds.includes(need.id);
                return (
                  <button
                    key={need.id}
                    onClick={() => toggleNeed(need.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                      selected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-2xl">{need.icon}</span>
                    <span className="text-xs leading-snug">
                      {language === 'bn' ? need.labelBn : need.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold text-xs"
              >
                পিছনে
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-2 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20"
              >
                <span>পরের ধাপ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Screen 4: Login / Profile / Guest */}
        {step === 4 && (
          <div className="p-6 space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-slate-900">আপনার তথ্য ও প্রোফাইল</h3>
              <p className="text-xs text-slate-500">
                লগইন করুন অথবা সরাসরি অতিথি হিসেবে চালিয়ে যান
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  আপনার নাম (Your Name)
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="যেমন: রমেন সরকার"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  আপনি মূলত কী হিসেবে ব্যবহার করবেন?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUserRole('worker')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                      userRole === 'worker'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    👷 আমি কর্মী (Worker)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRole('employer')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                      userRole === 'employer'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    💼 আমি মালিক (Employer)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  মোবাইল নম্বর (ঐচ্ছিক)
                </label>
                <div className="flex gap-2">
                  <div className="px-3 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="98310 99881"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 focus:outline-none"
                    maxLength={10}
                  />
                  {!otpSent && phoneNumber.length >= 10 && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                    >
                      OTP পাঠান
                    </button>
                  )}
                </div>
              </div>

              {otpSent && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 animate-in fade-in">
                  <span className="text-[11px] font-semibold text-emerald-800">
                    ওটিপি কোড (OTP Code): 1234 দেওয়া হয়েছে
                  </span>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-emerald-300 text-sm font-bold tracking-widest text-center"
                    maxLength={4}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleFinish(false)}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 active:scale-98"
              >
                <span>অ্যাকাউন্ট নিশ্চিত করে শুরু করুন</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleFinish(true)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-semibold text-xs transition-colors"
              >
                লগইন ছাড়া অতিথি হিসেবে চালিয়ে যান (Continue as Guest)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
