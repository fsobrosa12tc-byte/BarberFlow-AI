/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../store/AppContext';
import { 
  Building, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  Users, 
  HelpCircle, 
  Sparkles,
  Award,
  CheckCircle,
  Gem
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentTenant, user, showToast } = useAppState();

  const [shopName, setShopName] = useState(currentTenant.name);
  const [address, setAddress] = useState('Av. Brigadeiro Luís Antônio, 4500 - Jardim Paulista');
  const [city, setCity] = useState(currentTenant.city);

  const startHours = ['08:00', '09:00', '10:00', '11:00'];
  const endHours = ['18:00', '19:00', '20:00', '21:00', '22:00'];

  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('20:00');

  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Preferências de Horário & Cadastro salvas via RPC!', 'success');
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-16">
      
      {/* Upper info */}
      <div>
        <h1 className="font-sans font-bold text-2xl md:text-3xl text-zinc-50 tracking-tight">
          Configurações do <span className="text-amber-500">SaaS</span>
        </h1>
        <p className="text-xs text-zinc-500 font-sans mt-0.5">
          Modifique as diretrizes operacionais de atendimento, plano de assinatura do inquilino e equipe.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* COL 1 & COL 2: MAIN PREFERENCES & DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* BARBERSHOP GENERAL PROFILE */}
          <form onSubmit={handleSaveConfigs} className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-5 md:p-7 font-sans space-y-5">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center space-x-2">
              <Building className="w-4 h-4 text-amber-505 text-amber-500" />
              <span>Dados Cadastrais da Barbearia</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400">Nome Fantasia Comercial</label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-amber-550/50 rounded-lg text-xs text-zinc-200 outline-none"
                  id="settings-shop-name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400">Cidade / Sede</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-amber-550/50 rounded-lg text-xs text-zinc-200 outline-none"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-zinc-400">Endereço de Localização</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-805 rounded-lg text-xs text-zinc-200 outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-zinc-100 flex items-center space-x-2 pt-4 border-t border-zinc-900">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Horário de Funcionamento Geral</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400">Abertura</label>
                <select
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 outline-none cursor-pointer"
                >
                  {startHours.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400">Fechamento</label>
                <select
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 outline-none cursor-pointer"
                >
                  {endHours.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-sans font-bold text-xs rounded-lg shadow-lg active:scale-95 transition-all cursor-pointer"
                id="settings-save-profile"
              >
                Salvar Configurações (Supabase)
              </button>
            </div>

          </form>

          {/* ACTIVE WORKSPACE TEAM & ROLES */}
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-5 md:p-7 font-sans">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center space-x-2 mb-4">
              <Users className="w-4 h-4 text-emerald-520 text-emerald-400" />
              <span>Equipe Admin (Multi-user)</span>
            </h3>

            <div className="divide-y divide-zinc-900">
              <div className="py-3.5 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-zinc-120 text-zinc-300">Felipe Sobrosa (Você)</p>
                  <p className="text-[10px] text-zinc-500 font-mono">fsobrosa.12tc@gmail.com</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-500 uppercase border border-amber-500/20">
                  Dono / Inquilino
                </span>
              </div>
              
              <div className="py-3.5 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-zinc-300">Assistente IA BarberFlow</p>
                  <p className="text-[10px] text-zinc-500 font-mono">bot_wa@barberflow.ai</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 uppercase border border-emerald-500/20">
                  Agente Autônomo
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* SUBSCRIPTION PLAN BILLING TIER CARD */}
        <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-6 font-sans space-y-6 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] pointer-events-none" />

          <div className="space-y-1.5 pb-4 border-b border-zinc-900">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 tracking-wider uppercase">
              PLANO PROFISSIONAL ATIVO
            </span>
            <h3 className="text-lg font-extrabold text-zinc-50 tracking-tight flex items-center space-x-1">
              <Award className="w-5 h-5 text-amber-550 text-amber-500 shrink-0" />
              <span>BarberFlow <span className="text-amber-550 text-amber-500">Pro</span></span>
            </h3>
            <p className="text-xs text-zinc-500">Billed monthly under client token.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline space-x-0.5">
              <span className="text-sm font-semibold text-zinc-500">R$</span>
              <span className="text-3xl font-mono font-extrabold text-zinc-150">149</span>
              <span className="text-xs text-zinc-500">/ mês</span>
            </div>

            {/* Plan checklist terms */}
            <div className="space-y-2.5 text-xs">
              {([
                'Inquilinos e filiais ilimitados',
                'Atendentes e Barbeiros ilimitados',
                'Agente de IA responde no WhatsApp',
                'Agenda Real-time via Supabase Sync',
                'Métricas financeiras avançadas',
                'Suporte VIP 24h'
              ]).map((feat, i) => (
                <div key={i} className="flex items-start space-x-2.5 text-zinc-350">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <button
                onClick={() => {
                  showToast('Redirecionando para o Gateway do Stripe...', 'info');
                }}
                className="w-full py-2.5 border border-zinc-800 hover:border-zinc-70s hover:bg-zinc-900 font-bold text-xs rounded-lg transition-all text-center text-zinc-300 hover:text-zinc-50 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Gerenciar Assinatura</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
