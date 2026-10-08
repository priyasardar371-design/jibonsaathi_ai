export type Language = 'bn' | 'hi' | 'en';

export type UserRole = 'worker' | 'employer' | 'individual';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  language: Language;
  avatarUrl?: string;
  location: string;
  skills?: string[];
  experienceYears?: number;
  expectedWage?: string;
  availability?: 'immediate' | 'part_time' | 'full_time';
  bio?: string;
  isGuest: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  pinLockEnabled?: boolean;
  pinCode?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'personal' | 'family' | 'finance' | 'health';
  completed: boolean;
  createdAt: string;
}

export type MoneyCategory =
  | 'EMI'
  | 'Loan'
  | 'Rent'
  | 'Electricity'
  | 'Mobile'
  | 'Internet'
  | 'School Fees'
  | 'Insurance'
  | 'Gas'
  | 'Other';

export interface MoneyReminder {
  id: string;
  title: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  reminderDate?: string;
  category: MoneyCategory;
  paid: boolean;
  paidDate?: string;
  notes?: string;
  recurring: 'none' | 'monthly' | 'quarterly' | 'yearly';
}

export type JobCategory =
  | 'Painter'
  | 'Electrician'
  | 'Plumber'
  | 'Welder'
  | 'Carpenter'
  | 'Construction worker'
  | 'Cleaner'
  | 'Delivery worker'
  | 'Warehouse worker'
  | 'Driver'
  | 'Other local jobs';

export interface Job {
  id: string;
  title: string;
  category: JobCategory;
  description: string;
  location: string; // District/Area (no private house number)
  requiredWorkers: number;
  payment: string; // e.g., ₹600/day or ₹16,000/month
  paymentType: 'daily' | 'monthly' | 'per_project';
  date: string;
  duration: string; // e.g., "3 days", "Full-time", "1 week"
  employerName: string;
  employerPhone: string;
  employerVerified: boolean;
  createdAt: string;
  isReported?: boolean;
}

export interface WorkerCandidate {
  id: string;
  name: string;
  skill: JobCategory;
  experienceYears: number;
  location: string;
  expectedWage: string;
  availability: 'immediate' | 'part_time' | 'full_time';
  phone: string;
  profilePhoto?: string;
  verified: boolean;
  rating: number;
  completedJobsCount: number;
}

export type DocumentCategory =
  | 'Aadhaar'
  | 'PAN'
  | 'Driving licence'
  | 'Voter ID'
  | 'Passport'
  | 'Certificates'
  | 'Job documents'
  | 'Vehicle documents'
  | 'Insurance documents'
  | 'Other';

export interface DocumentVaultItem {
  id: string;
  title: string;
  category: DocumentCategory;
  docNumber?: string;
  holderName?: string;
  issueDate?: string;
  expiryDate?: string;
  summary?: string;
  fileDataUri?: string; // base64 or placeholder preview
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  phone?: string;
  birthday?: string;
  notes?: string;
  isEmergencyContact: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: 'bill' | 'emi' | 'interview' | 'job' | 'document' | 'family' | 'task';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isOfficial?: boolean;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actions?: Array<{
    type: 'create_reminder' | 'create_task' | 'message_draft';
    data: any;
    executed?: boolean;
  }>;
}

export interface CVData {
  name: string;
  phone: string;
  location: string;
  education: string;
  profession: JobCategory | string;
  skills: string[];
  experience: string;
  languages: string[];
  availability: string;
  professionalSummary?: string;
  bulletHighlights?: string[];
  template: 'warehouse' | 'construction' | 'painter' | 'driver' | 'cleaner' | 'office' | 'general';
}
