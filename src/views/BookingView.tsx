/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../store/AppContext';
import { Service, Barber } from '../types';
import { 
  Sparkles, 
  User, 
  CalendarDays, 
  Clock, 
  CheckCircle, 
  UserCheck, 
  ArrowLeft, 
  ArrowRight,
  Phone,
  Gift,
  CalendarCheck2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Single customer booking step wizard
type BookingStep = 'service' | 'barber' | 'datetime' | 'confirm' | 'success';

export const BookingView: React.FC = () => {
  const { barbers, services, createAppointment, currentTenant, showToast } = useAppState();

  const [step, setStep] = useState<BookingStep>('service');
  
  // Selection States
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-24');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Contacts inputs
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Local active filters strictly for Multi-tenant
  const activeServices = services.filter(s => s.status === 'active' && s.tenant_id === currentTenant.id);
  const activeBarbers = barbers.filter(b => b.status === 'active' && b.tenant_id === currentTenant.id);

  // Time slots for public
  const publicSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  const datesOptions = [
    { value: '2026-05-24', label: 'Hoje, Dom 24' },
    { value: '2026-05-25', label: 'Segunda, 25' },
    { value: '2026-05-26', label: 'Terça, 26' },
    { value: '2026-05-27', label: 'Quarta, 27' }
  ];

  const handleNextToBarber = () => {
    if (!selectedService) {
      showToast('Por favor, selecione um serviço para continuar.', 'error');
      return;
    }
    setStep('barber');
  };

  const handleNextToDateTime = () => {
    if (!selectedBarber) {
      showToast('Por favor, escolha seu barbeiro profissional favorito.', 'error');
      return;
    }
    setStep('datetime');
  };

  const handleNextToConfirm = () => {
    if (!selectedTime) {
      showToast('Escolha um horário de preferência.', 'error');
      return;
    }
    setStep('confirm');
  };

  const handleFinalizeBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      showToast('Insira seu nome completo e celular WhatsApp.', 'error');
      return;
    }

    createAppointment({
      customerName,
      customerPhone,
      barberId: selectedBarber!.id,
      serviceId: selectedService!.id,
      date: selectedDate,
      time: selectedTime,
      status: 'pending',
      source: 'public_link'
    });

    setStep('success');
  };

  const handleRestart = () => {
    setSelectedService(null);
    setSelectedBarber(null);
    setSelectedTime('');
    setCustomerName('');
    setCustomerPhone('');
    setStep('service');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 animate-fade-in pb-16">
      
      {/* Branding top bar */}
      <div className="text-center space-y-2">
        <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full font-bold">
          Portal de Reserva On-line do Cliente
        </span>
        <h1 className="font-sans font-extrabold text-2xl md:text-3xl text-zinc-50 tracking-tight">
          Agende seu Estilo no <span className="text-amber-500">{currentTenant.name.split(' ')[0]}</span>
        </h1>
        <p className="text-xs text-zinc-500 font-sans max-w-sm mx-auto">
          Passos rápidos para garantir seu horário com confirmação direta e lembretes WhatsApp.
        </p>
      </div>

      {/* STEPPERS GRAPH HEADER */}
      {step !== 'success' && (
        <div className="grid grid-cols-4 gap-1 select-none">
          {([
            { key: 'service', label: '1. Serviço' },
            { key: 'barber', label: '2. Barbeiro' },
            { key: 'datetime', label: '3. Data & Hora' },
            { key: 'confirm', label: '4. Confirmação' }
          ] as const).map((s, idx) => {
            const stepsOrder = ['service', 'barber', 'datetime', 'confirm'];
            const currentIdx = stepsOrder.indexOf(step);
            const myIdx = stepsOrder.indexOf(s.key);
            const active = stepsOrder[currentIdx] === s.key;
            const done = myIdx < currentIdx;

            return (
              <div 
                key={s.key} 
                className={`py-2 text-center border-t-2 text-[10px] md:text-xs font-sans font-bold transition-all ${
                  active 
                    ? 'border-amber-500 text-amber-500' 
                    : done 
                    ? 'border-emerald-500 text-emerald-400' 
                    : 'border-zinc-900 text-zinc-500'
                }`}
              >
                {s.label}
              </div>
            );
          })}
        </div>
      )}

      {/* CORE STEPS PANELS CONTAINER */}
      <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-5 md:p-8 relative overflow-hidden shadow-2xl min-h-[350px] flex flex-col justify-between">
        
        <AnimatePresence mode="wait">
          {/* STEP 1: SELECT SERVICE */}
          {step === 'service' && (
            <motion.div
              key="step-service"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <h3 className="text-zinc-50 font-bold text-sm tracking-tight flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Escolha o Serviço Desejado</span>
              </h3>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {activeServices.length === 0 ? (
                  <div className="py-14 text-center space-y-4 max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-500">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-250 font-sans">Portifólio em Configuração</p>
                      <p className="text-[11px] text-zinc-500 leading-relaxed font-sans mt-1">
                        Esta unidade da barbearia ainda não configurou serviços online. Acesse o painel administrativo para cadastrar cortes e barbas.
                      </p>
                    </div>
                  </div>
                ) : (
                  activeServices.map((srv) => {
                    const isSelected = selectedService?.id === srv.id;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => setSelectedService(srv)}
                        className={`w-full p-4 rounded-xl border font-sans text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected 
                            ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 font-bold ring-1 ring-amber-500/40' 
                            : 'bg-zinc-900/40 border-zinc-900 hover:border-zinc-800 text-zinc-200'
                        }`}
                        id={`booking-service-select-${srv.id}`}
                      >
                        <div className="space-y-1 pr-3">
                          <p className="text-xs font-bold">{srv.name}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">Duração de {srv.duration} min. Atendimento individual.</p>
                        </div>
                        <span className="text-sm font-mono font-bold shrink-0 text-amber-505">
                          R$ {srv.price.toFixed(2)}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextToBarber}
                  className="px-5 py-2.5 bg-amber-500 text-zinc-950 hover:bg-amber-400 text-xs font-sans font-bold rounded-lg cursor-pointer flex items-center space-x-2 shadow"
                  id="booking-service-next"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: SELECT BARBER */}
          {step === 'barber' && (
            <motion.div
              key="step-barber"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <h3 className="text-zinc-50 font-bold text-sm tracking-tight flex items-center space-x-2">
                <User className="w-4 h-4 text-amber-500" />
                <span>Escolha o Profissional / Cadeira</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-1">
                {activeBarbers.map((barber) => {
                  const isSelected = selectedBarber?.id === barber.id;
                  return (
                    <button
                      key={barber.id}
                      type="button"
                      onClick={() => setSelectedBarber(barber)}
                      className={`p-4 rounded-xl border text-left transition-all flex items-center space-x-3.5 cursor-pointer ${
                        isSelected 
                          ? 'bg-amber-500/10 border-amber-500/55 text-amber-500 ring-1 ring-amber-500/30' 
                          : 'bg-zinc-900/40 border-zinc-900 hover:border-zinc-800'
                      }`}
                      id={`booking-barber-select-${barber.id}`}
                    >
                      <img 
                        src={barber.avatar} 
                        alt={barber.name} 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-zinc-800" 
                      />
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="text-xs font-bold text-zinc-100 truncate">{barber.name}</p>
                        <p className="text-[10px] text-zinc-500 truncate line-clamp-1">{barber.specialty}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep('service')}
                  className="px-4 py-2 border border-zinc-900 hover:border-zinc-805 text-zinc-400 hover:text-zinc-100 text-xs font-sans rounded-lg cursor-pointer flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleNextToDateTime}
                  className="px-5 py-2.5 bg-amber-500 text-zinc-950 hover:bg-amber-400 text-xs font-sans font-bold rounded-lg cursor-pointer flex items-center space-x-2 shadow"
                  id="booking-barber-next"
                >
                  <span>Escolha o Horário</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SELECT DATE & TIME */}
          {step === 'datetime' && (
            <motion.div
              key="step-datetime"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <h3 className="text-zinc-50 font-bold text-sm tracking-tight flex items-center space-x-2">
                <CalendarDays className="w-4 h-4 text-amber-500" />
                <span>Selecione a Data de Visita</span>
              </h3>

              {/* Day selection */}
              <div className="grid grid-cols-4 gap-2">
                {datesOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedDate(opt.value)}
                    className={`py-2 p-1.5 rounded-lg border text-[11px] md:text-xs font-sans text-center cursor-pointer transition-colors font-medium ${
                      selectedDate === opt.value 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold' 
                        : 'bg-zinc-900/60 border-zinc-900 hover:border-zinc-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <h3 className="text-zinc-50 font-bold text-sm tracking-tight pt-4 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Slots de Horários Livres</span>
              </h3>

              {/* Time selection */}
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.8 max-h-48 overflow-y-auto pr-1">
                {publicSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 rounded text-[11px] font-mono select-none text-center border cursor-pointer transition-colors ${
                      selectedTime === time 
                        ? 'bg-amber-500 border-amber-505 text-zinc-950 font-bold' 
                        : 'bg-zinc-900 border-zinc-900 hover:border-zinc-805 text-zinc-400 hover:text-zinc-100'
                    }`}
                    id={`booking-time-select-${time}`}
                  >
                    {time}
                  </button>
                ))}
              </div>

              <div className="pt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep('barber')}
                  className="px-4 py-2 border border-zinc-900 hover:border-zinc-800 text-zinc-400 text-xs font-sans rounded-lg cursor-pointer flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleNextToConfirm}
                  className="px-5 py-2.5 bg-amber-500 text-zinc-950 hover:bg-amber-400 text-xs font-sans font-bold rounded-lg cursor-pointer flex items-center space-x-2 shadow"
                  id="booking-time-next"
                >
                  <span>Revisar Agendamento</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: CONFIRM DATA FORM */}
          {step === 'confirm' && (
            <motion.div
              key="step-confirm"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <h3 className="text-zinc-50 font-bold text-sm tracking-tight flex items-center space-x-2 mb-2">
                <UserCheck className="w-4 h-4 text-amber-500" />
                <span>Revisão do Lançamento</span>
              </h3>

              {/* Review card */}
              <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-900 space-y-3 font-sans">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-900">
                  <span className="text-zinc-500 font-mono">SERVIÇO & COMBO</span>
                  <span className="font-bold text-amber-505 font-mono">R$ {selectedService?.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-200 font-bold">{selectedService?.name}</span>
                  <span className="text-zinc-400 font-mono">{selectedService?.duration} min</span>
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-zinc-900/60">
                  <span className="text-zinc-500">Cadeira do Barbeiro</span>
                  <span className="text-zinc-250 font-bold">{selectedBarber?.name}</span>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-zinc-500">Data e Hora Escolhida</span>
                  <span className="text-amber-500 font-mono font-bold bg-amber-500/10 px-1.5 py-0.5 rounded text-[10px]">
                    {selectedTime} • {selectedDate}
                  </span>
                </div>
              </div>

              {/* Inputs Form */}
              <form onSubmit={handleFinalizeBooking} className="space-y-3.5 pt-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-400 font-sans">Seu Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Carlos Mello"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-lg text-sm text-zinc-200 outline-none transition-all"
                    id="booking-input-customer-name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-400 font-sans">Seu WhatsApp de Contato</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-700">
                      <Phone className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Ex: (11) 99999-8888"
                      className="w-full pl-9 pr-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-lg text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-all"
                      id="booking-input-customer-phone"
                    />
                  </div>
                </div>

                <div className="pt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep('datetime')}
                    className="px-4 py-2 border border-zinc-900 hover:border-zinc-800 text-zinc-400 text-xs font-sans rounded-lg cursor-pointer flex items-center space-x-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Voltar</span>
                  </button>
                  
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 text-zinc-950 font-bold text-xs font-sans rounded-lg cursor-pointer shadow-lg active:scale-98 transition-all"
                    id="booking-form-finalize"
                  >
                    Confirmar Agendamento On-line
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 5: SUCCESS CONFIRMED (CONFETTI ANIMATION PREVIEW) */}
          {step === 'success' && (
            <motion.div
              key="step-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-5"
            >
              {/* Spinning or pulsing Check icon */}
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <CheckCircle className="w-10 h-10 text-emerald-400 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-md font-extrabold text-zinc-50 font-sans">Agendamento Solicitado!</h3>
                <p className="text-xs text-zinc-400 font-sans max-w-sm mx-auto">
                  Prontinho, <span className="text-zinc-100 font-bold">{customerName}</span>. O barbeiro <span className="text-zinc-100 font-bold">{selectedBarber?.name.split(' ')[0]}</span> já foi notificado.
                </p>
              </div>

              {/* Success summary micro card */}
              <div className="p-4 p-3.5 bg-zinc-950 max-w-sm mx-auto rounded-xl border border-zinc-900 font-mono text-[11px] text-zinc-400 space-y-2">
                <div className="flex justify-between">
                  <span>SERVIÇO:</span>
                  <span className="text-zinc-200 font-bold">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>VALOR:</span>
                  <span className="text-amber-550 font-bold">R$ {selectedService?.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>HORÁRIO:</span>
                  <span className="text-zinc-200">{selectedTime} • {selectedDate}</span>
                </div>
              </div>

              <div className="pt-4 space-y-3 max-w-xs mx-auto">
                <div className="text-[10px] font-sans font-bold text-emerald-450 text-emerald-400 bg-emerald-550/10 px-3 py-1 rounded inline-flex items-center space-x-1.5 justify-center">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Comprovante enviado no seu WhatsApp!</span>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 font-sans text-xs font-bold text-zinc-300 hover:text-zinc-100 rounded-lg transition-all cursor-pointer"
                  >
                    Novo Agendamento
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
};
