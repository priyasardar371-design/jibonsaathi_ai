import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PenTool, X, Copy, Check, Share2, Sparkles, Send } from 'lucide-react';

export const AIMessageWriterModal: React.FC = () => {
  const { activeModal, setActiveModal, language } = useApp();
  const [prompt, setPrompt] = useState('আমার চাকরি দরকার, একজন স্যারকে মেসেজ পাঠাব।');
  const [style, setStyle] = useState<'polite' | 'professional' | 'simple' | 'short'>('polite');
  const [options, setOptions] = useState<Array<{ label: string; message: string; tone: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const isOpen = activeModal === 'writer';
  if (!isOpen) return null;

  const quickExamples = [
    'আমার চাকরি দরকার, একজন স্যারকে মেসেজ পাঠাব।',
    'কাল কাজে আসতে পারব না, শারীরিক অসুস্থতার কারণে ছুটি চাই।',
    'গত সপ্তাহের কাজের বকেয়া টাকা দেওয়ার জন্য বিনীত অনুরোধ।',
    'নতুন রঙের কাজের সুযোগ আছে কি না জানার জন্য দরখাস্ত।',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/draft-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style,
          language,
          recipientRole: 'Employer / Contractor / Sir',
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.options)) {
        setOptions(data.options);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleShareWhatsApp = (text: string) => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-700 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base">AI মেসেজ রাইটার (Message Drafter)</h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              আপনি কী ধরনের বার্তা পাঠাতে চান?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="যেমন: আমার চাকরি দরকার, একজন স্যারকে মেসেজ পাঠাব..."
              rows={3}
              className="w-full p-3 rounded-2xl border border-slate-300 text-xs focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {/* Quick Click Suggestions */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 block mb-1">
              নমুনা উদাহরণে চাপ দিন:
            </span>
            <div className="flex flex-col gap-1">
              {quickExamples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(ex)}
                  className="text-left p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-[11px] text-slate-600 transition-colors"
                >
                  "{ex}"
                </button>
              ))}
            </div>
          </div>

          {/* Style Selector */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              মেসেজের ধরণ (Style)
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'polite' as const, label: 'নম্র (Polite)' },
                { id: 'professional' as const, label: 'পেশাদার' },
                { id: 'simple' as const, label: 'সহজ (Simple)' },
                { id: 'short' as const, label: 'সংক্ষিপ্ত' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`py-2 px-1 rounded-xl text-center text-[11px] font-bold transition-all ${
                    style === s.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 active:scale-98 transition-all"
          >
            {isLoading ? (
              <span>তৈরি করা হচ্ছে...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>মেসেজ তৈরি করুন (Generate Messages)</span>
              </>
            )}
          </button>

          {/* Generated Message Options */}
          {options.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-800">প্রস্তুত মেসেজের বিকল্প:</h4>
              {options.map((opt, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-900">{opt.label}</span>
                    <span className="text-slate-500 font-medium">{opt.tone}</span>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap bg-white p-3 rounded-xl border border-emerald-100">
                    {opt.message}
                  </p>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleCopy(opt.message, idx)}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-[11px] font-semibold flex items-center gap-1"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>কপি</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleShareWhatsApp(opt.message)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>হোয়াটসঅ্যাপে পাঠান</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
