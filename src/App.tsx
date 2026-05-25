/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useAppState } from './store/AppContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { NotificationToast } from './components/NotificationToast';

// Core Screens
import { AuthView } from './views/AuthView';
import { DashboardView } from './views/DashboardView';
import { CalendarView } from './views/CalendarView';
import { BarberView } from './views/BarberView';
import { ServiceView } from './views/ServiceView';
import { BookingView } from './views/BookingView';
import { WhatsappView } from './views/WhatsappView';
import { SettingsView } from './views/SettingsView';

const MainAppContent: React.FC = () => {
  const { user, currentScreen } = useAppState();

  // If no session, display user login / registration signup screen
  if (!user) {
    return (
      <>
        <AuthView />
        <NotificationToast />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-zinc-950">
      
      {/* Visual Stripe Accent at top */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700/80 z-50 pointer-events-none" />

      {/* Modern responsive sidebar */}
      <Sidebar />

      {/* Right Column Core Body */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        
        {/* Topbar navigation panel */}
        <Topbar />

        {/* Scrollable dynamic container */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-28 md:pb-12 focus:outline-none">
          
          {/* Central SPA view routing switcher */}
          {currentScreen === 'dashboard' && <DashboardView />}
          {currentScreen === 'calendar' && <CalendarView />}
          {currentScreen === 'barbers' && <BarberView />}
          {currentScreen === 'services' && <ServiceView />}
          {currentScreen === 'whatsapp_ai' && <WhatsappView />}
          {currentScreen === 'booking_portal' && <BookingView />}
          {currentScreen === 'settings' && <SettingsView />}

        </main>

      </div>

      {/* Global alert notifications portal */}
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
