import { Pet, Appointment, FeedingPlan, GalleryItem } from '../types';

// Helper to simulate async delay like a real database
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEYS = {
  PETS: 'pcm_pets',
  APPOINTMENTS: 'pcm_appointments',
  FEEDING: 'pcm_feeding',
  GALLERY: 'pcm_gallery'
};

export const StorageService = {
  async getPets(): Promise<Pet[]> {
    await delay(200);
    const data = localStorage.getItem(STORAGE_KEYS.PETS);
    return data ? JSON.parse(data) : [];
  },

  async savePet(pet: Pet): Promise<void> {
    await delay(200);
    const pets = await this.getPets();
    const index = pets.findIndex(p => p.id === pet.id);
    if (index >= 0) {
      pets[index] = pet;
    } else {
      pets.push(pet);
    }
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
  },

  async deletePet(id: string): Promise<void> {
    const pets = await this.getPets();
    const newPets = pets.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(newPets));
  },

  async getAppointments(): Promise<Appointment[]> {
    const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return data ? JSON.parse(data) : [];
  },

  async saveAppointment(appt: Appointment): Promise<void> {
    const appts = await this.getAppointments();
    const index = appts.findIndex(a => a.id === appt.id);
    if (index >= 0) {
      appts[index] = appt;
    } else {
      appts.push(appt);
    }
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appts));
  },

  async getFeedingPlans(): Promise<FeedingPlan[]> {
    const data = localStorage.getItem(STORAGE_KEYS.FEEDING);
    return data ? JSON.parse(data) : [];
  },

  async saveFeedingPlan(plan: FeedingPlan): Promise<void> {
    const plans = await this.getFeedingPlans();
    const index = plans.findIndex(p => p.id === plan.id);
    if (index >= 0) {
      plans[index] = plan;
    } else {
      plans.push(plan);
    }
    localStorage.setItem(STORAGE_KEYS.FEEDING, JSON.stringify(plans));
  },

  async getGallery(): Promise<GalleryItem[]> {
    const data = localStorage.getItem(STORAGE_KEYS.GALLERY);
    return data ? JSON.parse(data) : [];
  },

  async saveGalleryItem(item: GalleryItem): Promise<void> {
    const items = await this.getGallery();
    items.unshift(item); // Add to top
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(items));
  }
};