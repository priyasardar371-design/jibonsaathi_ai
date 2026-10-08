import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  UserProfile,
  Task,
  MoneyReminder,
  Job,
  WorkerCandidate,
  DocumentVaultItem,
  FamilyMember,
  AppNotification,
  CVData,
} from '../types';
import {
  INITIAL_JOBS,
  INITIAL_WORKERS,
  INITIAL_MONEY_REMINDERS,
  INITIAL_TASKS,
  INITIAL_DOCUMENTS,
  INITIAL_FAMILY,
  INITIAL_NOTIFICATIONS,
} from '../data/seedData';
import { translations } from '../translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)['bn'];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentUser: UserProfile;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  onboardingCompleted: boolean;
  completeOnboarding: (name: string, role: 'worker' | 'employer' | 'individual', phone?: string) => void;
  activeTab: 'home' | 'work' | 'ai' | 'tasks' | 'profile';
  setActiveTab: (tab: 'home' | 'work' | 'ai' | 'tasks' | 'profile') => void;
  // Modals & Panels
  activeModal:
    | null
    | 'voice'
    | 'sos'
    | 'search'
    | 'notifications'
    | 'add_task'
    | 'add_reminder'
    | 'post_job'
    | 'writer'
    | 'cv'
    | 'upload_doc'
    | 'premium';
  setActiveModal: (modal: AppContextType['activeModal']) => void;
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  // Money Reminders
  moneyReminders: MoneyReminder[];
  addMoneyReminder: (rem: Omit<MoneyReminder, 'id'>) => MoneyReminder;
  toggleReminderPaid: (id: string) => void;
  deleteMoneyReminder: (id: string) => void;
  // Jobs & Marketplace
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => void;
  reportJob: (id: string) => void;
  workers: WorkerCandidate[];
  addWorkerCandidate: (worker: Omit<WorkerCandidate, 'id'>) => void;
  // Documents
  documents: DocumentVaultItem[];
  addDocument: (doc: Omit<DocumentVaultItem, 'id' | 'createdAt'>) => void;
  deleteDocument: (id: string) => void;
  // Family
  familyMembers: FamilyMember[];
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  deleteFamilyMember: (id: string) => void;
  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  unreadNotificationsCount: number;
  // CV Profile
  cvData: CVData;
  updateCvData: (updates: Partial<CVData>) => void;
  // Audio Speech synthesis feedback
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  // Reset & Export
  exportAllData: () => void;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('js_language') as Language) || 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('js_language', lang);
  };

  const t = translations[language] || translations.bn;

  // 2. Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('js_theme') as 'light' | 'dark') || 'light';
  });

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('js_theme', next);
  };

  // 3. User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('js_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      id: 'usr-default',
      name: 'রমেন সরকার',
      phone: '+91 98310 99881',
      role: 'worker',
      language: 'bn',
      location: 'গড়িয়া, কলকাতা (Garia, Kolkata)',
      skills: ['Painter', 'Electrician'],
      experienceYears: 6,
      expectedWage: '₹750 / দিন',
      availability: 'immediate',
      bio: 'দায়িত্বশীল ও সৎ কর্মী। বাড়ি রং এবং সাধারণ ইলেকট্রিক কাজে অভিজ্ঞ।',
      isGuest: false,
      isAuthenticated: true,
      isPremium: false,
      pinLockEnabled: false,
    };
  });

  const updateCurrentUser = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('js_user', JSON.stringify(next));
      return next;
    });
  };

  // 4. Onboarding
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(() => {
    return localStorage.getItem('js_onboarded') === 'true';
  });

  const completeOnboarding = (name: string, role: 'worker' | 'employer' | 'individual', phone?: string) => {
    setOnboardingCompleted(true);
    localStorage.setItem('js_onboarded', 'true');
    updateCurrentUser({
      name: name || (language === 'bn' ? 'প্রিয় ব্যবহারকারী' : 'User'),
      role,
      phone: phone || '+91 98300 00000',
      isGuest: !phone,
    });
  };

  // 5. Active Tab & Modals
  const [activeTab, setActiveTab] = useState<'home' | 'work' | 'ai' | 'tasks' | 'profile'>('home');
  const [activeModal, setActiveModal] = useState<AppContextType['activeModal']>(null);

  // 6. Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('js_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  useEffect(() => {
    localStorage.setItem('js_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>): Task => {
    const created: Task = {
      ...newTask,
      id: 'task-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [created, ...prev]);

    // Create notification
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: 'নতুন কাজ যোগ হয়েছে',
      message: `${created.title} (${created.dueDate})`,
      category: 'task',
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    return created;
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // 7. Money Reminders
  const [moneyReminders, setMoneyReminders] = useState<MoneyReminder[]>(() => {
    const saved = localStorage.getItem('js_money_reminders');
    return saved ? JSON.parse(saved) : INITIAL_MONEY_REMINDERS;
  });

  useEffect(() => {
    localStorage.setItem('js_money_reminders', JSON.stringify(moneyReminders));
  }, [moneyReminders]);

  const addMoneyReminder = (newRem: Omit<MoneyReminder, 'id'>): MoneyReminder => {
    const created: MoneyReminder = {
      ...newRem,
      id: 'mr-' + Date.now(),
    };
    setMoneyReminders((prev) => [created, ...prev]);

    // Create notification
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: 'টাকার নতুন রিমাইন্ডার',
      message: `${created.title} - ₹${created.amount.toLocaleString('en-IN')} (${created.dueDate})`,
      category: 'bill',
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    return created;
  };

  const toggleReminderPaid = (id: string) => {
    setMoneyReminders((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              paid: !r.paid,
              paidDate: !r.paid ? new Date().toISOString() : undefined,
            }
          : r
      )
    );
  };

  const deleteMoneyReminder = (id: string) => {
    setMoneyReminders((prev) => prev.filter((r) => r.id !== id));
  };

  // 8. Jobs
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('js_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  useEffect(() => {
    localStorage.setItem('js_jobs', JSON.stringify(jobs));
  }, [jobs]);

  const addJob = (newJob: Omit<Job, 'id' | 'createdAt'>) => {
    const created: Job = {
      ...newJob,
      id: 'job-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setJobs((prev) => [created, ...prev]);
  };

  const reportJob = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, isReported: true } : j))
    );
  };

  // 9. Workers
  const [workers, setWorkers] = useState<WorkerCandidate[]>(() => {
    const saved = localStorage.getItem('js_workers');
    return saved ? JSON.parse(saved) : INITIAL_WORKERS;
  });

  const addWorkerCandidate = (w: Omit<WorkerCandidate, 'id'>) => {
    const created: WorkerCandidate = {
      ...w,
      id: 'worker-' + Date.now(),
    };
    setWorkers((prev) => [created, ...prev]);
  };

  // 10. Documents
  const [documents, setDocuments] = useState<DocumentVaultItem[]>(() => {
    const saved = localStorage.getItem('js_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  useEffect(() => {
    localStorage.setItem('js_documents', JSON.stringify(documents));
  }, [documents]);

  const addDocument = (doc: Omit<DocumentVaultItem, 'id' | 'createdAt'>) => {
    const created: DocumentVaultItem = {
      ...doc,
      id: 'doc-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setDocuments((prev) => [created, ...prev]);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // 11. Family Members
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem('js_family');
    return saved ? JSON.parse(saved) : INITIAL_FAMILY;
  });

  useEffect(() => {
    localStorage.setItem('js_family', JSON.stringify(familyMembers));
  }, [familyMembers]);

  const addFamilyMember = (m: Omit<FamilyMember, 'id'>) => {
    const created: FamilyMember = {
      ...m,
      id: 'fam-' + Date.now(),
    };
    setFamilyMembers((prev) => [...prev, created]);
  };

  const deleteFamilyMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // 12. Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('js_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('js_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // 13. CV Data
  const [cvData, setCvData] = useState<CVData>(() => {
    const saved = localStorage.getItem('js_cv_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      name: 'রমেন সরকার (Ramen Sarkar)',
      phone: '+91 98310 99881',
      location: 'গড়িয়া, কলকাতা (Kolkata)',
      education: 'মাধ্যমিক পাস (Class 10 Pass)',
      profession: 'Painter & Decorator',
      skills: ['Interior Painting', 'Exterior Painting', 'Wall Putty', 'Polishing', 'Color Mixing'],
      experience: '৬ বছরের কাজের অভিজ্ঞতা বিভিন্ন আবাসিক ও বাণিজ্যিক প্রকল্পে।',
      languages: ['বাংলা (Bengali)', 'হিন্দি (Hindi)', 'Basic English'],
      availability: 'তাৎক্ষণিক কাজ শুরু করতে প্রস্তুত',
      professionalSummary: 'নির্ভরযোগ্য ও দক্ষ রংমিস্ত্রি। সময়মতো এবং পরিচ্ছন্নভাবে কাজ শেষ করার রেকর্ড রয়েছে।',
      bulletHighlights: [
        'দেয়াল প্রিপারেশন, পুটিং এবং প্রাইমার প্রয়োগে পারদর্শী।',
        'এশিয়ান পেইন্টস ও বার্জার পেইন্টসের বিভিন্ন গ্রেডের রঙের কাজের বাস্তব অভিজ্ঞতা।',
        'উচ্চতায় উঠে নিরাপত্তার সাথে কাজ করার অভ্যাস।',
      ],
      template: 'painter',
    };
  });

  const updateCvData = (updates: Partial<CVData>) => {
    setCvData((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('js_cv_data', JSON.stringify(next));
      return next;
    });
  };

  // 14. Speech Feedback
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (language === 'bn') {
      utterance.lang = 'bn-IN';
    } else if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Export / Reset
  const exportAllData = () => {
    const data = {
      user: currentUser,
      tasks,
      moneyReminders,
      documents,
      familyMembers,
      cvData,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jibonsaathi_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        currentUser,
        updateCurrentUser,
        onboardingCompleted,
        completeOnboarding,
        activeTab,
        setActiveTab,
        activeModal,
        setActiveModal,
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        moneyReminders,
        addMoneyReminder,
        toggleReminderPaid,
        deleteMoneyReminder,
        jobs,
        addJob,
        reportJob,
        workers,
        addWorkerCandidate,
        documents,
        addDocument,
        deleteDocument,
        familyMembers,
        addFamilyMember,
        deleteFamilyMember,
        notifications,
        markNotificationAsRead,
        clearNotifications,
        unreadNotificationsCount,
        cvData,
        updateCvData,
        speakText,
        stopSpeaking,
        isSpeaking,
        exportAllData,
        clearAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
