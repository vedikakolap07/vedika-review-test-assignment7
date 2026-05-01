export interface UserBase {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  role: 'patient' | 'doctor';
  createdAt?: string;
}

export interface Doctor extends UserBase {
  role: 'doctor';
  specialty: string;
  experience: number | string;
  licenseNumber?: string;
  bio?: string;
  qualifications?: string[];
}

export interface Patient extends UserBase {
  role: 'patient';
  age?: number;
  surgeryHistory?: string;
  illnessHistory?: string;
  medicalHistory?: string[];
}

export type User = Doctor | Patient;

export interface AuthContextType {
  user: User | null;
  token: string | null;
  signUp: (data: any) => Promise<void>;
  signIn: (data: any) => Promise<void>;
  signOut: () => void;
}