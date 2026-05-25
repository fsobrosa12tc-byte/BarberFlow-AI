/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Barber, Service, Appointment, WhatsAppLog, Conversation, Tenant, ActiveScreen, MessageLine } from '../types';

interface AppStateContextType {
  // Navigation & Screen Control
  currentScreen: ActiveScreen;
  setCurrentScreen: (screen: ActiveScreen) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  
  // Auth Simulation
  user: { email: string; name: string } | null;
  currentTenant: Tenant;
  tenants: Tenant[];
  setTenantById: (id: string) => void;
  login: (email: string, name?: string) => Promise<boolean>;
  signup: (email: string, name: string, barberShopName: string) => Promise<boolean>;
  logout: () => void;
  authView: 'signin' | 'signup' | 'recovery';
  setAuthView: (view: 'signin' | 'signup' | 'recovery') => void;

  // Database States
  barbers: Barber[];
  services: Service[];
  appointments: Appointment[];
  whatsAppLogs: WhatsAppLog[];
  conversations: Conversation[];

  // Mutators (Prepared for Supabase future integration with real-time UI response)
  addBarber: (barber: Omit<Barber, 'id' | 'tenant_id'>) => void;
  updateBarber: (id: string, barberUpdates: Partial<Barber>) => void;
  toggleBarberStatus: (id: string) => void;
  
  addService: (service: Omit<Service, 'id' | 'tenant_id'>) => void;
  updateService: (id: string, serviceUpdates: Partial<Service>) => void;
  toggleServiceStatus: (id: string) => void;

