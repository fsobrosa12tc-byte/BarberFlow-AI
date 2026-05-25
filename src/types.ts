/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Barber {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  phone: string;
  status: 'active' | 'inactive';
  rating: number;
  workingHours: string[]; // e.g. ["09:00", "19:00"]
  tenant_id: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  color: string; // Tailwind color name (e.g. "amber", "emerald", "sky", "stone")
  status: 'active' | 'inactive';
  tenant_id: string;
}

export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  barberId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  source: 'whatsapp' | 'manual' | 'public_link';
  tenant_id: string;
}

export interface WhatsAppLog {
  id: string;
  timestamp: string;
  customerName: string;
  customerPhone: string;
  message: string;
  action: string; // "Agendamento Automatizado" | "Consulta de Horários" | "Dúvida Geral"
  status: 'success' | 'warning' | 'info';
}

export interface MessageLine {
  id: string;
  sender: 'ai' | 'customer';
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  customerName: string;
  customerPhone: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  messages: MessageLine[];
}

export interface Tenant {
  id: string;
  name: string;
  ownerName: string;
  city: string;
  slug: string;
  logoUrl?: string;
  subscriptionPlan: 'free' | 'pro' | 'enterprise';
}

export type ActiveScreen =
  | 'dashboard'
  | 'calendar'
  | 'barbers'
  | 'services'
  | 'whatsapp_ai'
  | 'booking_portal'
  | 'settings';
