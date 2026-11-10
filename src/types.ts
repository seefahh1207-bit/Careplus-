export interface UserProfile {
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  surgeryDate: string; // YYYY-MM-DD
  surgeryType: string;
  hn: string;
  hospitalName: string;
  emergencyPhone: string;
  emergencyDoctor?: string;
}

export type WoundStatus = 'healthy' | 'monitor' | 'risk';

export interface WoundRecord {
  id: string;
  date: string;
  time: string;
  status: WoundStatus;
  notes: string;
  imageUrl: string;
  locationTag?: string;
  isUrgentAlertDismissed?: boolean;
}

export interface PainRecord {
  id: string;
  date: string;
  time: string;
  level: number; // 0-10
  location: string;
  characteristics: string; // เช่น ปวดตึง, ปวดแปล๊บ, ปวดจี๊ดๆ, ปวดตื้อๆ
  medicationTaken: string;
  notes?: string;
}

export interface DailyChecklistItem {
  id: string;
  title: string;
  description: string;
  detail: string;
  category: 'nutrition' | 'mobility' | 'respiratory' | 'wound' | 'elimination' | 'rest';
  oremRequisite: 'universal' | 'developmental' | 'health_deviation';
  completed: boolean;
  frequency: string;
}

export interface DailyLogState {
  date: string; // YYYY-MM-DD
  completedChecklistIds: string[];
}

export type NavigationTab = 'dashboard' | 'checklist' | 'pain' | 'guide' | 'wound' | 'danger';
