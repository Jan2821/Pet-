export interface Pet {
  id: string;
  name: string;
  type: string; // Hund, Katze, etc.
  age: number;
  image: string; // Base64 string
}

export interface Appointment {
  id: string;
  petId: string;
  title: string;
  date: string; // ISO String
  type: 'vet' | 'vaccine' | 'grooming' | 'other';
  notes?: string;
}

export interface FeedingPlan {
  id: string;
  petId: string;
  time: string; // "08:00"
  amount: string; // "100g"
  foodType: string;
}

export interface GalleryItem {
  id: string;
  petId: string;
  url: string; // Base64
  date: string;
  note: string;
}

export type ViewState = 'dashboard' | 'calendar' | 'feeding' | 'gallery' | 'ai-chat';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}