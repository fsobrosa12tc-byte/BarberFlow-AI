/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../store/AppContext';
import { Appointment, Barber, Service } from '../types';
import { Drawer } from '../components/Drawer';
import { 
  Calendar, 
  Clock, 
  User, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Check, 
  Phone, 
  Scissors, 
  Info,
  CalendarCheck2
} from 'lucide-react';

const HOURS_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export const CalendarView: React.FC = () => {
  const { 
    appointments, 
    barbers, 
    services, 
    createAppointment, 
    updateAppointmentStatus, 
    currentTenant, 
    showToast,
    setCurrentScreen
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'day' | 'week'>('day');
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-24'); // today's local date simulation
  const [activeBarberIdFilter, setActiveBarberIdFilter] = useState<string>('all');
  
  // Drawer models state
  const [addOpen, setAddOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);

  // Form states
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [barberId, setBarberId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [time, setTime] = useState('09:00');

  // Filter values strictly conforming to Tenant
  const tenantBarbers = barbers.filter(b => b.status === 'active' && b.tenant_id === currentTenant.id);
  const tenantServices = services.filter(s => s.status === 'active' && s.tenant_id === currentTenant.id);
  const tenantAppointments = appointments.filter(a => a.tenant_id === currentTenant.id && a.date === selectedDate);

  const handleOpenAdd = (defaultHour?: string) => {
    setCustName('');
    setCustPhone('');
    setBarberId(tenantBarbers[0]?.id || '');
    setServiceId(tenantServices[0]?.id || '');
    setTime(defaultHour || '09:00');
    setAddOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone || !barberId || !serviceId || !time) return;

    createAppointment({
      customerName: custName,
      customerPhone: custPhone,
      barberId,
      serviceId,
      date: selectedDate,
      time,
      status: 'pending',
      source: 'manual'
    });
    setAddOpen(false);
  };

  const handleOpenDetail = (apt: Appointment) => {
    setActiveAppointment(apt);
    setDetailOpen(true);
  };

  // Drag and Drop simulation feedback
  const handleSimulateDragDrop = (apt: Appointment, nextHour: string) => {
    updateAppointmentStatus(apt.id, apt.status); 
    showToast(`Reagendado: Atendimento de ${apt.customerName} movido visualmente para às ${nextHour}`, 'info');
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-16">
      
      {/* Title section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl md:text-3xl text-zinc-50 tracking-tight flex items-center space-x-2">
            <CalendarCheck2 className="w-7 h-7 text-amber-500 shrink-0" />
            <span>Agenda <span className="text-amber-500">Mestre VIP</span></span>
          </h1>
          <p className="text-xs text-zinc-500 font-sans mt-0.5">
            Fluxo operacional em grid de alta densidade para controlar cadeiras e faturamento.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Day / Week Selection tab toggles */}
          <div className="bg-zinc-900/60 p-1 rounded-lg border border-zinc-800 flex items-center">
            <button
              onClick={() => setActiveTab('day')}
              className={`px-3 py-1.5 text-xs font-sans font-bold rounded-md transition-all ${
                activeTab === 'day' 
                  ? 'bg-amber-500 text-zinc-950 font-bold' 
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Visão Diária
            </button>
            <button
              onClick={() => {
                setActiveTab('week');
                showToast('Carregando grade semanal inteligente via Supabase hooks...', 'info');
              }}
              className={`px-3 py-1.5 text-xs font-sans font-bold rounded-md transition-all ${
                activeTab === 'week' 
                  ? 'bg-amber-500 text-zinc-950 font-bold' 
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Semanal
            </button>
          </div>

          <button
            onClick={() => handleOpenAdd()}
            className="inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-zinc-950 hover:bg-amber-400 font-sans font-bold text-xs rounded-lg shadow cursor-pointer active:scale-95 transition-all"
            id="calendar-add-shortcut"
          >
            <Plus className="w-4 h-4 text-zinc-950 stroke-[3]" />
            <span className="hidden sm:inline">Manual</span>
          </button>
        </div>
      </div>

      {/* FILTER CONTROL PANEL AND DAY SWAP DIAL */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950/40 border border-zinc-900">
        
        {/* Date Selector tools */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            <button 
              onClick={() => {
                setSelectedDate('2026-05-23');
                showToast('Exibindo histórico de 23/05/2026', 'info');
              }}
              className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-zinc-100 px-3 select-none">
              {selectedDate === '2026-05-24' ? 'Hoje, 24 Mai 2026' : selectedDate === '2026-05-23' ? 'Ontem, 23 Mai 2026' : 'Amanhã, 25 Mai 2026'}
            </span>
            <button 
              onClick={() => {
                setSelectedDate('2026-05-25');
                showToast('Exibindo agendamentos para 25/05/2026', 'info');
              }}
              className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <span className="text-[10px] text-zinc-600 font-mono hidden lg:inline">UTC: 2026-05-24 23:54:49</span>
        </div>

        {/* Filter by target Barber buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs text-zinc-550 font-sans shrink-0 font-medium select-none">Filtrar Cadeira:</span>
          <button
            onClick={() => setActiveBarberIdFilter('all')}
            className={`px-3 py-1 rounded-full text-xs shrink-0 transition-all font-sans font-medium ${
              activeBarberIdFilter === 'all' 
                ? 'bg-zinc-100 text-zinc-950 font-semibold' 
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100'
            }`}
          >
            Todos
          </button>
          {tenantBarbers.map(barb => (
            <button
              key={barb.id}
              onClick={() => setActiveBarberIdFilter(barb.id)}
              className={`px-3 py-1 rounded-full text-xs shrink-0 transition-all font-sans font-medium ${
                activeBarberIdFilter === barb.id 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-550/20 font-semibold' 
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100'
              }`}
            >
              {barb.name.split(' ')[0]}
            </button>
          ))}
        </div>

      </div>

      {/* RENDER DYNAMIC AGENDA GRID OR LISTS IN COMPLIANCE WITH ACTIVE MODALS */}
      <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl overflow-hidden font-sans">
        
        {/* Day Header columns depending on filter */}
        <div className="bg-zinc-900/40 p-4 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-xs uppercase font-mono font-bold tracking-widest text-zinc-300">Grade Operacional</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            {activeBarberIdFilter === 'all' ? 'Exibindo todos os barbeiros ativos' : `Filtrado por Barbeiro`}
          </span>
        </div>

        {/* Hour Blocks Loop */}
        <div className="divide-y divide-zinc-900">
          {tenantBarbers.length === 0 ? (
            <div className="py-20 px-6 text-center flex flex-col items-center justify-center space-y-4 max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-500 shadow-md">
                <Calendar className="w-5 h-5 text-amber-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-zinc-100 font-sans">Grade suspensa temporariamente</h4>
                <p className="text-xs text-zinc-500 leading-relaxed font-sans mt-0.5">
                  Não há barbeiros ativos na filial <span className="text-zinc-350 font-bold">{currentTenant.name}</span>. Você precisa cadastrar profissionais para liberar a grade diária operacional.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentScreen('barbers')}
                className="px-4 py-2 bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl hover:bg-amber-400 cursor-pointer font-sans shadow-lg shadow-amber-500/10 transition-all duration-150 active:scale-95"
              >
                Cadastrar Primeiro Barbeiro
              </button>
            </div>
          ) : (
            HOURS_SLOTS.map((hour) => {
            
            // Get appointments fall on this exact hour slot
            const hourAppointments = tenantAppointments.filter(apt => {
              const matchedHour = apt.time.startsWith(hour.slice(0, 3));
              const matchesBarber = activeBarberIdFilter === 'all' || apt.barberId === activeBarberIdFilter;
              return matchedHour && matchesBarber && apt.status !== 'cancelled';
            });

            return (
              <div key={hour} className="flex min-h-[80px] group/row relative hover:bg-zinc-900/10 transition-colors">
                
                {/* Time Indicator column */}
                <div className="w-16 md:w-24 shrink-0 p-4 border-r border-zinc-900 font-mono text-xs font-bold text-zinc-500 flex items-start pt-4 justify-center select-none bg-zinc-950/20">
                  {hour}
                </div>

                {/* Right side scheduling content slot */}
                <div className="flex-1 p-2 md:p-3 relative flex flex-wrap gap-3 items-center min-w-0">
                  
                  {hourAppointments.length === 0 ? (
                    // Empty slot placeholder
                    <button
                      onClick={() => handleOpenAdd(hour)}
                      style={{ contentVisibility: 'auto' }}
                      className="opacity-0 group-hover/row:opacity-100 absolute inset-0 w-full h-full flex items-center justify-center space-x-1.5 text-zinc-500 text-xs font-sans bg-zinc-900/40 border border-dashed border-zinc-800 hover:text-amber-500 hover:bg-amber-500/5 transition-all duration-200 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Agendar no horário de {hour}</span>
                    </button>
                  ) : (
                    // Loop scheduled appointments inside this hour column
                    hourAppointments.map((apt) => {
                      const matchedBarber = barbers.find(b => b.id === apt.barberId);
                      const matchedService = services.find(s => s.id === apt.serviceId);

                      return (
                        <div
                          key={apt.id}
                          onClick={() => handleOpenDetail(apt)}
                          className={`flex-1 min-w-[200px] p-3 rounded-xl border flex items-center justify-between text-left transition-all duration-150 shadow-sm cursor-pointer select-none ring-offset-zinc-950 hover:ring-1 hover:ring-zinc-700 ${
                            apt.status === 'completed'
                              ? 'bg-zinc-900/20 border-zinc-900/80'
                              : 'bg-zinc-900 border-zinc-850 hover:bg-zinc-900/70 hover:border-zinc-700'
                          }`}
                        >
                          <div className="space-y-1 pr-2 min-w-0">
                            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                              
                              <span className="text-[10px] uppercase font-mono font-bold text-amber-500 bg-amber-500/10 px-1 py-0.2 rounded-sm select-none">
                                {apt.time}
                              </span>

                              <span className={`text-[9px] uppercase font-mono font-extrabold px-1.5 py-0.2 rounded-sm tracking-wide ${
                                apt.status === 'confirmed' 
                                  ? 'bg-emerald-500/10 text-emerald-400' 
                                  : apt.status === 'pending'
                                  ? 'bg-amber-500/15 text-amber-400'
                                  : 'bg-zinc-800 text-zinc-500'
                              }`}>
                                {apt.status === 'confirmed' ? 'Confirmado' : apt.status === 'pending' ? 'Pendente' : 'Atendido'}
                              </span>

                              <span className="text-[9px] font-mono text-zinc-650 tracking-tight uppercase">
                                Via {apt.source === 'whatsapp' ? 'WhatsApp IA' : 'Portal'}
                              </span>

                            </div>

                            <p className="text-xs font-bold text-zinc-100 truncate">{apt.customerName}</p>

                            <div className="flex items-center space-x-1.5 text-[10px] text-zinc-400">
                              <span className="truncate text-zinc-500 font-medium">Cadeira de:</span>
                              <span className="truncate text-zinc-300 font-bold max-w-[100px]">{matchedBarber ? matchedBarber.name.split(' ')[0] : 'Profissional'}</span>
                              <span className="text-zinc-700">•</span>
                              <span className="truncate text-amber-500/80 font-semibold">{matchedService ? matchedService.name : 'Corte'}</span>
                            </div>
                          </div>

                          {/* Fake Drag and Drop trigger handle icon for user interact */}
                          <div 
                            title="Simular Reajuste de Horário (Segurar e arrastar)" 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Shift schedule forward by 1 hour as an interact mockup
                              const currentHourIdx = HOURS_SLOTS.indexOf(hour);
                              const nextHourSlot = HOURS_SLOTS[currentHourIdx + 1] || '20:00';
                              handleSimulateDragDrop(apt, nextHourSlot);
                            }}
                            className="p-1 px-1.5 hover:bg-zinc-850 rounded text-zinc-600 hover:text-amber-500 transition-colors text-xs select-none"
                          >
                            ↕ Move
                          </div>

                        </div>
                      );
                    })
                  )}

                </div>

              </div>
            );
          })
         )}
        </div>

      </div>

      {/* DRAWER MANUALLY SCHEDULE APPOINTMENT FORM */}
      <Drawer
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Novo Agendamento Manual"
        description={`Crie uma nova reserva na grade de atendimento diretamente via balcão.`}
      >
        <form onSubmit={handleCreateSubmit} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400">Nome do Cliente</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-600">
                <User className="w-4 h-4 text-zinc-500" />
              </span>
              <input
                type="text"
                required
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                placeholder="Ex: Carlos Nogueira"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-lg text-sm text-zinc-200 outline-none transition-colors"
                id="calendar-form-name"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400">Celular WhatsApp do Cliente</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-600">
                <Phone className="w-4 h-4 text-zinc-500" />
              </span>
              <input
                type="text"
                required
                value={custPhone}
                onChange={(e) => setCustPhone(e.target.value)}
                placeholder="Ex: (11) 98888-7777"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-lg text-sm text-zinc-200 outline-none transition-colors"
                id="calendar-form-phone"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Horário</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-lg text-sm text-zinc-200 outline-none cursor-pointer"
                id="calendar-form-time"
              >
                {HOURS_SLOTS.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Barbeiro</label>
              <select
                value={barberId}
                onChange={(e) => setBarberId(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-lg text-sm text-zinc-200 outline-none cursor-pointer"
                id="calendar-form-barbers"
              >
                {tenantBarbers.map(barb => (
                  <option key={barb.id} value={barb.id}>{barb.name}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400">Serviço / Combo Escolhido</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-lg text-sm text-zinc-200 outline-none cursor-pointer"
              id="calendar-form-services"
            >
              {tenantServices.map(srv => (
                <option key={srv.id} value={srv.id}>{srv.name} (R$ {srv.price.toFixed(2)})</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 font-bold rounded-lg text-sm transition-all shadow-lg active:scale-98 cursor-pointer"
            id="calendar-form-submit"
          >
            Salvar Agendamento
          </button>

        </form>
      </Drawer>

      {/* DRAWER DETAILED APPOINTMENT DETAILS PANEL */}
      <Drawer
        isOpen={detailOpen && !!activeAppointment}
        onClose={() => setDetailOpen(false)}
        title="Detalhes do Atendimento"
        description="Controle de comanda e comandamento de status."
      >
        {activeAppointment && (() => {
          const matchedBarb = barbers.find(b => b.id === activeAppointment.barberId);
          const matchedSrv = services.find(s => s.id === activeAppointment.serviceId);

          return (
            <div className="space-y-6">
              
              <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 space-y-4">
                
                <div className="flex justify-between items-center pb-3 border-b border-zinc-900">
                  <span className="text-xs font-mono text-zinc-550">DATA & SLOT HORAL</span>
                  <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded">
                    {activeAppointment.time} • {activeAppointment.date}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">CLIENTE</span>
                  <h4 className="text-md font-extrabold text-zinc-50">{activeAppointment.customerName}</h4>
                  <p className="text-xs text-zinc-400 font-mono">{activeAppointment.customerPhone}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">PROFISSIONAL</span>
                    <p className="text-xs font-semibold text-zinc-200">{matchedBarb?.name || 'Profissional'}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">SERVIÇO</span>
                    <p className="text-xs font-semibold text-zinc-200">{matchedSrv?.name || 'Serviço'}</p>
                    <p className="text-[10px] text-amber-400 font-mono font-bold">R$ {matchedSrv?.price.toFixed(2) || '0.00'}</p>
                  </div>
                </div>

              </div>

              {/* Commands statuses buttons */}
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-zinc-400">Alterar Status do Atendimento:</span>
                
                <div className="grid grid-cols-2 gap-2">
                  {activeAppointment.status !== 'completed' && (
                    <button
                      onClick={() => {
                        updateAppointmentStatus(activeAppointment.id, 'completed');
                        setDetailOpen(false);
                      }}
                      className="py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-sans font-bold text-xs rounded-lg transition-all text-center flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Atendido (Faturar)</span>
                    </button>
                  )}

                  {activeAppointment.status !== 'confirmed' && activeAppointment.status !== 'completed' && (
                    <button
                      onClick={() => {
                        updateAppointmentStatus(activeAppointment.id, 'confirmed');
                        setDetailOpen(false);
                      }}
                      className="py-2.5 px-3 bg-zinc-900 hover:bg-zinc-805 text-zinc-200 border border-zinc-800 font-sans text-xs rounded-lg transition-all text-center cursor-pointer"
                    >
                      Confirmar Vaga
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    updateAppointmentStatus(activeAppointment.id, 'cancelled');
                    setDetailOpen(false);
                  }}
                  className="w-full py-2.5 bg-zinc-950 hover:bg-rose-950/20 text-zinc-500 hover:text-rose-400 border border-zinc-900 hover:border-rose-955/20 text-xs font-bold rounded-lg transition-all cursor-pointer"
                >
                  Cancelar Agendamento
                </button>

              </div>

            </div>
          );
        })()}
      </Drawer>

    </div>
  );
};
