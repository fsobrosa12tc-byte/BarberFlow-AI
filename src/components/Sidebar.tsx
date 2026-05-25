/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../store/AppContext';
import { ActiveScreen } from '../types';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Scissors, 
  Sparkles, 
  MessageSquareCode, 
  Settings, 
  LogOut,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  FileCheck,
  Grid,
  Menu
} from 'lucide-react';

interface MenuItem {
  id: string; // ActiveScreen or group identifier
  label: string;
  icon: React.ComponentType<any>;
  children?: Omit<MenuItem, 'children'>[];
}

export const Sidebar: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    logout, 
    user, 
    currentTenant, 
    tenants, 
    setTenantById,
    mobileMenuOpen,
    setMobileMenuOpen 
  } = useAppState();

  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    cadastros: true
  });
  const [tenantOpenMobile, setTenantOpenMobile] = useState(false);

  // Configurable dynamic menus structure - Ready for future database syncing
  const menus: MenuItem[] = [
    { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard },
    { id: 'calendar', label: 'Agenda VIP', icon: CalendarDays },
    { 
      id: 'cadastros', 
      label: 'Cadastros', 
      icon: Grid,
      children: [
        { id: 'barbers', label: 'Profissionais', icon: Scissors },
        { id: 'services', label: 'Serviços/Combos', icon: Sparkles },
      ]
    },
    { id: 'whatsapp_ai', label: 'WhatsApp Agente', icon: MessageSquareCode },
    { id: 'booking_portal', label: 'Portal de Reservas', icon: UserCheck },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  if (!user) return null;

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const selectScreen = (screenId: string) => {
    setCurrentScreen(screenId as ActiveScreen);
    setMobileMenuOpen(false); // Close on mobile navigation choice
  };

  // Check if active or has an active child
  const getIsActive = (item: MenuItem): boolean => {
    if (item.id === currentScreen) return true;
    if (item.children) {
      return item.children.some(child => child.id === currentScreen);
    }
    return false;
  };

  // Helper inside loop for single items
  const renderNavButton = (item: MenuItem, isSub = false) => {
    const IconComponent = item.icon;
    const isActive = currentScreen === item.id;
    
    return (
      <button
        key={item.id}
        onClick={() => selectScreen(item.id)}
        className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 font-sans font-medium text-xs group relative ${
          isSub ? 'pl-8' : ''
        } ${
          isActive
            ? 'bg-zinc-900 text-amber-500 font-bold border-l-2 border-amber-500'
            : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/40'
        }`}
        title={collapsed ? item.label : undefined}
      >
        <IconComponent className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
          isActive ? 'text-amber-500' : 'text-zinc-500 group-hover:text-zinc-350'
        }`} />
        
        {(!collapsed || isSub) && (
          <span className="ml-3 truncate animate-fade-in text-xs font-semibold">{item.label}</span>
        )}
        
        {item.id === 'whatsapp_ai' && !collapsed && (
          <span className="ml-auto inline-flex items-center px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-amber-500/10 text-amber-500">
            LIVE ATIVO
          </span>
        )}

        {/* Collapsed tooltip fallback */}
        {collapsed && !isSub && (
          <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-200 font-sans font-bold px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
            {item.label}
          </div>
        )}
      </button>
    );
  };

  return (
    <>
      {/* 1. DESKTOP PERMANENT / COLLAPSIBLE SIDEBAR */}
      <aside 
        className={`hidden md:flex flex-col bg-zinc-950 border-r border-zinc-900 text-zinc-300 h-screen sticky top-0 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Branding & Collapser Button */}
        <div className="p-4 border-b border-zinc-900 bg-zinc-950/50 flex items-center justify-between min-h-16">
          {!collapsed ? (
            <div className="flex items-center space-x-3 truncate">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(197,160,89,0.3)]">
                <Scissors className="w-4.5 h-4.5 text-black stroke-[2.5]" />
              </div>
              <div className="truncate">
                <h2 className="font-sans font-bold text-xs text-zinc-50 tracking-wider uppercase leading-none">
                  Barber<span className="text-amber-500">Flow</span>
                </h2>
                <span className="font-mono text-[8px] text-amber-500 uppercase tracking-widest font-bold mt-1 block">
                  AI Hub
                </span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(197,160,89,0.2)] mx-auto">
              <Scissors className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
          )}

          {/* Toggle Button */}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1 rounded bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-500 hover:text-zinc-200 cursor-pointer"
              title="Recolher menu"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Restore collapser badge when collapsed */}
        {collapsed && (
          <div className="py-2.5 flex justify-center border-b border-zinc-900 bg-zinc-950/20">
            <button
              onClick={() => setCollapsed(false)}
              className="p-1 rounded bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-500 hover:text-amber-500 cursor-pointer"
              title="Expandir menu"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Navigation items scrollable list */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {menus.map((item) => {
            const isGroup = !!item.children;
            const isExpanded = expandedGroups[item.id];
            
            if (!isGroup) {
              return renderNavButton(item);
            }

            // It's a group item (Submenus wrapper)
            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => toggleGroup(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-all text-xs font-bold font-sans group justify-between ${
                    getIsActive(item) 
                      ? 'text-zinc-100 bg-zinc-900/20' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="flex items-center">
                    <item.icon className="w-4 h-4 text-zinc-500 group-hover:text-amber-500" />
                    {!collapsed && (
                      <span className="ml-3 text-xs tracking-tight font-semibold">{item.label}</span>
                    )}
                  </div>
                  
                  {!collapsed && (
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-250 ${
                      isExpanded ? 'rotate-180 text-amber-500' : 'text-zinc-650'
                    }`} />
                  )}

                  {/* Collapsed tooltip fallback for group header banner */}
                  {collapsed && (
                    <div className="absolute left-16 bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-250 font-sans font-bold px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      Visualizar submenus {item.label}
                    </div>
                  )}
                </button>

                {/* Submenu Children items */}
                {isExpanded && (!collapsed || expandedGroups[item.id]) && (
                  <div className="space-y-0.5 animate-fade-in pl-1">
                    {item.children?.map(srvItem => renderNavButton(srvItem, !collapsed))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer info & active tenant */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-950/70 shrink-0">
          <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/60">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center font-bold text-black text-xs shrink-0 font-sans shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-zinc-100 truncate leading-tight">{user.name}</p>
                <p className="text-[9px] text-zinc-500 font-mono tracking-wider mt-0.5 uppercase">Plan Platinum</p>
              </div>
            )}
            <button 
              onClick={logout}
              className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-rose-450 hover:text-rose-450 transition-colors cursor-pointer shrink-0"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
          
          {!collapsed && (
            <div className="mt-3.5 flex items-center justify-between text-[9px] text-zinc-500 font-mono px-1">
              <span>Filial:</span>
              <span className="text-amber-500 font-bold truncate max-w-[120px]" title={currentTenant.name}>
                {currentTenant.slug.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* 2. MOBILE MENU DRAWER OVERLAY (SLIDE IN + BACKDROP BLUR) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Blur Overlay Backdrop */}
          <div 
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Sheet Panel - Sliding from left / thumb-safe */}
          <div className="relative flex flex-col w-[290px] h-full bg-zinc-950 border-r border-zinc-900 p-5 shadow-2xl z-10 animate-slide-in">
            {/* Header branding */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-md bg-amber-500 flex items-center justify-center shadow-md">
                  <Scissors className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                </div>
                <h3 className="font-sans font-bold text-sm uppercase text-zinc-50">
                  Barber<span className="text-amber-500">Flow</span>
                </h3>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-805 text-zinc-400 hover:text-zinc-100 cursor-pointer"
                title="Fechar drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile tenant selector shortcut */}
            <div className="mb-6">
              <button
                onClick={() => setTenantOpenMobile(!tenantOpenMobile)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-zinc-805 text-left text-xs font-bold text-zinc-250 cursor-pointer"
              >
                <span className="truncate">Local: {currentTenant.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 ${tenantOpenMobile ? 'rotate-180' : ''}`} />
              </button>
              
              {tenantOpenMobile && (
                <div className="mt-1.5 bg-zinc-950 border border-zinc-900 rounded-lg py-1.5 space-y-1 z-20">
                  {tenants.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTenantById(t.id);
                        setTenantOpenMobile(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-sans transition-colors cursor-pointer ${
                        t.id === currentTenant.id ? 'text-amber-400 font-bold bg-zinc-900/60' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menus items stack */}
            <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
              {menus.map((item) => {
                const isGroup = !!item.children;
                const isExpanded = expandedGroups[item.id];
                
                if (!isGroup) {
                  return renderNavButton(item);
                }

                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => toggleGroup(item.id)}
                      className={`w-full flex items-center p-3 rounded-lg text-xs font-bold font-sans justify-between ${
                        getIsActive(item) ? 'text-zinc-100 bg-zinc-900/40' : 'text-zinc-550'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-4 h-4 text-zinc-500" />
                        <span className="ml-3">{item.label}</span>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="space-y-1 pl-1">
                        {item.children?.map(subItem => renderNavButton(subItem, true))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Profile footer and exit logout command */}
            <div className="pt-4 mt-auto border-t border-zinc-900 flex justify-between items-center bg-zinc-950">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-xs text-black font-semibold uppercase font-sans">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-100 truncate max-w-[130px]">{user.name}</p>
                  <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-mono">Plano Platinum</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-450 cursor-pointer"
                title="Log Out Session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MOBILE THUMB-FRIENDLY BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-900 z-50 flex items-center justify-around px-2 pb-safe">
        <button
          onClick={() => selectScreen('dashboard')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${
            currentScreen === 'dashboard' ? 'text-amber-500' : 'text-zinc-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[9px] font-sans font-medium mt-1">Painel</span>
        </button>

        <button
          onClick={() => selectScreen('calendar')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${
            currentScreen === 'calendar' ? 'text-amber-500' : 'text-zinc-500'
          }`}
        >
          <CalendarDays className="w-5 h-5" />
          <span className="text-[9px] font-sans font-medium mt-1 font-bold">Agenda</span>
        </button>

        <button
          onClick={() => selectScreen('whatsapp_ai')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${
            currentScreen === 'whatsapp_ai' ? 'text-amber-500' : 'text-zinc-500'
          }`}
        >
          <MessageSquareCode className="w-5 h-5" />
          <span className="text-[9px] font-sans font-medium mt-1">Conversas</span>
        </button>

        {/* Toggle slide drawer manually */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${
            mobileMenuOpen ? 'text-amber-400' : 'text-zinc-500'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[9px] font-sans font-medium mt-1">Menu</span>
        </button>
      </nav>
    </>
  );
};
