export type UserRole = 'farmer' | 'worker' | 'machinery_owner' | 'coordinator';

export type ServiceType =
  | 'chhatni'
  | 'fawrani'
  | 'nagrani'
  | 'todani'
  | 'perni'
  | 'kapni'
  | 'bandhani'
  | 'tractor'
  | 'drone'
  | 'pump';

export type BookingStatus =
  | 'pending'
  | 'searching'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type MachineryType = 'tractor' | 'sprayer' | 'drone' | 'pump' | 'duster' | 'rotavator';

export interface User {
  id: string;
  phone: string;
  name: string;
  name_mr?: string;
  role: UserRole;
  village: string;
  taluka: string;
  district: string;
  profile_photo_url?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Worker {
  id: string;
  user_id: string;
  skills: ServiceType[];
  daily_rate: number;
  is_available: boolean;
  experience_years: number;
  rating: number;
  total_jobs: number;
  gang_size: number;
  user?: User;
}

export interface Machinery {
  id: string;
  owner_id: string;
  type: MachineryType;
  rate_per_hour: number;
  rate_per_acre: number;
  is_available: boolean;
  description_mr: string;
  village: string;
  owner?: User;
}

export interface Booking {
  id: string;
  booking_number: string;
  farmer_id: string;
  service_type: ServiceType;
  booking_type: 'labour' | 'machinery';
  status: BookingStatus;
  date: string;
  time_slot: string;
  acres: number;
  workers_needed: number;
  village: string;
  field_survey_number?: string;
  special_instructions?: string;
  estimated_cost_min: number;
  estimated_cost_max: number;
  actual_cost?: number;
  worker_id?: string;
  machinery_id?: string;
  coordinator_notes?: string;
  created_at: string;
  updated_at: string;
  worker?: Worker;
  farmer?: User;
}

export interface Rating {
  id: string;
  booking_id: string;
  rated_by: string;
  rated_user_id: string;
  score: number;
  comment?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title_mr: string;
  body_mr: string;
  type: string;
  is_read: boolean;
  booking_id?: string;
  created_at: string;
}
