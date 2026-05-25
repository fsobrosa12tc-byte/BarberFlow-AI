/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { useAppState } from '../store/AppContext';
import { Barber } from '../types';
import { Drawer } from '../components/Drawer';
import { 
  UserPlus, 
  Scissors, 
  Star, 
  Phone, 
  Clock, 
  ShieldAlert, 
  UserRound,
  CheckCircle2,
  XCircle,
  Sparkles,
  Camera
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200'
];

export const BarberView: React.FC = () => {
  const { barbers, addBarber, updateBarber, toggleBarberStatus, currentTenant } = useAppState();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0]);
  const [workingHours, setWorkingHours] = useState<string[]>([
    '09:00', '10:00', '11:05', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ]);

  // Filter local barbers by tenant_id
  const tenantBarbers = barbers.filter(b => b.tenant_id === currentTenant.id);

  const handleOpenAdd = () => {
    setSelectedBarber(null);
    setName('');
    setSpecialty('');
    setPhone('');
    setAvatar(AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)]);
    setWorkingHours(['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (barber: Barber) => {
    setSelectedBarber(barber);
    setName(barber.name);
    setSpecialty(barber.specialty);
    setPhone(barber.phone);
    setAvatar(barber.avatar);
    setWorkingHours(barber.workingHours);
    setDrawerOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !specialty || !phone) return;

    if (selectedBarber) {
      // Edit
      updateBarber(selectedBarber.id, {
        name,
        specialty,
        phone,
        avatar,
        workingHours
      });
    } else {
      // Add
      addBarber({
        name,
        specialty,
        phone,
        avatar,
        status: 'active',
        rating: 5.0,
        workingHours
      });
    }
    setDrawerOpen(false);
  };

  const toggleHour = (hour: string) => {
    if (workingHours.includes(hour)) {
      setWorkingHours(prev => prev.filter(h => h !== hour));
    } else {
      setWorkingHours(prev => [...prev, hour].sort());
    }
  };

  const availableHoursList = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:05', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-16">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl md:text-3xl text-zinc-50 tracking-tight">
            Gerenciamento de <span className="text-amber-500">Barbeiros</span>
          </h1>
          <p className="text-xs text-zinc-500 font-sans mt-0.5">
            Cadastre, edite horários e module a agenda de seus profissionais.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 font-sans font-bold text-xs shadow-lg shadow-amber-500/10 cursor-pointer active:scale-95 transition-all"
          id="barber-add-button"
        >
          <UserPlus className="w-4 h-4 text-zinc-950" />
          <span>Cadastrar Barbeiro</span>
        </button>
      </div>
      {/* Grid List displaying barbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tenantBarbers.length === 0 ? (
          <div className="md:col-span-2 xl:col-span-3 py-16 px-6 text-center border border-dashed border-zinc-850 rounded-2xl flex flex-col items-center justify-center space-y-4 bg-zinc-950/30 max-w-lg mx-auto w-full">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-500 shadow-md">
              <Scissors className="w-5 h-5 text-amber-500 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-sans font-bold text-base text-zinc-100">Configurar Equipe de Atendimento</h3>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
                Não há barbeiros ativos na filial <span className="text-zinc-350 font-bold">{currentTenant.name}</span>. Registre profissionais para gerenciar suas grades de horários e receber agendamentos via WhatsApp AI.
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center space-x-2 px-4.5 py-2.5 bg-amber-500 text-zinc-950 font-sans font-bold text-xs rounded-xl hover:bg-amber-400 cursor-pointer transition-colors shadow-lg shadow-amber-500/10 active:scale-95 duration-150"
            >
              <UserPlus className="w-4 h-4" />
              <span>Adicionar Primeiro Profissional</span>
            </button>
          </div>
        ) : (
          tenantBarbers.map((barber) => {
            const isActive = barber.status === 'active';
            return (
              <div 
                key={barber.id}
                className={`bg-zinc-950/40 border rounded-2xl p-5 font-sans flex flex-col justify-between transition-all group ${
                  isActive 
                    ? 'border-zinc-900 hover:border-zinc-800' 
                    : 'border-zinc-950/10 bg-zinc-950/20 opacity-60'
                }`}
              >
                <div>
                  
                  {/* Header Information */}
                  <div className="flex items-start space-x-4">
                    <div className="relative shrink-0">
                      <img 
                        src={barber.avatar} 
                        alt={barber.name} 
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-2xl object-cover border border-zinc-800"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-zinc-950 flex items-center justify-center ${
                        isActive ? 'bg-emerald-500' : 'bg-zinc-600'
                      }`}>
                        {isActive ? (
                          <CheckCircle2 className="w-3 h-3 text-zinc-950 stroke-[3]" />
                        ) : (
                          <XCircle className="w-3 h-3 text-zinc-950 stroke-[3]" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-zinc-100 text-sm truncate">{barber.name}</h3>
                        <div className="flex items-center text-amber-500 font-mono text-xs shrink-0 bg-amber-500/10 px-1 py-0.2 rounded font-semibold ml-auto md:ml-0">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-0.5" />
                          <span>{barber.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 font-medium">{barber.specialty}</p>

                      <div className="flex items-center space-x-1 text-[11px] text-zinc-500 mt-2 font-mono">
                        <Phone className="w-3 h-3 text-zinc-500" />
                        <span>{barber.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sub info panel: Schedule limits */}
                  <div className="mt-5 p-3 rounded-lg bg-zinc-900/30 border border-zinc-900/30 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-sans font-semibold text-zinc-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Slots Disponíveis IA:</span>
                      </span>
                      <span className="font-mono text-zinc-300 font-bold">{barber.workingHours.length} horários hoje</span>
                    </div>
                    
                    {/* Render hours bubbles micro */}
                    <div className="flex flex-wrap gap-1.2 pt-1.5 max-h-16 overflow-y-auto">
                      {barber.workingHours.map((hour, k) => (
                        <span key={k} className="text-[9px] font-mono text-zinc-500 bg-zinc-900 px-1 rounded-sm border border-zinc-800/80">
                          {hour}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Grid footers: Action controls */}
                <div className="mt-6 pt-4 border-t border-zinc-900/40 flex items-center justify-between gap-3">
                  <button
                    onClick={() => toggleBarberStatus(barber.id)}
                    style={{ contentVisibility: 'auto' }}
                    className={`px-3 py-1.8 text-xs font-sans font-semibold rounded-lg border cursor-pointer select-none transition-all ${
                      isActive 
                        ? 'border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-900/50 bg-zinc-950/40' 
                        : 'border-emerald-900/40 text-emerald-400 hover:bg-emerald-500/10'
                    }`}
                    id={`barber-active-${barber.id}`}
                  >
                    {isActive ? 'Desativar' : 'Ativar Profissional'}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(barber)}
                    className="px-3 py-1.8 text-xs font-sans font-bold text-amber-500 bg-amber-500/10 hover:bg-amber-500 hover:text-zinc-950 rounded-lg transition-all cursor-pointer"
                    id={`barber-edit-${barber.id}`}
                  >
                    Editar Dados
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* REUSABLE PREMIUM SLIDING DRAWER INTEGRATION */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedBarber ? 'Editar Barbeiro' : 'Cadastrar Barbeiro'}
        description={selectedBarber ? 'Altere as informações de atendimento e status do profissional.' : 'Registre um novo integrante profissional para sua equipe no BarberFlow AI.'}
      >
        <form onSubmit={handleSave} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400">Nome Oficial do Barbeiro</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-600">
                <UserRound className="w-4 h-4 text-zinc-500" />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Enzo Bronze"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-lg text-sm text-zinc-205 outline-none transition-colors"
                id="barber-form-name"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400">Especialidades Técnicas</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-650">
                <Scissors className="w-4 h-4 text-zinc-505" />
              </span>
              <input
                type="text"
                required
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Ex: Cortes Degradê, Navalha, Visagismo"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-lg text-sm text-zinc-200 outline-none transition-colors"
                id="barber-form-specialty"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400">Celular WhatsApp</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-600">
                <Phone className="w-4 h-4 text-zinc-500" />
              </span>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: (11) 99999-1234"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-lg text-sm text-zinc-200 outline-none transition-colors"
                id="barber-form-phone"
              />
            </div>
          </div>

          {/* Premium Avatar picker illustration */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 flex items-center space-x-1">
              <Camera className="w-4 h-4 text-zinc-500" />
              <span>Selecione a Imagem de Perfil</span>
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(preset)}
                  className={`w-10 h-10 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                    avatar === preset 
                      ? 'border-amber-500 scale-105 shadow-[0_0_10px_rgba(217,119,6,0.3)]' 
                      : 'border-zinc-900 opacity-60 hover:opacity-100 hover:border-zinc-700'
                  }`}
                  id={`barber-form-avatar-preset-${idx}`}
                >
                  <img src={preset} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Working days hour checklists */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-zinc-400 flex items-center space-x-1">
              <Clock className="w-4 h-4 text-zinc-505" />
              <span>Selecione a Grade de Horários IA</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {availableHoursList.map((hour) => {
                const checked = workingHours.includes(hour);
                return (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => toggleHour(hour)}
                    className={`p-1.5 rounded text-[11px] font-mono transition-colors text-center border cursor-pointer ${
                      checked 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 font-bold' 
                        : 'bg-zinc-900 border-zinc-900 text-zinc-550'
                    }`}
                  >
                    {hour}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-4 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 font-bold rounded-lg text-sm transition-all shadow-lg active:scale-98 cursor-pointer"
            id="barber-form-submit"
          >
            {selectedBarber ? 'Salvar Alterações (Supabase)' : 'Confirmar Cadastro'}
          </button>
          
        </form>
      </Drawer>

    </div>
  );
};
