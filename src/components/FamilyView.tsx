import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Plus,
  Phone,
  Calendar,
  Heart,
  Trash2,
  Shield,
  CheckCircle2,
  Gift,
} from 'lucide-react';
import { FamilyMember } from '../types';

export const FamilyView: React.FC = () => {
  const { familyMembers, addFamilyMember, deleteFamilyMember, t } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('স্ত্রী (Wife)');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [notes, setNotes] = useState('');
  const [isEmergencyContact, setIsEmergencyContact] = useState(true);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addFamilyMember({
      name,
      relation,
      phone,
      birthday,
      notes,
      isEmergencyContact,
    });

    setName('');
    setPhone('');
    setBirthday('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900">আমার পরিবার ({familyMembers.length})</h3>
          <p className="text-xs text-slate-500">পরিবারের সদস্যদের গুরুত্বপূর্ণ দিন ও জরুরি সংযোগ</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" /> সদস্য যোগ করুন
        </button>
      </div>

      {/* Family Members Cards */}
      <div className="space-y-3">
        {familyMembers.length === 0 ? (
          <div className="py-12 bg-white rounded-3xl border border-slate-200 text-center p-6 space-y-2">
            <Users className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-700">কোনো সদস্য যুক্ত নেই</p>
            <p className="text-[11px] text-slate-400">
              স্ত্রী, সন্তান বা পিতা-মাতার বিবরণ ও জরুরি নম্বর যুক্ত করুন।
            </p>
          </div>
        ) : (
          familyMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs hover:border-rose-200 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-bold text-base shadow-xs">
                    {member.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{member.name}</span>
                      {member.isEmergencyContact && (
                        <span className="text-[9px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-full">
                          জরুরি SOS
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">{member.relation}</p>
                  </div>
                </div>

                <button
                  onClick={() => deleteFamilyMember(member.id)}
                  className="p-1 text-slate-300 hover:text-red-500 rounded-lg"
                  title="মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {(member.phone || member.birthday || member.notes) && (
                <div className="p-2.5 bg-slate-50 rounded-2xl text-[11px] space-y-1 text-slate-600">
                  {member.phone && (
                    <div className="flex items-center justify-between">
                      <span>মোবাইল: <strong className="text-slate-800">{member.phone}</strong></span>
                      <a
                        href={`tel:${member.phone}`}
                        className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" /> কল
                      </a>
                    </div>
                  )}
                  {member.birthday && (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Gift className="w-3.5 h-3.5 text-pink-500" />
                      <span>জন্মদিন: {member.birthday}</span>
                    </div>
                  )}
                  {member.notes && (
                    <p className="text-slate-500 italic mt-0.5">{member.notes}</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">পরিবারের নতুন সদস্য</h3>
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
                  সদস্যের নাম *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: সুজাতা সরকার"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-rose-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">সম্পর্ক</label>
                <input
                  type="text"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  placeholder="যেমন: স্ত্রী / ছেলে / বাবা / মা"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-rose-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  ফোন নম্বর (জরুরি কলের জন্য)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98310 99881"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-rose-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  জন্মদিন (Birthday)
                </label>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-rose-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="em-check"
                  checked={isEmergencyContact}
                  onChange={(e) => setIsEmergencyContact(e.target.checked)}
                  className="rounded text-rose-600"
                />
                <label htmlFor="em-check" className="text-xs text-slate-700 font-semibold cursor-pointer">
                  জরুরি SOS কন্টাক্ট হিসেবে তালিকাভুক্ত করুন
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-98 transition-transform"
              >
                সদস্য সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
