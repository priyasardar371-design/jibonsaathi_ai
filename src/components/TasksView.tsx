import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  Plus,
  Calendar,
  Clock,
  Trash2,
  CheckCircle2,
  Circle,
  AlertCircle,
  Briefcase,
  Heart,
  DollarSign,
  User,
  Sparkles,
} from 'lucide-react';
import { Task } from '../types';

export const TasksView: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask, t, setActiveModal } = useApp();

  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('2026-10-09');
  const [dueTime, setDueTime] = useState('09:00');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState<'work' | 'personal' | 'family' | 'finance' | 'health'>('work');

  const todayStr = '2026-10-08';

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'today') return !task.completed && task.dueDate === todayStr;
    if (filter === 'upcoming') return !task.completed && task.dueDate > todayStr;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      dueDate,
      dueTime,
      priority,
      category,
      completed: false,
    });

    setTitle('');
    setShowAddForm(false);
  };

  const getCategoryIcon = (cat: Task['category']) => {
    switch (cat) {
      case 'work':
        return <Briefcase className="w-3.5 h-3.5 text-blue-600" />;
      case 'health':
        return <Heart className="w-3.5 h-3.5 text-rose-600" />;
      case 'finance':
        return <DollarSign className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>আমার কাজ (My Tasks)</span>
            <span className="text-[10px] font-bold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full">
              {tasks.filter((t) => !t.completed).length} টি বাকি
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            দৈনিক কাজের তালিকা ও সময়ের নোটিশ
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" /> নতুন কাজ
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-200/80 p-1 rounded-2xl flex gap-1">
        {[
          { id: 'all', label: 'সকল কাজ' },
          { id: 'today', label: 'আজকের কাজ' },
          { id: 'upcoming', label: 'আসন্ন' },
          { id: 'completed', label: 'সম্পন্ন' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === f.id
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Inline Add Task Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateTask}
          className="bg-white rounded-3xl p-4 border border-emerald-200 shadow-md space-y-3 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-emerald-900">নতুন কাজের বিবরণ দিন</h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              বাতিল
            </button>
          </div>

          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="কাজের শিরোনাম (যেমন: কাল সকাল ৯টায় ইন্টারভিউ)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-emerald-600 focus:outline-none"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">তারিখ</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-emerald-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">সময়</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">গুরুত্ব</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              >
                <option value="high">জরুরি (High)</option>
                <option value="medium">সাধারণ (Normal)</option>
                <option value="low">কম গুরুত্ব (Low)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">বিভাগ</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              >
                <option value="work">কাজের ক্ষেত্র (Work)</option>
                <option value="family">পরিবার (Family)</option>
                <option value="health">স্বাস্থ্য/ওষুধ (Health)</option>
                <option value="finance">টাকা/বিল (Finance)</option>
                <option value="personal">ব্যক্তিগত (Personal)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs active:scale-98 transition-transform"
          >
            সংরক্ষণ করুন (Save Task)
          </button>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="py-12 bg-white rounded-3xl border border-slate-200 text-center p-6 space-y-2">
            <CheckSquare className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-700">কোনো কাজ নেই</p>
            <p className="text-[11px] text-slate-400">
              উপরের বাটন দিয়ে নতুন কাজ যোগ করতে পারেন অথবা AI কে মুখে বলতে পারেন।
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                task.completed
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 shadow-2xs hover:border-emerald-300'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5 hover:text-emerald-500" />
                  )}
                </button>

                <div className="min-w-0">
                  <h4
                    className={`text-xs font-bold text-slate-900 leading-snug ${
                      task.completed ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {task.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {task.dueDate}
                    </span>

                    {task.dueTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {task.dueTime}
                      </span>
                    )}

                    <span className="flex items-center gap-1 font-semibold">
                      {getCategoryIcon(task.category)}
                      {task.category}
                    </span>

                    {task.priority === 'high' && (
                      <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 font-bold">
                        জরুরি
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                title="মুছুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
