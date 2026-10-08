import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, MicOff, X, Sparkles, Volume2, ArrowRight, CheckCircle2 } from 'lucide-react';

export const VoiceAssistantModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    language,
    t,
    currentUser,
    tasks,
    moneyReminders,
    addTask,
    addMoneyReminder,
    speakText,
    isSpeaking,
    stopSpeaking,
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [executedActions, setExecutedActions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const recognitionRef = useRef<any>(null);

  const isOpen = activeModal === 'voice';

  // Sample quick voice prompts
  const sampleVoicePrompts = [
    'আগামী ৭ তারিখে আমার EMI আছে, মনে করিয়ে দিও।',
    'আমার কাল সকাল ৯টায় ইন্টারভিউ আছে।',
    'আমার আজ কী কী কাজ আছে?',
    'আমার কাছে ৫০০০ টাকা আছে, কীভাবে চালাব?',
  ];

  useEffect(() => {
    if (!isOpen) {
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setTranscript('');
      setInterimTranscript('');
      setAiResponse('');
      setExecutedActions([]);
      setErrorMsg('');
      stopSpeaking();
    }
  }, [isOpen]);

  const startListening = () => {
    setErrorMsg('');
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg('আপনার ব্রাউজারে ভয়েস রেকগনিশন সাপোর্ট নেই। নিচের বক্সে টাইপ করুন বা নমুনা বাটনে চাপ দিন।');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      // Select language
      if (language === 'bn') {
        recognition.lang = 'bn-IN';
      } else if (language === 'hi') {
        recognition.lang = 'hi-IN';
      } else {
        recognition.lang = 'en-IN';
      }

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setInterimTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTrans = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (finalTrans) {
          setTranscript((prev) => (prev ? prev + ' ' + finalTrans : finalTrans));
          handleProcessVoiceQuery(finalTrans);
        } else {
          setInterimTranscript(currentInterim);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMsg('মাইক্রোফোন পারমিশন দেওয়া হয়নি। ব্রাউজার সেটিংসে অনুমতি দিন।');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error(err);
      setIsListening(false);
      setErrorMsg('মাইক্রোফোন চালু করা যায়নি।');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleProcessVoiceQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    setExecutedActions([]);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          language,
          userContext: {
            userName: currentUser.name,
            userTasks: tasks.filter((t) => !t.completed).map((t) => ({ title: t.title, dueDate: t.dueDate })),
            userReminders: moneyReminders.filter((r) => !r.paid).map((r) => ({ title: r.title, amount: r.amount, dueDate: r.dueDate })),
          },
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setAiResponse(data.reply);
        speakText(data.reply);

        // Execute any structured actions returned by Gemini
        if (Array.isArray(data.actions) && data.actions.length > 0) {
          const actionResults: any[] = [];
          for (const act of data.actions) {
            if (act.type === 'create_reminder' && act.data) {
              const rem = addMoneyReminder({
                title: act.data.title || 'নয়া রিমাইন্ডার',
                amount: Number(act.data.amount) || 1000,
                dueDate: act.data.dueDate || new Date().toISOString().slice(0, 10),
                category: act.data.category || 'EMI',
                paid: false,
                recurring: 'monthly',
                notes: 'Created via JibonSaathi Voice Assistant',
              });
              actionResults.push({
                type: 'create_reminder',
                label: `টাকার রিমাইন্ডার সংরক্ষিত: ${rem.title} (₹${rem.amount})`,
              });
            } else if (act.type === 'create_task' && act.data) {
              const t = addTask({
                title: act.data.title || 'নয়া কাজ',
                dueDate: act.data.dueDate || new Date().toISOString().slice(0, 10),
                priority: act.data.priority || 'high',
                category: 'work',
                completed: false,
              });
              actionResults.push({
                type: 'create_task',
                label: `কাজের তালিকা যোগ হয়েছে: ${t.title}`,
              });
            }
          }
          setExecutedActions(actionResults);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('সহকারীর সাথে সংযোগে সমস্যা হয়েছে। ইন্টারনেটের সংযোগ পরীক্ষা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] border border-slate-100">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">জীবনসাথী ভয়েস সহকারী</h3>
              <p className="text-[11px] text-emerald-100">বাংলা, হিন্দি ও ইংরেজিতে কথা বলুন</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Waveform / Visualizer */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative">
              {isListening && (
                <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping -m-4" />
              )}
              <button
                onClick={isListening ? stopListening : startListening}
                className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-300 active:scale-95 ${
                  isListening
                    ? 'bg-rose-500 text-white shadow-rose-500/40 ring-4 ring-rose-200 scale-105'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-8 h-8 mb-1 animate-pulse" />
                    <span className="text-[10px] font-bold">থামুন</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-8 h-8 mb-1" />
                    <span className="text-[10px] font-bold">কথা বলুন</span>
                  </>
                )}
              </button>
            </div>

            <p className="mt-4 text-xs font-semibold text-slate-600 text-center">
              {isListening
                ? 'শুনছি... আপনার কাজ বা রিমাইন্ডার বলুন'
                : 'মাইক্রোফোনে চাপ দিয়ে বলুন, জীবনসাথী সাজিয়ে দেবে'}
            </p>
          </div>

          {/* Transcript Display */}
          {(transcript || interimTranscript) && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                আপনি বললেন:
              </span>
              <p className="text-sm font-medium text-slate-800">
                {transcript} <span className="text-slate-400 italic">{interimTranscript}</span>
              </p>
            </div>
          )}

          {/* Loading spinner */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-3 text-emerald-700 text-xs font-semibold">
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <span>জীবনসাথী তৈরি করছে...</span>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Executed In-App Action Badges */}
          {executedActions.length > 0 && (
            <div className="space-y-1.5">
              {executedActions.map((act, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-900 text-xs font-semibold animate-in fade-in"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{act.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* AI Response Text */}
          {aiResponse && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> জীবনসাথীর উত্তর:
                </span>
                <button
                  onClick={() => (isSpeaking ? stopSpeaking() : speakText(aiResponse))}
                  className="p-1 hover:bg-emerald-100 rounded-full transition-colors"
                  title="Play audio"
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-emerald-700 animate-pulse' : 'text-slate-500'}`} />
                </button>
              </div>
              <p className="text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
                {aiResponse}
              </p>
            </div>
          )}

          {/* Quick Voice Chips */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-500 block mb-2">
              অথবা নিচের যেকোনো একটিতে চাপুন:
            </span>
            <div className="flex flex-col gap-1.5">
              {sampleVoicePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTranscript(prompt);
                    handleProcessVoiceQuery(prompt);
                  }}
                  className="w-full text-left p-2.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium flex items-center justify-between transition-colors group active:scale-[0.99]"
                >
                  <span>"{prompt}"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            জেবনসাথী AI স্বয়ংক্রিয়ভাবে আপনার কথা বুঝে রিমাইন্ডার ও টাস্কে সংরক্ষণ করে
          </p>
        </div>
      </div>
    </div>
  );
};
