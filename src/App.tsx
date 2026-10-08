import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { WorkView } from './components/WorkView';
import { AIChatView } from './components/AIChatView';
import { TasksView } from './components/TasksView';
import { ProfileView } from './components/ProfileView';

// Modals
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { SOSModal } from './components/SOSModal';
import { UniversalSearchModal } from './components/UniversalSearchModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { OnboardingModal } from './components/OnboardingModal';
import { AIMessageWriterModal } from './components/AIMessageWriterModal';
import { CVBuilderModal } from './components/CVBuilderModal';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Mobile-First App Bar */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-md mx-auto relative">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'work' && <WorkView />}
        {activeTab === 'ai' && <AIChatView />}
        {activeTab === 'tasks' && <TasksView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Bottom Sticky Navigation */}
      <BottomNav />

      {/* Global Modals & Sheets */}
      <VoiceAssistantModal />
      <SOSModal />
      <UniversalSearchModal />
      <NotificationDrawer />
      <OnboardingModal />
      <AIMessageWriterModal />
      <CVBuilderModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
