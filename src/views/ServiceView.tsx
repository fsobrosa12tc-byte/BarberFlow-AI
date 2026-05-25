/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../store/AppContext';
import { Service } from '../types';
import { Drawer } from '../components/Drawer';
import { 
  Sparkles, 
  Plus, 
  DollarSign, 
  Clock, 
  Layers, 
  CheckCircle2, 
  X,
  Lock,
  Tag
} from 'lucide-react';

const COLORS_CHIPS = [
  { value: 'amber', label: 'Dourado Bronze/Amber', bg: 'bg-amber-500/10 border-amber-500/30 text-amber-500' },
  { value: 'emerald', label: 'Esmeralda/Verde', bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
  { value: 'indigo', label: 'Índigo/Azul Escuro', bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' },
  { value: 'rose', label: 'Mousse Rose/Vermelho', bg: 'bg-rose-500/10 border-rose-500/30 text-rose-455' },
  { value: 'sky', label: 'Turquesa/Sky', bg: 'bg-sky-500/10 border-sky-500/30 text-sky-400' },
  { value: 'violet', label: 'Imperial Violet', bg: 'bg-violet-500/10 border-violet-500/30 text-violet-400' },
  { value: 'stone', label: 'Brutalist Grey', bg: 'bg-stone-500/10 border-stone-500/30 text-zinc-350' }
];

export const ServiceView: React.FC = () => {
  const { services, addService, updateService, toggleServiceStatus, currentTenant } = useAppState();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState<string>('');
  const [duration, setDuration] = useState<string>('30');
  const [color, setColor] = useState('amber');

  // Filter local services by current tenant_id
  const tenantServices = services.filter(s => s.tenant_id === currentTenant.id);

  const handleOpenAdd = () => {
    setSelectedService(null);
    setName('');
    setPrice('');
    setDuration('30');
    setColor('amber');
    setDrawerOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setSelectedService(service);
    setName(service.name);
    setPrice(service.price.toString());
    setDuration(service.duration.toString());
    setColor(service.color);
    setDrawerOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !duration) return;

    const priceNum = parseFloat(price);
    const durationNum = parseInt(duration);

    if (isNaN(priceNum) || isNaN(durationNum)) return;

    if (selectedService) {
      updateService(selectedService.id, {
        name,
        price: priceNum,
        duration: durationNum,
        color
      });
    } else {
      addService({
        name,
        price: priceNum,
        duration: durationNum,
        color,
        status: 'active'
      });
    }
    setDrawerOpen(false);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-16">
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl md:text-3xl text-zinc-50 tracking-tight">
            Menu de <span className="text-amber-500">Serviços e Combos</span>
          </h1>
          <p className="text-xs text-zinc-505 font-sans mt-0.5">
            Publique cortes, barbas, alinhamentos e combos imperiais de forma imediata.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 font-sans font-bold text-xs shadow-lg shadow-amber-500/10 cursor-pointer active:scale-95 transition-all"
          id="service-add-button"
        >
          <Plus className="w-4 h-4 text-zinc-950 stroke-[3]" />
          <span>Novo Serviço</span>
        </button>
      </div>

      {/* Grid of services cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenantServices.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 py-16 px-6 text-center border border-dashed border-zinc-850 rounded-2xl flex flex-col items-center justify-center space-y-4 bg-zinc-950/30 max-w-lg mx-auto w-full">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-500 shadow-md">
              <Sparkles className="w-5 h-5 text-amber-500 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-sans font-bold text-base text-zinc-100">Criar Menu de Serviços</h3>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
                Sua tabela de serviços está vazia para a filial <span className="text-zinc-350 font-bold">{currentTenant.name}</span>. Cadastre serviços de corte, barba e tratamentos imperiais para ativar a automação do WhatsApp AI.
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center space-x-2 px-4.5 py-2.5 bg-amber-500 text-zinc-950 font-sans font-bold text-xs rounded-xl hover:bg-amber-400 cursor-pointer transition-colors shadow-lg shadow-amber-500/10 active:scale-95 duration-150"
            >
              <Plus className="w-4 h-4 text-zinc-950 stroke-[3]" />
              <span>Criar Primeiro Serviço</span>
            </button>
          </div>
        ) : (
          tenantServices.map((service) => {
            const isActive = service.status === 'active';
            
            // Match matching color from palette lists
            const colorObj = COLORS_CHIPS.find(c => c.value === service.color) || COLORS_CHIPS[0];

            return (
              <div 
                key={service.id}
                className={`bg-zinc-950/40 border rounded-2xl p-5 font-sans flex flex-col justify-between transition-all group ${
                  isActive 
                    ? 'border-zinc-900 hover:border-zinc-800' 
                    : 'border-zinc-950/10 bg-zinc-950/20 opacity-50'
                }`}
              >
                <div className="space-y-4">
                  
                  {/* Visual Label header accent */}
                  <div className="flex justify-between items-start">
                    <span className={`inline-flex items-center px-2 py-0.8 rounded text-[10px] font-mono font-bold border uppercase ${colorObj.bg}`}>
                      <Tag className="w-3 h-3 mr-1" />
                      <span>{service.color}</span>
                    </span>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={isActive}
                        onChange={() => toggleServiceStatus(service.id)}
                        id={`service-toggle-${service.id}`}
                      />
                      <div className="w-9 h-5 bg-zinc-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:bg-amber-500 peer-checked:bg-amber-500/20 border border-zinc-805"></div>
                    </label>
                  </div>

                  {/* Body metadata */}
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100 mr-2 line-clamp-1 group-hover:text-amber-500/90 transition-colors">
                      {service.name}
                    </h3>

                    <div className="mt-4 flex items-center justify-between">
                      {/* Price and dynamic timing */}
                      <div className="flex items-baseline space-x-0.5">
                        <span className="text-xs font-semibold text-zinc-500 font-sans">R$</span>
                        <span className="text-xl font-mono font-extrabold text-zinc-150">{service.price.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center space-x-1 font-mono text-[11px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{service.duration} min</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Footer: Edit fields */}
                <div className="mt-5 pt-4 border-t border-zinc-900/60 flex justify-end">
                  <button
                    onClick={() => handleOpenEdit(service)}
                    className="px-3 py-1.5 text-xs font-sans font-bold text-zinc-400 hover:text-amber-500 bg-zinc-900 hover:bg-zinc-900 border border-zinc-850 rounded-lg transition-all cursor-pointer"
                    id={`service-edit-${service.id}`}
                  >
                    Editar Serviço
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* DRAWER COMPONENT TO CREATE/UPDATE STYLE */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedService ? 'Editar Serviço' : 'Novo Serviço'}
        description={selectedService ? 'Altere o nome, valor de faturamento ou tempo estimado do serviço.' : 'Adicione um novo serviço exclusivo ou combo de faturamento especial.'}
      >
        <form onSubmit={handleSave} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400">Nome Oficial do Serviço</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-650">
                <Sparkles className="w-4 h-4 text-zinc-500" />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Combo BarberFlow Imperial"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-lg text-sm text-zinc-200 outline-none transition-colors"
                id="service-form-name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Preço (R$)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-650">
                  <DollarSign className="w-4 h-4 text-zinc-500" />
                </span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="90.00"
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-lg text-sm text-zinc-205 outline-none transition-colors font-mono"
                  id="service-form-price"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Duração (Minutos)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-650">
                  <Clock className="w-4 h-4 text-zinc-500" />
                </span>
                <input
                  type="number"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="45"
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-lg text-sm text-zinc-200 outline-none transition-colors font-mono"
                  id="service-form-duration"
                />
              </div>
            </div>

          </div>

          {/* Color tag representation block */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-zinc-400 flex items-center space-x-1">
              <Layers className="w-4 h-4 text-zinc-550" />
              <span>Etiqueta Visual de Destaque</span>
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto pr-1">
              {COLORS_CHIPS.map((chip) => {
                const selected = chip.value === color;
                return (
                  <button
                    key={chip.value}
                    type="button"
                    onClick={() => setColor(chip.value)}
                    className={`p-2.5 rounded-lg text-xs font-sans text-left transition-all border cursor-pointer flex items-center justify-between ${chip.bg} ${
                      selected 
                        ? 'border-amber-500/80 ring-1 ring-amber-500/30' 
                        : 'border-zinc-900 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span>{chip.label}</span>
                    {selected && <CheckCircle2 className="w-4 h-4 text-amber-500 stroke-[3.5]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 font-bold rounded-lg text-sm transition-all shadow-lg active:scale-98 cursor-pointer"
            id="service-form-submit"
          >
            {selectedService ? 'Salvar Alterações (Supabase)' : 'Criar Novo Serviço'}
          </button>
          
        </form>
      </Drawer>

    </div>
  );
};
