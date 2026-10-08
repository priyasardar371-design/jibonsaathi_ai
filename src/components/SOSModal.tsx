import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, MapPin, AlertTriangle, X, ShieldAlert, Heart, Copy, Check, Share2 } from 'lucide-react';
import { OFFICIAL_EMERGENCY_CONTACTS } from '../data/seedData';

export const SOSModal: React.FC = () => {
  const { activeModal, setActiveModal, t, familyMembers, currentUser } = useApp();
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [copiedLocation, setCopiedLocation] = useState(false);

  const isOpen = activeModal === 'sos';

  if (!isOpen) return null;

  const familyEmergencyContacts = familyMembers.filter((m) => m.isEmergencyContact && m.phone);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('আপনার ব্রাউজারে লোকেশন সার্ভিস সাপোর্ট নেই।');
      return;
    }

    setLocationStatus('লোকেশন সংগ্রহ করা হচ্ছে...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocationCoords(coords);
        setLocationStatus(`অক্ষাংশ: ${coords.lat.toFixed(4)}, দ্রাঘিমাংশ: ${coords.lng.toFixed(4)}`);
      },
      (err) => {
        setLocationStatus('লোকেশন পাওয়া যায়নি। অনুগ্রহ করে জিপিএস পারমিশন চালু করুন।');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const getGoogleMapsUrl = () => {
    if (!locationCoords) return '';
    return `https://maps.google.com/?q=${locationCoords.lat},${locationCoords.lng}`;
  };

  const handleShareLocationWhatsApp = () => {
    const text = locationCoords
      ? `জরুরি সাহায্য দরকার! আমার বর্তমান অবস্থান: ${getGoogleMapsUrl()} (JibonSaathi AI SOS)`
      : `জরুরি সাহায্য দরকার! অবিলম্বে আমার সাথে যোগাযোগ করুন। (JibonSaathi AI SOS)`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLocation = () => {
    const text = getGoogleMapsUrl();
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedLocation(true);
      setTimeout(() => setCopiedLocation(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-red-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border-2 border-red-500">
        {/* Header */}
        <div className="px-5 py-4 bg-red-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg leading-tight tracking-wide">জরুরি এসওএস (SOS)</h2>
              <p className="text-[11px] text-red-100">তাৎক্ষণিক সহায়তা ও জরুরি যোগাযোগ</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          {/* Official Emergency Disclaimer */}
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-red-800 leading-relaxed font-medium">
              {t.emergencyDisclaimer}
            </p>
          </div>

          {/* Quick Dial 112 Primary Button */}
          <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-4 text-white shadow-lg shadow-red-600/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-200 block">
                জাতীয় জরুরি হেল্পলাইন (সবচেয়ে দ্রুত)
              </span>
              <h3 className="text-2xl font-black tracking-tight">ডায়াল ১১২ (112)</h3>
              <p className="text-xs text-red-100">পুলিশ, অ্যাম্বুলেন্স ও দমকল এক সাথে</p>
            </div>
            <a
              href="tel:112"
              className="w-14 h-14 rounded-full bg-white text-red-600 flex items-center justify-center font-bold shadow-md hover:bg-red-50 active:scale-95 transition-transform"
            >
              <Phone className="w-7 h-7 fill-red-600" />
            </a>
          </div>

          {/* Live Location Sharing Section */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-600" /> বর্তমান লোকেশন শেয়ার
              </span>
              <button
                onClick={handleGetLocation}
                className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 hover:bg-emerald-100"
              >
                জিআইএস লোকেশন পান
              </button>
            </div>

            {locationStatus && (
              <p className="text-xs text-slate-600 font-medium">{locationStatus}</p>
            )}

            {locationCoords && (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleShareLocationWhatsApp}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <Share2 className="w-3.5 h-3.5" /> হোয়াটসঅ্যাপে পাঠান
                </button>
                <button
                  onClick={handleCopyLocation}
                  className="py-2 px-3 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 hover:bg-slate-100"
                >
                  {copiedLocation ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLocation ? 'কপি হয়েছে' : 'কপি লিংক'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Official Indian Services */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2">
              সরকারি জরুরি হেল্পলাইন নম্বর:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {OFFICIAL_EMERGENCY_CONTACTS.map((c) => (
                <a
                  key={c.id}
                  href={`tel:${c.phone}`}
                  className="p-3 bg-white border border-slate-200 hover:border-red-300 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all group active:scale-95"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-700">
                      {c.name}
                    </h4>
                    <span className="text-xs font-black text-red-600 tracking-wide">
                      {c.phone}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Family Emergency Contacts */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2">
              পারিবারিক জরুরি যোগাযোগ (Family Contacts):
            </span>
            {familyEmergencyContacts.length === 0 ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
                পরিবার সেকশনে কোনো জরুরি নম্বর যুক্ত করা নেই।
              </div>
            ) : (
              <div className="space-y-2">
                {familyEmergencyContacts.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                      <p className="text-[11px] text-slate-500">{m.relation} • {m.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`tel:${m.phone}`}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 active:scale-95"
                      >
                        <Phone className="w-3.5 h-3.5" /> কল
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Personal Medical Information Card */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>জরুরি স্বাস্থ্য তথ্য কার্ড (Emergency Medical Card)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-amber-950 pt-1">
              <div>
                <span className="text-[10px] text-amber-700 font-semibold block">ব্যবহারকারীর নাম:</span>
                <span className="font-bold">{currentUser.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-700 font-semibold block">রক্তের গ্রুপ (Blood Group):</span>
                <span className="font-bold">B+ (Positive)</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-700 font-semibold block">অ্যালার্জি / সাবধানতা:</span>
                <span className="font-medium">পেনিসিলিন এলার্জি নেই</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-700 font-semibold block">ঠিকানা অঞ্চল:</span>
                <span className="font-medium">{currentUser.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={() => setActiveModal(null)}
            className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors"
          >
            বন্ধ করুন (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
