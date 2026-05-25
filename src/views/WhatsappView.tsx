/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../store/AppContext';
import { Conversation } from '../types';
import { 
  Bot, 
  MessageSquare, 
  Send, 
  Settings, 
  Zap, 
  TrendingUp, 
  Users, 
  Sparkles, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const WhatsappView: React.FC = () => {
  const { 
    conversations, 
    whatsAppLogs, 
    sendChatMessage, 
    simulateIncomingWhatsappBooking, 
    showToast,
    appointments
  } = useAppState();

  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || '');
  const [typedMessage, setTypedMessage] = useState('');
  
  // AI Settings
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiPersonality, setAiPersonality] = useState('modern'); // 'classic' | 'urban' | 'modern'
  const [autoConfirm, setAutoConfirm] = useState(true);

  // Dynamic calculations with zero-status support for clean starts
  const totalAiAnswers = conversations.reduce((acc, c) => acc + c.messages.filter(m => m.sender === 'ai').length, 0);
  const wppAppointmentsCount = appointments.filter(a => a.source === 'whatsapp').length;
  const savedMinutes = totalAiAnswers * 4; // 4 minutes per automated answer
  const savedHoursText = savedMinutes >= 60 ? `${(savedMinutes / 60).toFixed(1)} hrs` : `${savedMinutes} min`;

  const activeConversation = conversations.find(c => c.id === activeConvId) || conversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage || !activeConversation) return;

    sendChatMessage(activeConversation.id, typedMessage);
    setTypedMessage('');
  };

  const handlePersonalityChange = (pers: string) => {
    setAiPersonality(pers);
    showToast(`Tom de voz da IA alterado para: ${pers === 'classic' ? 'Formal Tradicional' : pers === 'urban' ? 'Urbano Gírias' : 'Moderno Elegante'}.`, 'success');
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-16">
      
      {/* Title head */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl md:text-3xl text-zinc-50 tracking-tight flex items-center space-x-2">
            <Bot className="w-8 h-8 text-amber-500 shrink-0" />
            <span>Painel Automatizado <span className="text-amber-500">IA WhatsApp</span></span>
          </h1>
          <p className="text-xs text-zinc-505 font-sans mt-0.5">
            Visualize as interações da assistente inteligente agendando clientes no piloto automático no WhatsApp.
          </p>
        </div>

        {/* Dynamic simulator trigger */}
        <button
          onClick={simulateIncomingWhatsappBooking}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 font-sans font-bold text-xs shadow-lg shadow-amber-500/10 cursor-pointer active:scale-95 transition-all"
          id="wpp-simulate-booking"
        >
          <Zap className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
          <span>Simular Mensagem de Cliente</span>
        </button>
      </div>

      {/* METRICS OF AUTOMATIONS CHIP PANEL */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 bg-zinc-950/40 rounded-xl border border-zinc-900 font-sans">
          <p className="text-[10px] text-zinc-550 uppercase tracking-widest font-mono font-bold">Respostas Autônomas</p>
          <h4 className="text-2xl font-mono font-extrabold text-zinc-50 mt-1">{totalAiAnswers}</h4>
          <span className="text-[10px] text-emerald-500 font-semibold font-mono flex items-center mt-1">
            <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            <span>{totalAiAnswers > 0 ? '100% de precisão hoje' : 'Sem interações hoje'}</span>
          </span>
        </div>

        <div className="p-4 bg-zinc-950/40 rounded-xl border border-zinc-900 font-sans">
          <p className="text-[10px] text-zinc-550 uppercase tracking-widest font-mono font-bold">Agendamentos via IA</p>
          <h4 className="text-2xl font-mono font-extrabold text-amber-500 mt-1">{wppAppointmentsCount}</h4>
          <span className="text-[10px] text-zinc-550 font-mono mt-1 block leading-tight">
            {wppAppointmentsCount > 0 ? `R$ ${(wppAppointmentsCount * 80).toFixed(2)} autônomos` : 'Aguardando agendamento'}
          </span>
        </div>

        <div className="p-4 bg-zinc-950/40 rounded-xl border border-zinc-900 font-sans">
          <p className="text-[10px] text-zinc-550 uppercase tracking-widest font-mono font-bold">Tempo Economizado</p>
          <h4 className="text-2xl font-mono font-extrabold text-zinc-50 mt-1">{savedHoursText}</h4>
          <span className="text-[10px] text-zinc-500 font-mono mt-1 block">Balcão inteligente BarberFlow</span>
        </div>

        <div className="p-4 bg-zinc-950/40 rounded-xl border border-zinc-900 font-sans">
          <p className="text-[10px] text-zinc-550 uppercase tracking-widest font-mono font-bold">Status Integração</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${conversations.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
            <span className={`text-xs font-bold font-sans uppercase ${conversations.length > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {conversations.length > 0 ? 'CONECTADO (MOCK)' : 'STANDBY DE ATIVAÇÃO'}
            </span>
          </div>
          <span className="text-[11px] text-zinc-500 font-sans mt-1 block">
            {conversations.length > 0 ? 'Realtime link ativo' : 'Aguardando simulação'}
          </span>
        </div>

      </div>

      {/* CORE WORKSPACE GRID: CONVERSATIONS INBOX & BOT CONFIGURATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: ACTIVE CONVERSATIONS CHATS AND LISTS */}
        <div className="bg-zinc-950/50 border border-zinc-900 rounded-xl overflow-hidden font-sans flex flex-col">
          <div className="p-4 bg-zinc-900/40 border-b border-zinc-905 flex items-center justify-between">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-300">Chats Inbox IA</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500">REALTIME</span>
          </div>

          <div className="divide-y divide-zinc-900/80 max-h-[420px] overflow-y-auto font-sans">
            {conversations.length === 0 ? (
              <div className="py-20 px-4 text-center md:py-28">
                <MessageSquare className="w-8 h-8 text-zinc-700 mx-auto stroke-[1.5]" />
                <h4 className="text-xs font-bold text-zinc-300 mt-3 font-sans">Sem Conversas</h4>
                <p className="text-[10px] text-zinc-550 mt-1 max-w-[180px] mx-auto font-sans leading-relaxed">
                  Nenhum cliente iniciou contato via WhatsApp ainda. Use o botão acima para simular interações.
                </p>
              </div>
            ) : (
              conversations.map((conv) => {
                const active = conv.id === activeConvId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full p-4 text-left transition-colors flex items-start space-x-3.5 relative ${
                      active ? 'bg-zinc-900/70 border-l-2 border-amber-500' : 'hover:bg-zinc-900/10'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-zinc-850 to-zinc-800 border border-zinc-850 flex items-center justify-center text-zinc-300 font-bold text-sm shrink-0 font-sans">
                      {conv.customerName.charAt(0)}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex justify-between items-center text-xs font-sans">
                        <span className="font-bold text-zinc-150 truncate">{conv.customerName}</span>
                        <span className="text-[9px] font-mono text-zinc-500 shrink-0">{conv.timestamp}</span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate line-clamp-1 italic pr-4">"{conv.lastMessage}"</p>
                    </div>

                    {conv.unread && (
                      <span className="absolute right-4 bottom-4 w-2.5 h-2.5 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* MIDDLE COLUMN: MESSAGES BOARD AND MANUAL REPLY OPTION */}
        <div className="lg:col-span-2 bg-zinc-950/50 border border-zinc-900 rounded-xl overflow-hidden font-sans flex flex-col min-h-[460px] justify-between">
          
          {/* Active dialogue header */}
          <div className="p-4 bg-zinc-900/40 border-b border-zinc-900 flex items-center justify-between">
            {activeConversation ? (
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-zinc-100 truncate">{activeConversation.customerName}</h3>
                <p className="text-[10px] text-zinc-500 font-mono truncate">{activeConversation.customerPhone}</p>
              </div>
            ) : (
              <span className="text-xs text-zinc-500 font-sans">Selecione uma conversa</span>
            )}

            {/* AI badge override */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-500 font-mono text-[9px] font-bold">
              <Bot className="w-3.5 h-3.5 text-amber-500 animate-pulse mb-0.5" />
              <span>IA RESPONDENDO</span>
            </div>
          </div>

          {/* Messages Lists container */}
          <div className="flex-1 p-4 md:p-6 space-y-4 max-h-[300px] overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="py-24 px-6 text-center space-y-4 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-500 shadow-md">
                  <Bot className="w-5 h-5 text-amber-500 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-zinc-100 font-sans">Simule o Atendimento</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto font-sans">
                    Agende de forma simulada no WhatsApp clicando em <span className="text-amber-500 font-bold hover:underline">Simular Mensagem de Cliente</span> no topo direito. A IA responderá e salvará consultas de alta precisão de forma autônoma!
                  </p>
                </div>
              </div>
            ) : activeConversation ? (
              activeConversation.messages.map((msg) => {
                const isAI = msg.sender === 'ai';
                return (
                  <div 
                    key={msg.id}
                    className={`flex ${isAI ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs md:max-w-md p-3.5 rounded-2xl text-xs space-y-1 relative ${
                      isAI 
                        ? 'bg-amber-500 text-zinc-950 rounded-tr-none font-medium' 
                        : 'bg-zinc-900 text-zinc-200 border border-zinc-850 rounded-tl-none'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                      <span className={`text-[10px] block text-right font-mono font-medium ${
                        isAI ? 'text-zinc-950/60' : 'text-zinc-500'
                      }`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-zinc-600 text-center py-20 font-sans">Inicie enviando com a simulação WhatsApp.</p>
            )}
          </div>

          {/* Quick dialogue input field for manual overriding */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-900/80 bg-zinc-950/20 flex gap-2.5">
            <input
              type="text"
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              placeholder="Digite aqui para interceptar a conversa manualmente..."
              className="flex-1 px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-amber-550/50 rounded-lg text-xs text-zinc-200 outline-none placeholder-zinc-500"
              id="wpp-manual-typed-msg"
            />
            <button
              type="submit"
              className="p-3 bg-amber-500 text-zinc-950 hover:bg-amber-400 rounded-lg shadow cursor-pointer transition-colors"
              id="wpp-reply-submit"
            >
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </form>

        </div>

        {/* RIGHT FULL COLUMN: ADVANCED AI PERSONALITY PARAMETERS */}
        <div className="lg:col-span-3 bg-zinc-950/20 border border-zinc-900 rounded-xl p-5 font-sans space-y-6">
          <h3 className="text-sm font-bold text-zinc-100 flex items-center space-x-2">
            <Settings className="w-4 h-4 text-amber-505" />
            <span>Configurações Finas do Agente de IA</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Control State A */}
            <div className="space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-350">Status Automações</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={aiEnabled}
                    onChange={() => setAiEnabled(!aiEnabled)}
                  />
                  <div className="w-9 h-5 bg-zinc-900 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:bg-amber-500 peer-checked:bg-amber-500/20 border border-zinc-805"></div>
                </label>
              </div>
              <p className="text-[11px] text-zinc-500">Se desativado, o bot silenciará e todos os agendamentos devem ser manuais.</p>
            </div>

            {/* Control State B */}
            <div className="space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-350">Autoconfirmação</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={autoConfirm}
                    onChange={() => setAutoConfirm(!autoConfirm)}
                  />
                  <div className="w-9 h-5 bg-zinc-900 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:bg-amber-500 peer-checked:bg-amber-500/20 border border-zinc-805"></div>
                </label>
              </div>
              <p className="text-[11px] text-zinc-500">Se ativo, a IA insere reservas diretamente na agenda como confirmadas sem triagem humana.</p>
            </div>

            {/* Control State C */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-zinc-350 block">Tom de Voz da Assistente AI</span>
              
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: 'classic', label: 'Formal' },
                  { key: 'urban', label: 'Cria/Barber' },
                  { key: 'modern', label: 'Elegante' }
                ]).map((pers) => (
                  <button
                    key={pers.key}
                    type="button"
                    onClick={() => handlePersonalityChange(pers.key)}
                    className={`py-1.5 rounded transition-all text-[11px] font-bold ${
                      aiPersonality === pers.key 
                        ? 'bg-amber-500 text-zinc-950 font-bold' 
                        : 'bg-zinc-900 border border-zinc-850 text-zinc-400 text-center hover:text-zinc-150'
                    }`}
                  >
                    {pers.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
