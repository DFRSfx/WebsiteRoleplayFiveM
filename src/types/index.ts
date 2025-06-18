export interface Vehicle {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  specs: {
    topSpeed: number; // mph
    acceleration: number; // 0-60 mph in seconds
    braking: number; // 0-10 rating
    handling: number; // 0-10 rating
  };
  description: string;
}

export interface Candidature {
  id: string;
  name: string;
  email: string;
  age: number;
  experience: string;
  why: string;
  hours: number;
  discord: string;
  date: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export interface StaffApplicationFormData {
  name: string;
  email: string;
  age: number;
  experience: string;
  why: string;
  hours: number;
  discord: string;
}