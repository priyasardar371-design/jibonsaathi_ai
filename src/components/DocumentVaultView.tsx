import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Plus,
  Shield,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  Sparkles,
  Camera,
  Upload,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { DocumentCategory, DocumentVaultItem } from '../types';

export const DocumentVaultView: React.FC = () => {
  const { documents, addDocument, deleteDocument, t } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [unmaskMap, setUnmaskMap] = useState<Record<string, boolean>>({});
  const [searchDoc, setSearchDoc] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // New Doc Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Aadhaar');
  const [docNumber, setDocNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [summary, setSummary] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');

  const docCategories: DocumentCategory[] = [
    'Aadhaar',
    'PAN',
    'Driving licence',
    'Voter ID',
    'Passport',
    'Certificates',
    'Job documents',
    'Vehicle documents',
    'Insurance documents',
    'Other',
  ];

  const filteredDocs = documents.filter((d) => {
    if (!searchDoc) return true;
    const q = searchDoc.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      (d.holderName && d.holderName.toLowerCase().includes(q))
    );
  });

  const toggleMask = (id: string) => {
    setUnmaskMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);

      // Trigger automatic AI OCR Extraction!
      setIsScanning(true);
      try {
        const res = await fetch('/api/gemini/extract-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type || 'image/jpeg',
            category,
          }),
        });
        const extracted = await res.json();
        if (extracted.docNumber) setDocNumber(extracted.docNumber);
        if (extracted.holderName) setHolderName(extracted.holderName);
        if (extracted.expiryDate) setExpiryDate(extracted.expiryDate);
        if (extracted.summary) setSummary(extracted.summary);
        if (extracted.documentType && !title) setTitle(extracted.documentType);
      } catch (err) {
        console.error('OCR failed', err);
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addDocument({
      title,
      category,
      docNumber,
      holderName,
      expiryDate,
      summary,
      fileDataUri: imagePreview || undefined,
    });

    setTitle('');
    setDocNumber('');
    setHolderName('');
    setExpiryDate('');
    setSummary('');
    setImagePreview('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Privacy Guarantee Banner */}
      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center justify-between text-xs text-emerald-900 font-medium">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{t.privacyNotice}</span>
        </div>
        <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      </div>

      {/* Header and Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900">ডকুমেন্ট ভল্ট ({documents.length})</h3>
          <p className="text-xs text-slate-500">আপনার জরুরি পরিচয়পত্র ও সার্টিফিকেটের ডিজিটাল রূপ</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" /> নথি যোগ করুন
        </button>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocs.length === 0 ? (
          <div className="py-12 bg-white rounded-3xl border border-slate-200 text-center p-6 space-y-2">
            <FileText className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-700">কোনো সংরক্ষিত নথি নেই</p>
            <p className="text-[11px] text-slate-400">
              আধার, প্যান বা ড্রাইভিং লাইসেন্স যুক্ত করুন যাতে যেকোনো সময় কাজে লাগে।
            </p>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isUnmasked = !!unmaskMap[doc.id];
            return (
              <div
                key={doc.id}
                className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs hover:border-purple-300 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-purple-800 bg-purple-100/70 px-2 py-0.2 rounded-full">
                        {t.docCategories[doc.category] || doc.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">{doc.title}</h4>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="p-1 text-slate-300 hover:text-red-500 rounded-lg"
                    title="মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {doc.docNumber && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block">নথি নম্বর:</span>
                      <span className="text-xs font-bold font-mono text-slate-800">
                        {isUnmasked ? doc.docNumber : doc.docNumber.replace(/(\d{4})/g, 'XXXX-').slice(0, 14) || 'XXXX-XXXX-9281'}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleMask(doc.id)}
                      className="p-1.5 text-slate-500 hover:text-slate-800"
                    >
                      {isUnmasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                )}

                <div className="text-[11px] text-slate-500 flex justify-between">
                  {doc.holderName && <span>নাম: <strong className="text-slate-700">{doc.holderName}</strong></span>}
                  {doc.expiryDate && (
                    <span className="text-amber-700 font-semibold">
                      মেয়াদ: {doc.expiryDate}
                    </span>
                  )}
                </div>

                {doc.summary && (
                  <p className="text-[11px] text-slate-600 bg-purple-50/50 p-2 rounded-xl">
                    {doc.summary}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">নয়া ডকুমেন্ট যুক্ত করুন</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                বাতিল
              </button>
            </div>

            {/* Photo / Camera Upload with Gemini OCR */}
            <div className="border-2 border-dashed border-purple-200 bg-purple-50/40 rounded-2xl p-4 text-center space-y-2 relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 mx-auto flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-purple-900">
                  কাগজপত্রের ছবি তুলুন বা আপলোড করুন
                </p>
                <p className="text-[10px] text-purple-700 flex items-center justify-center gap-1 mt-0.5">
                  <Sparkles className="w-3 h-3 text-amber-500" /> AI নিজে থেকেই বিবরণ পড়ে নেবে
                </p>
              </div>

              {isScanning && (
                <div className="pt-2 text-xs font-bold text-purple-700 flex items-center justify-center gap-1.5 animate-pulse">
                  <div className="w-3 h-3 rounded-full bg-purple-600 animate-ping" />
                  <span>AI স্ক্যান করছে...</span>
                </div>
              )}

              {imagePreview && !isScanning && (
                <div className="text-[11px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ছবি লোড হয়েছে
                </div>
              )}
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  ডকুমেন্টের নাম *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: আধার কার্ড / ভোটার আইডি"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-purple-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">বিভাগ</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  {docCategories.map((c) => (
                    <option key={c} value={c}>
                      {t.docCategories[c] || c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    নম্বর (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="XXXX-1234"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-purple-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    কার নামে (নাম)
                  </label>
                  <input
                    type="text"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    placeholder="রমেন সরকার"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  মেয়াদ শেষের তারিখ (যদি থাকে)
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-purple-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-xs active:scale-98 transition-transform"
              >
                নিরাপদে সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
