/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../store/AppContext';
import { Bell, ShieldCheck, RefreshCw, MessageSquareCode, Scissors, ChevronDown, UserCheck, Menu } from 'lucide-react';

export const Topbar: React.FC = () => {
  const { 
    user, 
    currentTenant, 
    tenants, 
    setTenantById, 
    simulateIncomingWhatsappBooking,
    appointments,
    whatsAppLogs,
    currentScreen,
    setCurrentScreen,
    mobileMenuOpen,
    setMobileMenuOpen
  } = useAppState();

  const [tenantOpen, setTenantOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  if (!user) return null;

  // Unread logs from Whatsapp
  const successLogsCount = whatsAppLogs.filter(log => log.status === 'success').length;

  return (
    <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 h-16 flex items-center justify-between px-4 md:px-8 z-40">
      
      {/* Mobile Branding / Title */}
      <div className="flex items-center space-x-3.5 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-zinc-400 hover:text-amber-500 focus:outline-none transition-all cursor-pointer"
          title="Abrir Menu"
        >
          <Menu className="w-5 h-5 stroke-[2]" />
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-md bg-amber-500 flex items-center justify-center shadow-[0_0_10px_rgba(197,160,89,0.2)]">
            <Scissors className="w-3.5 h-3.5 text-zinc-950 stroke-[2.5]" />
          </div>
          <span className="font-sans font-bold text-sm text-zinc-50 uppercase tracking-tight">
            Barber<span className="text-amber-500">Flow</span>
          </span>
        </div>
      </div>

      {/* Tenant Selector (Desktop-friendly, custom dropdown) */}
      <div className="hidden md:relative md:block">
        <button
          onClick={() => setTenantOpen(!tenantOpen)}
          className="flex items-center space-x-2 px-3.5 py-1.8 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-sans font-medium transition-all cursor-pointer"
          id="tenant-dropdown-trigger"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="truncate max-w-[180px]">{currentTenant.name}</span>
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        </button>

        {tenantOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setTenantOpen(false)} />
            <div className="absolute left-0 mt-2 w-64 bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl z-20 py-1.5 overflow-hidden">
              <div className="px-3 py-1.5 text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                Alternar Filial (Multi-Tenant)
              </div>
              {tenants.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTenantById(t.id);
                    setTenantOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs font-sans transition-colors cursor-pointer ${
                    t.id === currentTenant.id 
                      ? 'bg-zinc-850 text-amber-500 font-bold' 
                      : 'text-zinc-500 hover:text-zinc-100 hover:bg-zinc-850'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="truncate font-bold text-xs">{t.name}</p>
                    <p className="text-[9px] text-zinc-500 font-mono truncate">{t.city || 'São Paulo'}</p>
                  </div>
                  {t.id === currentTenant.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Action panel (WApp dynamic simulator, Sync state indicator & Notifications) */}
      <div className="flex items-center space-x-3 md:space-x-4">
        
        {/* IA Whatsapp Simulator Launcher (Action tool requested by structure) */}
        <button
          onClick={simulateIncomingWhatsappBooking}
          className="relative inline-flex items-center space-x-1.5 md:space-x-2 px-3.5 py-2 rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 text-xs font-sans font-bold shadow-[0_0_15px_rgba(197,160,89,0.25)] transition-all cursor-pointer overflow-hidden border border-amber-600/10 active:scale-95"
          title="Dispara um agendamento fictício simulando mensagem do cliente via WhatsApp interceptada pela IA"
          id="simulate-ai-booking-button"
        >
          <MessageSquareCode className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Simular Agendamento IA</span>
          <span className="inline-flex w-1.5 h-1.5 rounded-full bg-zinc-950 animate-ping absolute right-1 top-1 sm:hidden" />
        </button>

        {/* Real-time Status Badge (Supabase RLS Ready indicator) */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Realtime Conectado</span>
        </div>

        {/* Booking Portal Link shortcut */}
        <button
          onClick={() => setCurrentScreen('booking_portal')}
          className={`p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors relative ${
            currentScreen === 'booking_portal' ? 'text-amber-500 bg-zinc-900' : ''
          }`}
          title="Ver Portal do Cliente"
        >
          <UserCheck className="w-4 h-4" />
        </button>

        {/* Notifications and Alerts trigger */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="p-2 rounded-lg bg-zinc-900/60 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-zinc-800/80 transition-colors relative"
            id="notification-bell"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-zinc-950 animate-pulse" />
          </button>

          {notificationOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotificationOpen(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-zinc-950 border border-zinc-900 rounded-lg shadow-2xl z-20 overflow-hidden">
                <div className="px-4 py-3 bg-zinc-900/50 border-b border-zinc-900 flex justify-between items-center">
                  <span className="font-sans font-bold text-xs text-zinc-200">Notificações Inteligentes AI</span>
                  <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-500">
                    Supabase Hook
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-zinc-900">
                  <div className="p-3 hover:bg-zinc-900/30 transition-colors">
                    <p className="text-xs text-zinc-200 font-sans font-medium">✨ Automação ativa!</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Integrado com WhatsApp API de forma autônoma.</p>
                  </div>
                  {appointments.slice(0, 3).map((apt, index) => (
                    <div key={apt.id} className="p-3 hover:bg-zinc-900/20 transition-colors">
                      <p className="text-xs text-zinc-300 font-sans">
                        <span className="font-semibold text-zinc-100">{apt.customerName}</span> agendou{' '}
                        <span className="text-amber-500/90">{apt.time} - {apt.date}</span>
                      </p>
                      <p className="text-[9px] text-zinc-600 mt-0.5 font-mono uppercase">
                        Via {apt.source === 'whatsapp' ? 'WhatsApp IA' : apt.source === 'public_link' ? 'Portal Online' : 'Manual'}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 bg-zinc-900/50 text-center border-t border-zinc-900">
                  <button 
                    onClick={() => {
                      setCurrentScreen('whatsapp_ai');
                      setNotificationOpen(false);
                    }}
                    className="text-[11px] font-sans font-medium text-amber-500 hover:text-amber-400"
                  >
                    Ver Logs Completos da IA
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
};
