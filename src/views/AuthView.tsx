/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../store/AppContext';
import { Scissors, Mail, Lock, User, Store, KeyRound, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const AuthView: React.FC = () => {
  const { authView, setAuthView, login, signup, isLoading, showToast } = useAppState();

  const [email, setEmail] = useState('fsobrosa.12tc@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Felipe Sobrosa');
  const [barberShopName, setBarberShopName] = useState('BarberFlow Elite');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Por favor, informe seu e-mail.', 'error');
      return;
    }

    if (authView === 'signin') {
      login(email, name);
    } else if (authView === 'signup') {
      if (!name || !barberShopName) {
        showToast('Preencha todos os campos para registrar sua barbearia SaaS.', 'error');
        return;
      }
      signup(email, name, barberShopName);
    } else {
      // recovery status
      showToast('E-mail de recuperação enviado via Supabase Auth!', 'success');
      setAuthView('signin');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center relative p-4 overflow-hidden">
      
      {/* Absolute high-end aesthetic details */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-600/5 blur-[120px] pointer-events-none" />

      {/* Barber Shop Retro Stripes Decor */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-650 via-zinc-100 via-blue-650 via-zinc-100 to-amber-500/80" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-zinc-900/40 border border-zinc-900/90 rounded-2xl p-7 md:p-9 backdrop-blur-md shadow-2xl relative"
        id="auth-card"
      >
        {/* Brand header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.3)] mb-3">
            <Scissors className="w-6 h-6 text-black stroke-[2.5]" />
          </div>
          <h1 className="font-sans font-bold text-2xl text-zinc-50 tracking-tight">
            Barber<span className="text-amber-500">Flow</span> AI
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-sans">
            SaaS Premium de Gestão Inteligente & Agenda com IA
          </p>
        </div>

        {/* Credentials hints panel */}
        {authView === 'signin' && (
          <div className="mb-6 px-3.5 py-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10 text-[11px] font-mono text-amber-500/90 text-center">
            ⚡ Presets de teste ativos! Clique em "Entrar" para acessar o painel.
          </div>
        )}

        {/* Form panel */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {authView === 'signup' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div className="space-y-1.5 animate-fade-in">
                <label className="text-xs font-semibold text-zinc-400 font-sans">Seu Nome Completo</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-650">
                    <User className="w-4 h-4 text-zinc-500" />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Felipe Sobrosa"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all font-sans"
                    id="auth-input-name"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 font-sans">Nome da Barbearia</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-650">
                    <Store className="w-4 h-4 text-zinc-500" />
                  </span>
                  <input
                    type="text"
                    value={barberShopName}
                    onChange={(e) => setBarberShopName(e.target.value)}
                    placeholder="Ex: BarberFlow VIP Jardins"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all font-sans"
                    id="auth-input-tenant"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 font-sans">Endereço de E-mail</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-650">
                <Mail className="w-4 h-4 text-zinc-500" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@exemplo.com"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all font-sans"
                id="auth-input-email"
              />
            </div>
          </div>

          {authView !== 'recovery' && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-zinc-400 font-sans">Sua Senha</label>
                {authView === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setAuthView('recovery')}
                    className="text-[11px] font-sans text-amber-500 hover:text-amber-400 transition"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-650">
                  <Lock className="w-4 h-4 text-zinc-500" />
                </span>
                <input
                  type="password"
                  required={authView !== 'recovery'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha secreta"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all font-sans"
                  id="auth-input-password"
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 text-zinc-950 hover:from-amber-500 hover:to-amber-400 font-sans font-bold text-sm rounded-lg shadow-lg hover:shadow-amber-500/10 transition-all outline-none flex items-center justify-center space-x-2 mt-6 cursor-pointer active:scale-98 disabled:opacity-50"
            id="auth-submit-btn"
          >
            <span>
              {isLoading 
                ? 'Conectando Supabase Auth...' 
                : authView === 'signin' 
                ? 'Entrar no Sistema' 
                : authView === 'signup' 
                ? 'Criar Minha Conta SaaS' 
                : 'Enviar Token de Recuperação'}
            </span>
            {!isLoading && <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
          </button>
        </form>

        {/* Dynamic footers to swap login/signup */}
        <div className="mt-8 text-center text-xs text-zinc-500 font-sans border-t border-zinc-900 pt-5">
          {authView === 'signin' ? (
            <p>
              Novo por aqui?{' '}
              <button
                onClick={() => setAuthView('signup')}
                className="font-bold text-amber-500 hover:text-amber-400 transition px-1"
              >
                Cadastre sua barbearia
              </button>
            </p>
          ) : (
            <p>
              Já possui registro?{' '}
              <button
                onClick={() => setAuthView('signin')}
                className="font-bold text-amber-500 hover:text-amber-400 transition px-1"
              >
                Faça login aqui
              </button>
            </p>
          )}
        </div>
        
        {/* Real-time Multi-tenant compliance logo indicators */}
        <div className="mt-5 flex items-center justify-center space-x-4 opacity-30 select-none">
          <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-400">SUPABASE AUTH</span>
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
          <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-400">RLS PROTECTED</span>
        </div>

      </motion.div>
    </div>
  );
};
