/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAppState } from '../store/AppContext';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  MessageSquare,
  Sparkles,
  Scissors,
  Bot,
  AlertCircle,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { RevenueChart, PopularServicesChart, BusyTimesChart } from '../components/Charts';
import { motion } from 'motion/react';

export const DashboardView: React.FC = () => {
  const { 
    appointments, 
    barbers, 
    services, 
    whatsAppLogs, 
    updateAppointmentStatus, 
    simulateIncomingWhatsappBooking,
    currentTenant,
    setCurrentScreen
  } = useAppState();

  const [skeletonsActive, setSkeletonsActive] = useState(true);

  // Briefly show premium loading skeletons on screen mount to mimic real database fetch queries over Supabase
  useEffect(() => {
    const timer = setTimeout(() => {
      setSkeletonsActive(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [currentTenant.id]);

  // Filter models strictly belonging to current Multi-Tenant view
  const tenantAppointments = appointments.filter(a => a.tenant_id === currentTenant.id);
  const activeBarbers = barbers.filter(b => b.status === 'active' && b.tenant_id === currentTenant.id);
  const activeServices = services.filter(s => s.status === 'active' && s.tenant_id === currentTenant.id);

  // Stats derivations relative to date "2026-05-24" (today)
  const todayApts = tenantAppointments.filter(a => a.date === '2026-05-24');
  
  const completedToday = todayApts.filter(a => a.status === 'completed');
  const totalTodayCount = todayApts.length;

  // Revenue math
  const todayRevenue = todayApts
    .filter(a => a.status === 'completed' || a.status === 'confirmed')
    .reduce((sum, apt) => {
      const srv = services.find(s => s.id === apt.serviceId);
      return sum + (srv ? srv.price : 0);
    }, 0);

  // General occupancy math (8 slots per barber * active barbers)
  const totalCapacitySlots = activeBarbers.length * 8;
  const occupancyRate = totalCapacitySlots > 0 
    ? Math.round((todayApts.filter(a => a.status !== 'cancelled').length / totalCapacitySlots) * 100) 
    : 0;

  // Render Skeleton Elements inside widgets if skeletonsActive
  const renderMetricValue = (val: React.ReactNode, sub: React.ReactNode, icon: React.ReactNode, label: string) => {
    if (skeletonsActive) {
      return (
        <div className="animate-pulse flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="w-12 h-3 bg-zinc-800 rounded" />
            <div className="w-7 h-7 bg-zinc-850 rounded-lg animate-pulse" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="w-16 h-8 bg-zinc-800 rounded" />
            <div className="w-24 h-3 bg-zinc-850 rounded" />
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider font-mono text-zinc-500 font-bold">{label}</span>
          <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-400">
            {icon}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl md:text-3xl font-mono font-bold text-zinc-50 leading-none">
            {val}
          </h3>
          <p className="text-[10px] text-zinc-500 mt-1 font-sans">
            {sub}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-16">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl md:text-3xl text-zinc-50 tracking-tight">
            Seja bem-vindo, <span className="text-amber-500">Felipe</span>
          </h1>
          <p className="text-xs text-zinc-500 font-sans mt-0.5 flex items-center gap-1">
            Filial ativa: <span className="text-zinc-300 font-semibold">{currentTenant.name}</span> • Gestão automatizada e conectada via Supabase.
          </p>
        </div>

        {/* AI Quick Assistant Alert Notice */}
        <div className="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-805 text-[11px] font-sans md:max-w-xs">
          <Bot className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-zinc-400 font-semibold leading-relaxed">
            WhatsApp AI respondeu <span className="text-amber-400 font-bold">{whatsAppLogs.length} clientes</span> autonomamente hoje.
          </p>
        </div>
      </div>

      {/* METRIC GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-5">
        
        {/* Today Appointments */}
        <div id="metric-appointments" className="bg-zinc-950/45 p-4 md:p-5 rounded-xl border border-zinc-900 hover:border-zinc-800 transition-all group min-h-[125px]">
          {renderMetricValue(
            totalTodayCount,
            <span className="flex items-center gap-1">
              <span className="text-emerald-500 font-bold">+{todayApts.filter(a => a.source === 'whatsapp').length} novos</span> via WhatsApp AI
            </span>,
            <Calendar className="w-4 h-4 text-amber-500" />,
            'Agendamentos'
          )}
        </div>

        {/* Today Revenue */}
        <div id="metric-revenue" className="bg-zinc-950/45 p-4 md:p-5 rounded-xl border border-zinc-900 hover:border-zinc-800 transition-all group min-h-[125px]">
          {renderMetricValue(
            `R$ ${todayRevenue.toFixed(2)}`,
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-zinc-500" />
              <span>Receitas líquidas</span>
            </span>,
            <DollarSign className="w-4 h-4 text-emerald-450" />,
            'Faturamento'
          )}
        </div>

        {/* Clients Cleared */}
        <div id="metric-clients" className="bg-zinc-950/45 p-4 md:p-5 rounded-xl border border-zinc-900 hover:border-zinc-800 transition-all group min-h-[125px]">
          {renderMetricValue(
            `${completedToday.length} / ${totalTodayCount}`,
            <span>Clientes faturados com comanda</span>,
            <Users className="w-4 h-4 text-indigo-400" />,
            'Atendidos'
          )}
        </div>

        {/* Occupancy and Availability */}
        <div id="metric-occupancy" className="bg-zinc-950/45 p-4 md:p-5 rounded-xl border border-zinc-900 hover:border-zinc-800 transition-all group min-h-[125px]">
          {renderMetricValue(
            `${occupancyRate}%`,
            <span>Tempo operacional otimizado</span>,
            <Clock className="w-4 h-4 text-rose-455 text-rose-400" />,
            'Taxa Ocupação'
          )}
        </div>

      </div>

      {/* DUAL DASHBOARD CHART AND ONBOARDING SKELETON REPORT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Revenue Columns - occupying 2 spans */}
        <div className="lg:col-span-2 space-y-6">
          <RevenueChart />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PopularServicesChart />
            <BusyTimesChart />
          </div>
        </div>

        {/* NEXT CUSTOMERS PANEL & LIVE CHAT SUMMARY FEED */}
        <div className="space-y-6">
          
          {/* TODAY SCHEDULE TIMELINE */}
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 font-sans flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-zinc-150 font-bold text-sm text-zinc-50 tracking-tight">Atendimentos de Hoje</h3>
                <p className="text-[11px] text-zinc-500">Controle instantâneo e comandos de caixa</p>
              </div>
              <button 
                onClick={() => setCurrentScreen('calendar')}
                className="text-[11px] font-sans font-bold text-amber-500 hover:text-amber-400"
              >
                Ver Agenda
              </button>
            </div>

            <div className="space-y-3.5 flex-1 overflow-y-auto max-h-96 pr-1">
              {skeletonsActive ? (
                // Skeleton representation of rows
                <div className="space-y-3 animate-pulse">
                  {[1, 2].map(n => (
                    <div key={n} className="p-3.5 rounded-lg border border-zinc-900 bg-zinc-900/30 flex justify-between h-16">
                      <div className="space-y-2 w-2/3">
                        <div className="w-16 h-3.5 bg-zinc-800 rounded" />
                        <div className="w-24 h-3 bg-zinc-855 bg-zinc-850 rounded" />
                      </div>
                      <div className="w-12 h-6 bg-zinc-800 rounded self-center" />
                    </div>
                  ))}
                </div>
              ) : todayApts.length === 0 ? (
                /* SOPHISTICATED EMPTY STATE ONBOARDING */
                <div className="py-8 px-4 text-center text-zinc-500 border border-dashed border-zinc-850 rounded-xl flex flex-col items-center justify-center space-y-3 bg-zinc-950/40">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-650">
                    <Calendar className="w-4.5 h-4.5 text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-300">Agenda Pronta para Supabase</p>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed max-w-[220px] mx-auto">
                      Não há agendamentos agendados para hoje na filial ativa.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full pt-2">
                    <button
                      onClick={() => setCurrentScreen('calendar')}
                      className="px-3.5 py-1.8 bg-amber-500 text-zinc-950 font-bold text-[10px] rounded-lg hover:bg-amber-400 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <span>Entrar na Agenda e Criar</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={simulateIncomingWhatsappBooking}
                      className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-[9px] rounded-lg hover:text-zinc-200 hover:bg-zinc-850 flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                    >
                      <Bot className="w-3 h-3 text-amber-500" />
                      <span>Simular Agendamento Cliente IA</span>
                    </button>
                  </div>
                </div>
              ) : (
                [...todayApts]
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((apt) => {
                    const barber = barbers.find(b => b.id === apt.barberId);
                    const srv = services.find(s => s.id === apt.serviceId);
                    
                    return (
                      <div 
                        key={apt.id} 
                        className={`p-3.5 rounded-lg border flex items-center justify-between transition-colors ${
                          apt.status === 'completed' 
                            ? 'bg-zinc-900/20 border-zinc-900/60 opacity-60' 
                            : apt.status === 'cancelled'
                            ? 'bg-zinc-900/10 border-zinc-900/10 opacity-40 line-through'
                            : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="space-y-1 pr-2 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                              {apt.time}
                            </span>
                            <span className={`text-[10px] uppercase font-mono px-1 rounded-sm ${
                              apt.status === 'confirmed' 
                                ? 'bg-emerald-500/10 text-emerald-500' 
                                : apt.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-500'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}>
                              {apt.status === 'confirmed' ? 'Confirmado' : apt.status === 'pending' ? 'Pendente' : apt.status === 'completed' ? 'Atendido' : 'Cancelado'}
                            </span>
                          </div>
                          
                          <p className="text-xs font-bold text-zinc-100 truncate">{apt.customerName}</p>
                          
                          <div className="flex items-center space-x-1 text-[10px] text-zinc-500">
                            <Scissors className="w-3 h-3 text-zinc-500 shrink-0" />
                            <span className="truncate">{barber ? barber.name.split(' ')[0] : 'Profissional'}</span>
                            <span className="text-zinc-700">•</span>
                            <span className="truncate text-zinc-400">{srv ? srv.name : 'Serviço'}</span>
                          </div>
                        </div>

                        {/* Quick state mutator actions */}
                        <div className="flex items-center space-x-1.5">
                          {apt.status === 'pending' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                              className="px-2 py-1 text-[10px] font-sans font-bold bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-zinc-950 border border-amber-500/20 rounded transition-all cursor-pointer"
                            >
                              Confirmar
                            </button>
                          )}
                          {apt.status === 'confirmed' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                              className="px-2 py-1 text-[10px] font-sans font-bold bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 border border-emerald-500/20 rounded transition-all cursor-pointer"
                            >
                              Finalizar
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })
              )}
            </div>
          </div>

          {/* REALTIME IA WHATSAPP INBOX LOGS PORTLET */}
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 font-sans">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-zinc-50 font-bold text-sm tracking-tight flex items-center space-x-1">
                  <Bot className="w-4 h-4 text-amber-500" />
                  <span>Automações WhatsApp IA</span>
                </h3>
                <p className="text-[11px] text-zinc-500">Logs de disparos e interações em tempo real</p>
              </div>
              <button 
                onClick={() => setCurrentScreen('whatsapp_ai')}
                className="text-[11px] font-sans font-bold text-amber-500 hover:text-amber-400"
              >
                Ver IA Painel
              </button>
            </div>

            {/* Quick trigger logs */}
            <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
              {skeletonsActive ? (
                <div className="space-y-3.5 animate-pulse">
                  <div className="p-3 bg-zinc-900/30 rounded-lg border border-zinc-900/30 h-16 flex flex-col justify-between">
                    <div className="w-2/3 h-3 bg-zinc-800 rounded" />
                    <div className="w-1/2 h-2.5 bg-zinc-850 rounded text-transparent" />
                  </div>
                </div>
              ) : whatsAppLogs.length === 0 ? (
                /* PREMIUM ONBOARDING FOR WHATSAPP IA */
                <div className="py-8 px-4 text-center rounded-xl border border-dashed border-zinc-850 bg-zinc-950/40 text-zinc-500 flex flex-col items-center justify-center space-y-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-905 bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-500">
                    <Bot className="w-4 h-4 text-zinc-450 text-zinc-400" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-zinc-300">Integradora em Standby</h5>
                    <p className="text-[10px] text-zinc-600 mt-1 max-w-[200px] leading-relaxed mx-auto">
                      Nenhuma conversa foi processada ainda. A IA aguarda envio de mensagens de clientes reais.
                    </p>
                  </div>
                  <button
                    onClick={simulateIncomingWhatsappBooking}
                    className="mt-1 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-zinc-950 font-bold text-[9px] rounded-lg border border-amber-500/20 hover:border-transparent flex items-center justify-center space-x-1.5 transition-colors cursor-pointer animate-pulse"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Disparar Mensagem de Teste IA</span>
                  </button>
                </div>
              ) : (
                [...whatsAppLogs]
                  .slice(0, 3)
                  .map((log) => (
                    <div key={log.id} className="p-3 bg-zinc-900/30 rounded-lg border border-zinc-900 flex flex-col space-y-1.5 animate-fade-in">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold font-mono text-zinc-100">{log.customerName}</span>
                        <span className="text-[9px] font-mono text-zinc-500">
                          {new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 italic">"{log.message}"</p>
                      <div className="flex items-center justify-between text-[10px] pt-1 border-t border-zinc-900">
                        <span className="text-amber-500/80 font-mono font-bold tracking-tight">{log.action}</span>
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-emerald-500/10 text-emerald-400">
                          SUCESSO
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
            
            {whatsAppLogs.length > 0 && (
              <div className="mt-4 pt-3 border-t border-zinc-900 text-center">
                <button
                  onClick={simulateIncomingWhatsappBooking}
                  className="text-xs font-sans font-bold text-amber-500 hover:text-amber-400 flex items-center justify-center space-x-1.5 mx-auto py-1.5 px-3 bg-zinc-900 border border-zinc-800 rounded-lg group"
                >
                  <Bot className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>Gerar Simulação de Agendamento IA</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
