import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  CheckCircle2,
  Calendar,
  DollarSign,
  PenTool,
  Clock,
  User,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { AIChatMessage } from '../types';

export const AIChatView: React.FC = () => {
  const {
    currentUser,
    tasks,
    moneyReminders,
    language,
    t,
    addTask,
    addMoneyReminder,
    speakText,
    isSpeaking,
    stopSpeaking,
    setActiveModal,
  } = useApp();

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      text:
        language === 'bn'
          ? `নমস্কার ${currentUser.name}! আমি আপনার জীবনসাথী AI।\n\nআপনি আমাকে মুখে বা লিখে যেকোনো কাজের কথা বলতে পারেন—যেমন:\n• "আগামী ৭ তারিখে আমার EMI আছে, মনে করিয়ে দিও"\n• "আমার কাল সকাল ৯টায় ইন্টারভিউ আছে"\n• "আমার আজ কী কী কাজ আছে?"\n• "আমার কাছে ৫০০০ টাকা আছে, কীভাবে চালাব?"\n\nআমি আপনাকে কীভাবে সাহায্য করতে পারি?`
          : language === 'hi'
          ? `नमस्ते ${currentUser.name}! मैं आपका जीवनसाथी AI हूँ।\n\nआप मुझसे किसी भी काम, EMI रिमाइंडर या दैनिक योजना के बारे में बोलकर या लिखकर पूछ सकते हैं।`
          : `Hello ${currentUser.name}! I am your JibonSaathi AI assistant.\n\nTell me about your reminders, tasks, budgeting, or message drafting!`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Voice Input Setup
  const handleToggleVoice = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('আপনার ডিভাইসে সরাসরি ভয়েস রেকগনিশন পাওয়া যায়নি। নিচের বক্সে টাইপ করুন।');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'bn' ? 'bn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          setInputText(text);
          setIsListening(false);
          // Directly send
          handleSendMessage(text);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: AIChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          conversationHistory: messages.map((m) => ({ role: m.role, text: m.text })),
          userContext: {
            userName: currentUser.name,
            userTasks: tasks.filter((t) => !t.completed).map((t) => ({ title: t.title, dueDate: t.dueDate })),
            userReminders: moneyReminders.filter((r) => !r.paid).map((r) => ({ title: r.title, amount: r.amount, dueDate: r.dueDate })),
          },
        }),
      });

      const data = await res.json();
      if (data.reply) {
        const aiMsg: AIChatMessage = {
          id: 'msg-ai-' + Date.now(),
          role: 'assistant',
          text: data.reply,
          timestamp: new Date().toISOString(),
          actions: data.actions || [],
        };

        // Automatically execute in-app creation if indicated
        if (Array.isArray(data.actions) && data.actions.length > 0) {
          data.actions.forEach((act: any) => {
            if (act.type === 'create_reminder' && act.data) {
              addMoneyReminder({
                title: act.data.title || 'নয়া রিমাইন্ডার',
                amount: Number(act.data.amount) || 1000,
                dueDate: act.data.dueDate || new Date().toISOString().slice(0, 10),
                category: act.data.category || 'EMI',
                paid: false,
                recurring: 'monthly',
                notes: 'Created by JibonSaathi AI assistant',
              });
              act.executed = true;
            } else if (act.type === 'create_task' && act.data) {
              addTask({
                title: act.data.title || 'নয়া কাজ',
                dueDate: act.data.dueDate || new Date().toISOString().slice(0, 10),
                priority: act.data.priority || 'high',
                category: 'work',
                completed: false,
              });
              act.executed = true;
            }
          });
        }

        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          role: 'assistant',
          text: 'দুঃখিত, সংযোগে সামান্য বিঘ্ন ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-md mx-auto">
      {/* Top Banner with Tools Trigger */}
      <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 leading-tight">জীবনসাথী AI সহকারী</h3>
            <p className="text-[10px] text-emerald-700 font-medium">বাংলা ও ভয়েস সমর্থিত</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveModal('writer')}
            className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-full text-[11px] font-bold text-emerald-800 flex items-center gap-1 transition-colors"
          >
            <PenTool className="w-3 h-3 text-emerald-600" />
            <span>মেসেজ রাইটার</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((msg) => {
          const isAI = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-3xl p-3.5 shadow-xs text-xs leading-relaxed ${
                  isAI
                    ? 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-sm'
                    : 'bg-emerald-700 text-white rounded-tr-sm font-medium'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Structured Action Executed Card */}
                {isAI && msg.actions && msg.actions.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
                    {msg.actions.map((act, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-emerald-950 font-bold"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          {act.type === 'create_reminder' ? (
                            <DollarSign className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          ) : (
                            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          )}
                          <span className="truncate">
                            {act.data.title || 'নয়া আইটেম'}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shrink-0 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> সংরক্ষিত
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Speaker icon for assistant replies */}
                {isAI && (
                  <div className="mt-1 flex items-center justify-end">
                    <button
                      onClick={() => (isSpeaking ? stopSpeaking() : speakText(msg.text))}
                      className="text-slate-400 hover:text-emerald-700 p-1 rounded-md"
                      title="ভয়েসে শুনুন"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-xs text-xs text-slate-500 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-600 animate-ping" />
              <span>জীবনসাথী ভাবছে ও তৈরি করছে...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-200 flex gap-1.5 overflow-x-auto no-scrollbar">
        {t.quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-full text-[11px] font-medium text-slate-700 whitespace-nowrap transition-colors shadow-2xs active:scale-95"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Bottom Input Field */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Microphone Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-3 rounded-2xl transition-all shadow-xs shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white ring-4 ring-rose-200 animate-pulse'
                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
            }`}
            title="মুখে বলুন"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? 'শুনছি... বলুন...' : 'এখানে লিখুন বা মুখে বলুন...'}
            className="flex-1 px-4 py-3 bg-slate-100 rounded-2xl text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white border border-transparent focus:border-emerald-500 transition-all"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white rounded-2xl transition-all shadow-md shadow-emerald-700/20 shrink-0 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