  createAppointment: (appointment: Omit<Appointment, 'id' | 'tenant_id'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  cancelAppointment: (id: string) => void;

  // Toast notification triggers
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: () => void;

  // Real-time WhatsApp AI Simulation Tools
  simulateIncomingWhatsappBooking: () => void;
  sendChatMessage: (conversationId: string, text: string) => void;
}

const AppContext = createContext<AppStateContextType | undefined>(undefined);

const INITIAL_TENANTS: Tenant[] = [
  {
    id: 't-1',
    name: 'BarberFlow VIP Centro',
    ownerName: 'Felipe Sobrosa',
    city: 'São Paulo',
    slug: 'centro',
    subscriptionPlan: 'pro',
  },
  {
    id: 't-2',
    name: 'BarberFlow Imperial Jardins',
    ownerName: 'Felipe Sobrosa',
    city: 'São Paulo',
    slug: 'jardins',
    subscriptionPlan: 'enterprise',
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>({
    email: 'fsobrosa.12tc@gmail.com',
    name: 'Felipe Sobrosa',
  });
  const [authView, setAuthView] = useState<'signin' | 'signup' | 'recovery'>('signin');
  const [currentTenant, setCurrentTenant] = useState<Tenant>(INITIAL_TENANTS[0]);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);

  // Database collections (filtered or associated under multi-tenant via tenant_id)
  const [barbers, setBarbers] = useState<Barber[]>([]);

  const [services, setServices] = useState<Service[]>([]);

  // Base day: 2026-05-24
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [whatsAppLogs, setWhatsAppLogs] = useState<WhatsAppLog[]>([]);

  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Toasts
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const dismissToast = () => {
    setToast(null);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dismissToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Auth Action Setup
  const login = async (email: string, name?: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setUser({
      email,
      name: name || 'Felipe Sobrosa',
    });
    setIsLoading(false);
    showToast('Login autenticado via Supabase Auth!', 'success');
    setCurrentScreen('dashboard');
    return true;
  };

  const signup = async (email: string, name: string, barberShopName: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newTenantID = `t-${Date.now()}`;
    const newTenant: Tenant = {
      id: newTenantID,
      name: barberShopName,
      ownerName: name,
      city: 'Personalizado',
      slug: barberShopName.toLowerCase().replace(/\s+/g, '-'),
      subscriptionPlan: 'pro',
    };
    
    setTenants(prev => [...prev, newTenant]);
    setCurrentTenant(newTenant);
    setUser({ email, name });
    
    // Auto-create basic services and a barber for this new tenant
    const newBarber: Barber = {
      id: `b-${Date.now()}`,
      name: `Barbeiro ${name}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      specialty: 'Cortes premium modernos',
      phone: '(11) 90000-0000',
      status: 'active',
      rating: 5.0,
      workingHours: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
      tenant_id: newTenantID
    };
    setBarbers(prev => [...prev, newBarber]);

    const defaultService: Service = {
      id: `s-${Date.now()}`,
      name: 'Corte Tradicional',
      price: 50.00,
      duration: 30,
      color: 'amber',
      status: 'active',
      tenant_id: newTenantID
    };
    setServices(prev => [...prev, defaultService]);

    setIsLoading(false);
    showToast('Multi-tenant SaaS registrado com sucesso!', 'success');
    setCurrentScreen('dashboard');
    return true;
  };

  const logout = () => {
    setUser(null);
    showToast('Sessão encerrada com segurança.', 'info');
  };

  const setTenantById = (id: string) => {
    const found = tenants.find(t => t.id === id);
    if (found) {
      setCurrentTenant(found);
      showToast(`Migrando para inquilino: ${found.name}`, 'info');
    }
  };

  // Barber Actions
  const addBarber = (barber: Omit<Barber, 'id' | 'tenant_id'>) => {
    const newBarber: Barber = {
      ...barber,
      id: `b-${Date.now()}`,
      tenant_id: currentTenant.id
    };
    setBarbers(prev => [newBarber, ...prev]);
    showToast(`Barbeiro ${newBarber.name} cadastrado! (Supabase RPC)`, 'success');
  };

  const updateBarber = (id: string, barberUpdates: Partial<Barber>) => {
    setBarbers(prev => prev.map(b => b.id === id ? { ...b, ...barberUpdates } : b));
    showToast('Dados do barbeiro atualizados com sucesso.', 'success');
  };

  const toggleBarberStatus = (id: string) => {
    setBarbers(prev => prev.map(b => {
      if (b.id === id) {
        const nextStatus = b.status === 'active' ? 'inactive' : 'active';
        showToast(`Barbeiro ${b.name} ${nextStatus === 'active' ? 'ativado' : 'desativado'}.`, 'info');
        return { ...b, status: nextStatus };
      }
      return b;
    }));
  };

  // Service Actions
  const addService = (service: Omit<Service, 'id' | 'tenant_id'>) => {
    const newService: Service = {
      ...service,
      id: `s-${Date.now()}`,
      tenant_id: currentTenant.id
    };
    setServices(prev => [newService, ...prev]);
    showToast(`Serviço "${newService.name}" criado com sucesso!`, 'success');
  };

  const updateService = (id: string, serviceUpdates: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...serviceUpdates } : s));
    showToast('Serviço atualizado com sucesso.', 'success');
  };

  const toggleServiceStatus = (id: string) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'active' ? 'inactive' : 'active';
        showToast(`Serviço "${s.name}" ${nextStatus === 'active' ? 'ativado' : 'desativado'}.`, 'info');
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  // Appointment Actions
  const createAppointment = (appointment: Omit<Appointment, 'id' | 'tenant_id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: `a-${Date.now()}`,
      tenant_id: currentTenant.id
    };
    setAppointments(prev => [newAppointment, ...prev]);
    showToast('Seu agendamento foi registrado com sucesso!', 'success');
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        let statusMsg = 'atualizado';
        if (status === 'confirmed') statusMsg = 'Confirmado';
        else if (status === 'completed') statusMsg = 'Finalizado e faturado';
        else if (status === 'cancelled') statusMsg = 'Cancelado';
        
        showToast(`Agendamento de ${a.customerName} - ${statusMsg}!`, 'success');
        return { ...a, status };
      }
      return a;
    }));
  };

  const cancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        showToast(`Agendamento de ${a.customerName} cancelado.`, 'info');
        return { ...a, status: 'cancelled' };
      }
      return a;
    }));
  };

  // AI WhatsApp Trigger Simulation
  const simulateIncomingWhatsappBooking = () => {
    const randomCustomer = [
      { name: 'Gabriel Pires', phone: '(11) 96161-0202' },
      { name: 'Lucas Vasconcelos', phone: '(11) 94242-8899' },
      { name: 'Henrique Faria', phone: '(11) 91515-5656' },
      { name: 'Tiago Leifert', phone: '(11) 92323-7744' }
    ][Math.floor(Math.random() * 4)];

    const availableBarbers = barbers.filter(b => b.status === 'active' && b.tenant_id === currentTenant.id);
    const availableServices = services.filter(s => s.status === 'active' && s.tenant_id === currentTenant.id);

    if (availableBarbers.length === 0 || availableServices.length === 0) {
      showToast('Nenhum barbeiro ou serviço ativo para simular o agendamento IA.', 'error');
      return;
    }

    const randomBarber = availableBarbers[Math.floor(Math.random() * availableBarbers.length)];
    const randomService = availableServices[Math.floor(Math.random() * availableServices.length)];
    const randomTime = `${String(Math.floor(Math.random() * 8) + 10).padStart(2, '0')}:00`;

    // Add log
    const newLog: WhatsAppLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      customerName: randomCustomer.name,
      customerPhone: randomCustomer.phone,
      message: `Quero agendar ${randomService.name} hoje às ${randomTime} com o barbeiro ${randomBarber.name.split(' ')[0]}.`,
      action: 'Agendamento Automatizado',
      status: 'success'
    };

    setWhatsAppLogs(prev => [newLog, ...prev]);

    // Create the real appointment
    const newAppointment: Appointment = {
      id: `a-${Date.now()}`,
      customerName: randomCustomer.name,
      customerPhone: randomCustomer.phone,
      barberId: randomBarber.id,
      serviceId: randomService.id,
      date: '2026-05-24',
      time: randomTime,
      status: 'confirmed',
      source: 'whatsapp',
      tenant_id: currentTenant.id
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Add conversation
    const newConversationMessage: MessageLine[] = [
      { id: 'c-1', sender: 'customer', text: `Quero agendar ${randomService.name} hoje às ${randomTime} com o barbeiro ${randomBarber.name.split(' ')[0]}.`, time: 'Agora' },
      { id: 'c-2', sender: 'ai', text: `Maravilha! Agendamento confirmado com sucesso! 🤝 ${randomService.name} com ${randomBarber.name} hoje às ${randomTime}. Te aguardamos em nossa barbearia!`, time: 'Agora' }
    ];

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      customerName: randomCustomer.name,
      customerPhone: randomCustomer.phone,
      lastMessage: 'Agendamento gerado via IA WhatsApp!',
      timestamp: 'Agora',
      unread: true,
      messages: newConversationMessage
    };

    setConversations(prev => [newConv, ...prev]);
    showToast(`NOVO AGENDAMENTO IA: ${randomCustomer.name} - ${randomService.name} às ${randomTime}!`, 'success');
  };

  const sendChatMessage = (conversationId: string, text: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const updatedMessages: MessageLine[] = [
          ...c.messages,
          { id: `msg-u-${Date.now()}`, sender: 'ai', text, time: timeNow }
        ];
        return {
          ...c,
          lastMessage: text,
          timestamp: timeNow,
          messages: updatedMessages
        };
      }
      return c;
    }));
    showToast('Resposta enviada pelo console do BarberFlow IA!', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        isLoading,
        setIsLoading,
        mobileMenuOpen,
        setMobileMenuOpen,
        user,
        currentTenant,
        tenants,
        setTenantById,
        login,
        signup,
        logout,
        authView,
        setAuthView,
        barbers,
        services,
        appointments,
        whatsAppLogs,
        conversations,
        addBarber,
        updateBarber,
        toggleBarberStatus,
        addService,
        updateService,
        toggleServiceStatus,
        createAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        toast,
        showToast,
        dismissToast,
        simulateIncomingWhatsappBooking,
        sendChatMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState deve ser utilizado com um AppProvider');
  }
  return context;
};
