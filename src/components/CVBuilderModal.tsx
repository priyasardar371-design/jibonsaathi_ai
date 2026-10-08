import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, X, Printer, Sparkles, Check, Download, Briefcase, Award } from 'lucide-react';
import { CVData } from '../types';

export const CVBuilderModal: React.FC = () => {
  const { activeModal, setActiveModal, cvData, updateCvData, language } = useApp();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('preview');
  const [isPolishing, setIsPolishing] = useState(false);

  const isOpen = activeModal === 'cv';
  if (!isOpen) return null;

  const templates: Array<{ id: CVData['template']; label: string }> = [
    { id: 'painter', label: 'রংমিস্ত্রি (Painter)' },
    { id: 'driver', label: 'গাড়িচালক (Driver)' },
    { id: 'warehouse', label: 'গুদাম কর্মী (Warehouse)' },
    { id: 'construction', label: 'নির্মাণ শ্রমিক (Construction)' },
    { id: 'cleaner', label: 'পরিচ্ছন্নতাকর্মী (Cleaner)' },
    { id: 'office', label: 'অফিস সহকারী (Office)' },
    { id: 'general', label: 'সাধারণ কর্মী (General)' },
  ];

  const handleAiPolish = async () => {
    setIsPolishing(true);
    try {
      const res = await fetch('/api/gemini/polish-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerData: cvData,
          language,
        }),
      });
      const data = await res.json();
      if (data.professionalSummary) {
        updateCvData({
          professionalSummary: data.professionalSummary,
          bulletHighlights: data.bulletHighlights || cvData.bulletHighlights,
        });
        setActiveTab('preview');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPolishing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] border border-slate-100">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base">প্রফেশনাল সিভি মেকার (CV Builder)</h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit / Preview Tabs */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex gap-2 no-print">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'preview' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            সিভি প্রিভিউ (Preview)
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'edit' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            তথ্য সংশোধন (Edit Details)
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          {activeTab === 'edit' ? (
            <div className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">আপনার পূর্ণ নাম *</label>
                <input
                  type="text"
                  value={cvData.name}
                  onChange={(e) => updateCvData({ name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">পেশা / কাজ *</label>
                  <input
                    type="text"
                    value={cvData.profession}
                    onChange={(e) => updateCvData({ profession: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">ফোন নম্বর *</label>
                  <input
                    type="text"
                    value={cvData.phone}
                    onChange={(e) => updateCvData({ phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">ঠিকানা / এলাকা</label>
                  <input
                    type="text"
                    value={cvData.location}
                    onChange={(e) => updateCvData({ location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">শিক্ষাগত যোগ্যতা</label>
                  <input
                    type="text"
                    value={cvData.education}
                    onChange={(e) => updateCvData({ education: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">কাজের অভিজ্ঞতা</label>
                <textarea
                  value={cvData.experience}
                  onChange={(e) => updateCvData({ experience: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">সিভি টেমপ্লেট</label>
                <select
                  value={cvData.template}
                  onChange={(e) => updateCvData({ template: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAiPolish}
                disabled={isPolishing}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isPolishing ? 'AI প্রস্তুত করছে...' : 'AI দিয়ে বায়োডাটা আকর্ষণীয় করুন'}</span>
              </button>
            </div>
          ) : (
            /* CV Printable Preview Card */
            <div id="cv-print-area" className="bg-white border-2 border-slate-300 rounded-2xl p-6 shadow-sm space-y-4 text-slate-900">
              {/* CV Header */}
              <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-black tracking-tight">{cvData.name}</h1>
                  <p className="text-sm font-bold text-blue-700 mt-0.5">{cvData.profession}</p>
                </div>
                <div className="text-right text-[11px] font-medium text-slate-600">
                  <p>{cvData.phone}</p>
                  <p>{cvData.location}</p>
                </div>
              </div>

              {/* Summary */}
              {cvData.professionalSummary && (
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-1.5">
                    কর্মজীবন সারসংক্ষেপ (Professional Summary)
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {cvData.professionalSummary}
                  </p>
                </div>
              )}

              {/* Key Skills */}
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-1.5">
                  দক্ষতা ও পারদর্শিতা (Key Skills)
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {cvData.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bullet Highlights */}
              {cvData.bulletHighlights && cvData.bulletHighlights.length > 0 && (
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-1.5">
                    কাজের বিশেষ বৈশিষ্ট্য (Key Strengths)
                  </h2>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                    {cvData.bulletHighlights.map((hl, i) => (
                      <li key={i}>{hl}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Experience & Education */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-1">
                    অভিজ্ঞতা (Experience)
                  </h2>
                  <p className="text-xs text-slate-700">{cvData.experience}</p>
                </div>

                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-1">
                    যোগ্যতা ও ভাষা
                  </h2>
                  <p className="text-xs text-slate-700">শিক্ষা: {cvData.education}</p>
                  <p className="text-xs text-slate-700 mt-0.5">ভাষা: {cvData.languages.join(', ')}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions (hidden in print) */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2 no-print">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-transform"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট / PDF ডাউনলোড (Print or Save PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
