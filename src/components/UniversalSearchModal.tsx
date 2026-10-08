import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, Briefcase, CheckSquare, DollarSign, FileText, Users, ArrowRight } from 'lucide-react';

export const UniversalSearchModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    setActiveTab,
    jobs,
    tasks,
    moneyReminders,
    documents,
    familyMembers,
    t,
  } = useApp();

  const [query, setQuery] = useState('');

  const isOpen = activeModal === 'search';
  if (!isOpen) return null;

  const cleanQ = query.trim().toLowerCase();

  const matchingJobs = cleanQ
    ? jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(cleanQ) ||
          j.category.toLowerCase().includes(cleanQ) ||
          j.location.toLowerCase().includes(cleanQ) ||
          j.description.toLowerCase().includes(cleanQ)
      )
    : [];

  const matchingTasks = cleanQ
    ? tasks.filter((t) => t.title.toLowerCase().includes(cleanQ))
    : [];

  const matchingReminders = cleanQ
    ? moneyReminders.filter(
        (r) =>
          r.title.toLowerCase().includes(cleanQ) ||
          r.category.toLowerCase().includes(cleanQ)
      )
    : [];

  const matchingDocs = cleanQ
    ? documents.filter(
        (d) =>
          d.title.toLowerCase().includes(cleanQ) ||
          d.category.toLowerCase().includes(cleanQ) ||
          (d.docNumber && d.docNumber.toLowerCase().includes(cleanQ))
      )
    : [];

  const matchingFamily = cleanQ
    ? familyMembers.filter(
        (f) =>
          f.name.toLowerCase().includes(cleanQ) ||
          f.relation.toLowerCase().includes(cleanQ)
      )
    : [];

  const totalResults =
    matchingJobs.length +
    matchingTasks.length +
    matchingReminders.length +
    matchingDocs.length +
    matchingFamily.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] mt-10 border border-slate-100">
        {/* Search Input Bar */}
        <div className="p-3.5 bg-white border-b border-slate-200 flex items-center gap-2.5">
          <Search className="w-5 h-5 text-emerald-600 shrink-0 ml-1" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="flex-1 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none bg-transparent"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setActiveModal(null)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg"
          >
            বাতিল
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {!cleanQ && (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <Search className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
              <p className="text-xs font-medium">যেকোনো শব্দ লিখে সার্চ করুন</p>
              <p className="text-[11px] text-slate-400">
                যেমন: "ইলেকট্রিক", "EMI", "রেশন", "আধার", "ইন্টারভিউ"
              </p>
            </div>
          )}

          {cleanQ && totalResults === 0 && (
            <div className="py-8 text-center text-slate-500">
              <p className="text-xs font-medium">কোনো ফলাফল পাওয়া যায়নি "{query}" দিয়ে।</p>
            </div>
          )}

          {/* Jobs Results */}
          {matchingJobs.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" /> কাজের সন্ধান ({matchingJobs.length})
              </span>
              <div className="space-y-1.5">
                {matchingJobs.map((j) => (
                  <div
                    key={j.id}
                    onClick={() => {
                      setActiveModal(null);
                      setActiveTab('work');
                    }}
                    className="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-xl border border-slate-200 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{j.title}</h4>
                      <p className="text-[11px] text-slate-500">{j.location} • {j.payment}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Results */}
          {matchingTasks.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> কাজ / টাস্ক ({matchingTasks.length})
              </span>
              <div className="space-y-1.5">
                {matchingTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setActiveModal(null);
                      setActiveTab('tasks');
                    }}
                    className="p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{t.title}</h4>
                      <p className="text-[11px] text-slate-500">তারিখ: {t.dueDate} {t.dueTime || ''}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Money Reminders */}
          {matchingReminders.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-600" /> টাকার তাগাদা ({matchingReminders.length})
              </span>
              <div className="space-y-1.5">
                {matchingReminders.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setActiveModal(null);
                      setActiveTab('profile');
                    }}
                    className="p-3 bg-slate-50 hover:bg-amber-50/60 rounded-xl border border-slate-200 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{r.title}</h4>
                      <p className="text-[11px] text-amber-700 font-semibold">₹{r.amount} • শেষ তারিখ: {r.dueDate}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {matchingDocs.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-600" /> ডকুমেন্টস ({matchingDocs.length})
              </span>
              <div className="space-y-1.5">
                {matchingDocs.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      setActiveModal(null);
                      setActiveTab('profile');
                    }}
                    className="p-3 bg-slate-50 hover:bg-purple-50/60 rounded-xl border border-slate-200 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{d.title}</h4>
                      <p className="text-[11px] text-slate-500">{d.category} • {d.docNumber || ''}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Family */}
          {matchingFamily.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-pink-600" /> পরিবার ({matchingFamily.length})
              </span>
              <div className="space-y-1.5">
                {matchingFamily.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => {
                      setActiveModal(null);
                      setActiveTab('profile');
                    }}
                    className="p-3 bg-slate-50 hover:bg-pink-50/60 rounded-xl border border-slate-200 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{f.name}</h4>
                      <p className="text-[11px] text-slate-500">{f.relation} {f.phone ? `• ${f.phone}` : ''}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
