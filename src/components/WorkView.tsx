import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Users,
  PlusCircle,
  Search,
  Filter,
  MapPin,
  Calendar,
  Phone,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  DollarSign,
  Clock,
  X,
  Share2,
} from 'lucide-react';
import { JobCategory, Job, WorkerCandidate } from '../types';

export const WorkView: React.FC = () => {
  const {
    jobs,
    addJob,
    reportJob,
    workers,
    addWorkerCandidate,
    currentUser,
    t,
    setActiveModal,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'find_jobs' | 'find_workers' | 'post_job' | 'my_profile'>('find_jobs');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [reportedJobs, setReportedJobs] = useState<string[]>([]);

  // Post a Job Form State
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCategory, setNewJobCategory] = useState<JobCategory>('Painter');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [newJobLocation, setNewJobLocation] = useState('গড়িয়া, কলকাতা (Kolkata)');
  const [newJobWorkers, setNewJobWorkers] = useState(1);
  const [newJobPayment, setNewJobPayment] = useState('₹700 / দিন');
  const [newJobDate, setNewJobDate] = useState('2026-10-12');
  const [newJobDuration, setNewJobDuration] = useState('২ দিন (2 Days)');
  const [jobPostedSuccess, setJobPostedSuccess] = useState(false);

  // Categories list
  const categoryKeys: JobCategory[] = [
    'Painter',
    'Electrician',
    'Plumber',
    'Welder',
    'Carpenter',
    'Construction worker',
    'Cleaner',
    'Delivery worker',
    'Warehouse worker',
    'Driver',
    'Other local jobs',
  ];

  // Filtering Jobs
  const filteredJobs = jobs.filter((j) => {
    if (j.isReported) return false;
    if (selectedCategory !== 'all' && j.category !== selectedCategory) return false;
    if (locationFilter && !j.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    if (
      searchQuery &&
      !j.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !j.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  // Filtering Workers
  const filteredWorkers = workers.filter((w) => {
    if (selectedCategory !== 'all' && w.skill !== selectedCategory) return false;
    if (locationFilter && !w.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    if (searchQuery && !w.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleApply = (jobId: string, employerPhone: string) => {
    setAppliedJobs((prev) => [...prev, jobId]);
    const cleanPhone = employerPhone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `নমস্কার, আমি জীবনসাথী AI অ্যাপে আপনার কাজের বিজ্ঞপ্তি দেখে যোগাযোগ করছি। আমি এই কাজের জন্য আগ্রহী।`
    );
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${msg}`, '_blank');
  };

  const handleReport = (jobId: string) => {
    if (confirm('আপনি কি এই কাজের বিজ্ঞপ্তিটি অসদুপায়/সন্দেহজনক হিসেবে রিপোর্ট করতে চান?')) {
      reportJob(jobId);
      setReportedJobs((prev) => [...prev, jobId]);
    }
  };

  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;

    addJob({
      title: newJobTitle,
      category: newJobCategory,
      description: newJobDesc,
      location: newJobLocation,
      requiredWorkers: newJobWorkers,
      payment: newJobPayment,
      paymentType: 'daily',
      date: newJobDate,
      duration: newJobDuration,
      employerName: currentUser.name,
      employerPhone: currentUser.phone,
      employerVerified: true,
    });

    setJobPostedSuccess(true);
    setTimeout(() => {
      setJobPostedSuccess(false);
      setActiveSubTab('find_jobs');
      setNewJobTitle('');
      setNewJobDesc('');
    }, 1500);
  };

  return (
    <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-4">
      {/* Top Header & Sub-Tabs */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>কাজের বাজার (Work Finder)</span>
            <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              স্থানীয় কাজ
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            রংমিস্ত্রি, ইলেকট্রিশিয়ান, ড্রাইভার ও অন্যান্য স্থানীয় সুযোগ
          </p>
        </div>

        <button
          onClick={() => setActiveSubTab('post_job')}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-transform"
        >
          <PlusCircle className="w-3.5 h-3.5" /> কাজ দিন
        </button>
      </div>

      {/* Safety Alert (Prominently displayed) */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
          {t.scamWarning}
        </p>
      </div>

      {/* Sub-tab Navigation */}
      <div className="bg-slate-200/80 p-1 rounded-2xl flex gap-1">
        <button
          onClick={() => setActiveSubTab('find_jobs')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'find_jobs'
              ? 'bg-white text-blue-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          কাজ খুঁজুন ({jobs.length})
        </button>
        <button
          onClick={() => setActiveSubTab('find_workers')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'find_workers'
              ? 'bg-white text-blue-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          কর্মী খুঁজুন ({workers.length})
        </button>
      </div>

      {/* Search & Location Bar */}
      {activeSubTab !== 'post_job' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl px-3 py-2 flex items-center gap-2 shadow-xs">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="কাজের নাম বা দক্ষতা লিখুন..."
                className="w-full text-xs font-medium outline-none bg-transparent"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="w-36 bg-white border border-slate-200 rounded-2xl px-2.5 py-2 flex items-center gap-1.5 shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="অঞ্চল/শহর"
                className="w-full text-xs font-medium outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Category Filter Horizontal Scroll */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              সব ক্যাটাগরি
            </button>
            {categoryKeys.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t.jobCategories[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 1: Find Jobs */}
      {activeSubTab === 'find_jobs' && (
        <div className="space-y-3">
          {filteredJobs.length === 0 ? (
            <div className="py-12 bg-white rounded-3xl border border-slate-200 text-center p-6 space-y-2">
              <Briefcase className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-700">কোনো কাজ খুঁজে পাওয়া যায়নি</p>
              <p className="text-[11px] text-slate-500">
                অন্য ক্যাটাগরি বেছে নিন বা অন্য লোকেশন সার্চ করুন।
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isApplied = appliedJobs.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                        {t.jobCategories[job.category] || job.category}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug">
                        {job.title}
                      </h3>
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl shrink-0">
                      {job.payment}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>সময়কাল: {job.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="text-[11px] text-slate-500 truncate">
                      মালিক: <span className="font-semibold text-slate-700">{job.employerName}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleReport(job.id)}
                        className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                        title="রিপোর্ট করুন"
                      >
                        <AlertOctagon className="w-4 h-4" />
                      </button>

                      <a
                        href={`tel:${job.employerPhone}`}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" /> কল
                      </a>

                      <button
                        onClick={() => handleApply(job.id, job.employerPhone)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                          isApplied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> আবেদন সম্পন্ন
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" /> যোগাযোগ করুন
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW 2: Find Workers */}
      {activeSubTab === 'find_workers' && (
        <div className="space-y-3">
          {filteredWorkers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {worker.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1">
                      {worker.name}
                      {worker.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </h3>
                    <p className="text-xs text-blue-700 font-semibold">
                      {t.jobCategories[worker.skill] || worker.skill} • {worker.experienceYears} বছরের অভিজ্ঞতা
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg shrink-0">
                  ★ {worker.rating}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-2xl">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{worker.location}</span>
                </div>
                <div className="font-bold text-emerald-800">
                  {worker.expectedWage}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {worker.availability === 'immediate' ? 'এখনই পাওয়া যাবে' : 'পূর্ণকালীন'}
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${worker.phone}`}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" /> কল দিয়ে বুক করুন
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 3: Post a Job Modal/Screen */}
      {activeSubTab === 'post_job' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">কাজের নতুন বিজ্ঞাপন দিন</h3>
            <button
              onClick={() => setActiveSubTab('find_jobs')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              বাতিল
            </button>
          </div>

          {jobPostedSuccess ? (
            <div className="py-8 text-center space-y-2 text-emerald-700">
              <CheckCircle2 className="w-12 h-12 mx-auto animate-bounce text-emerald-600" />
              <h4 className="font-bold text-sm">বিজ্ঞাপনটি সফলভাবে পোস্ট হয়েছে!</h4>
              <p className="text-xs text-slate-500">স্থানীয় কর্মীরা অবিলম্বে দেখতে পাবেন।</p>
            </div>
          ) : (
            <form onSubmit={handlePostJobSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  কাজের শিরোনাম (Job Title) *
                </label>
                <input
                  type="text"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="যেমন: ২টি রুমের জন্য রঙমিস্ত্রি প্রয়োজন"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  কাজের ধরন (Skill / Category) *
                </label>
                <select
                  value={newJobCategory}
                  onChange={(e) => setNewJobCategory(e.target.value as JobCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-blue-600 focus:outline-none bg-white"
                >
                  {categoryKeys.map((cat) => (
                    <option key={cat} value={cat}>
                      {t.jobCategories[cat] || cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  কাজের বিবরণ (Description)
                </label>
                <textarea
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  placeholder="কাজের বিস্তারিত ও অন্যান্য শর্তাদি..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    অঞ্চল / এলাকা *
                  </label>
                  <input
                    type="text"
                    value={newJobLocation}
                    onChange={(e) => setNewJobLocation(e.target.value)}
                    placeholder="গড়িয়া, কলকাতা"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-blue-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    প্রস্তাবিত মজুরি (Wage) *
                  </label>
                  <input
                    type="text"
                    value={newJobPayment}
                    onChange={(e) => setNewJobPayment(e.target.value)}
                    placeholder="₹৭০০ / দিন"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-blue-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    কর্মী সংখ্যা
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newJobWorkers}
                    onChange={(e) => setNewJobWorkers(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    কাজের সময়কাল
                  </label>
                  <input
                    type="text"
                    value={newJobDuration}
                    onChange={(e) => setNewJobDuration(e.target.value)}
                    placeholder="২ দিন / ফুলটাইম"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-blue-600/20 active:scale-98 transition-transform"
              >
                বিজ্ঞাপন পোস্ট করুন (Publish Job)
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
