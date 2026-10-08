import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  Trash2,
  AlertCircle,
  Zap,
  Smartphone,
  Home,
  GraduationCap,
  Shield,
  CreditCard,
  Check,
} from 'lucide-react';
import { MoneyCategory, MoneyReminder } from '../types';

export const MoneyReminderView: React.FC = () => {
  const { moneyReminders, addMoneyReminder, toggleReminderPaid, deleteMoneyReminder, t } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'pending' | 'paid' | 'all'>('pending');

  // New reminder form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('2026-10-15');
  const [category, setCategory] = useState<MoneyCategory>('EMI');
  const [recurring, setRecurring] = useState<'none' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [notes, setNotes] = useState('');

  const pendingReminders = moneyReminders.filter((r) => !r.paid);
  const paidReminders = moneyReminders.filter((r) => r.paid);

  const totalPendingAmount = pendingReminders.reduce((sum, r) => sum + r.amount, 0);

  const filteredReminders =
    filter === 'pending'
      ? pendingReminders
      : filter === 'paid'
      ? paidReminders
      : moneyReminders;

  const categories: MoneyCategory[] = [
    'EMI',
    'Loan',
    'Rent',
    'Electricity',
    'Mobile',
    'Internet',
    'School Fees',
    'Insurance',
    'Gas',
    'Other',
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0) return;

    addMoneyReminder({
      title,
      amount: numAmount,
      dueDate,
      category,
      recurring,
      paid: false,
      notes,
    });

    setTitle('');
    setAmount('');
    setNotes('');
    setShowAddModal(false);
  };

  const getCategoryIcon = (cat: MoneyCategory) => {
    switch (cat) {
      case 'Electricity':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'Mobile':
      case 'Internet':
        return <Smartphone className="w-4 h-4 text-blue-500" />;
      case 'Rent':
        return <Home className="w-4 h-4 text-emerald-500" />;
      case 'School Fees':
        return <GraduationCap className="w-4 h-4 text-purple-500" />;
      case 'Insurance':
        return <Shield className="w-4 h-4 text-teal-500" />;
      default:
        return <CreditCard className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Disclaimer Notice */}
      <div className="p-3 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between text-xs text-slate-600 font-medium">
        <span>⚠️ এটি কোনো ব্যাংকিং অ্যাপ নয়; এটি ব্যক্তিগত খরচের স্মরণিকা।</span>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-tr from-amber-600 to-orange-500 rounded-3xl p-5 text-white shadow-lg shadow-amber-600/20 flex items-center justify-between">
        <div>
          <span className="text-xs text-amber-100 font-bold tracking-wide uppercase block">
            এই মাসের মোট বকেয়া তাগাদা
          </span>
          <h3 className="text-3xl font-black mt-0.5 tracking-tight">
            ₹{totalPendingAmount.toLocaleString('en-IN')}
          </h3>
          <p className="text-xs text-amber-100 mt-1 font-medium">
            {pendingReminders.length} টি পরিশোধ বাকি আছে
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-12 h-12 rounded-2xl bg-white text-amber-700 flex items-center justify-center font-bold shadow-md hover:bg-amber-50 active:scale-95 transition-transform"
          title="নতুন রিমাইন্ডার"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-slate-200/80 p-1 rounded-2xl flex gap-1">
        {[
          { id: 'pending', label: `বকেয়া (${pendingReminders.length})` },
          { id: 'paid', label: `পরিশোধিত (${paidReminders.length})` },
          { id: 'all', label: `সকল (${moneyReminders.length})` },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === f.id
                ? 'bg-white text-amber-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-2.5">
        {filteredReminders.length === 0 ? (
          <div className="py-10 bg-white rounded-3xl border border-slate-200 text-center p-6 space-y-1">
            <DollarSign className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-700">কোনো রিমাইন্ডার পাওয়া যায়নি</p>
          </div>
        ) : (
          filteredReminders.map((rem) => (
            <div
              key={rem.id}
              className={`p-4 rounded-3xl border transition-all flex items-center justify-between gap-3 ${
                rem.paid
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 hover:border-amber-300 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                  {getCategoryIcon(rem.category)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.2 rounded-full border border-amber-200">
                      {t.moneyTypes[rem.category] || rem.category}
                    </span>
                    {rem.recurring !== 'none' && (
                      <span className="text-[9px] text-slate-400 font-medium">
                        (প্রতিমাসে)
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                    {rem.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    তারিখ: <span className="font-semibold text-slate-700">{rem.dueDate}</span>
                    {rem.notes ? ` • ${rem.notes}` : ''}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-black text-slate-900">
                  ₹{rem.amount.toLocaleString('en-IN')}
                </div>
                <button
                  onClick={() => toggleReminderPaid(rem.id)}
                  className={`mt-1 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                    rem.paid
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs'
                  }`}
                >
                  {rem.paid ? 'পরিশোধিত ✓' : 'পরিশোধ দিন'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">টাকার রিমাইন্ডার যোগ করুন</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                বাতিল
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  শিরোনাম (যেমন: বাইকের ইএমআই) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: বিদ্যুৎ বিল / বাড়ি ভাড়া"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-amber-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    টাকার পরিমাণ (₹) *
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="2500"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-amber-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    পরিশোধের তারিখ *
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-amber-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  খরচের ধরন (Category)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {t.moneyTypes[c] || c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  নোট / বিবরণ (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="যেমন: কনজিউমার নম্বর বা একাউন্ট নম্বর"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-98 transition-transform"
              >
                রিমাইন্ডার সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
