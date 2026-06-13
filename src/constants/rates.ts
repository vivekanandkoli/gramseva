import { ServiceType } from '../types';

// Base daily rates per service type (INR per worker per day)
export const SERVICE_RATES: Record<ServiceType, { min: number; max: number }> = {
  chhatni: { min: 400, max: 600 },
  fawrani: { min: 350, max: 500 },
  nagrani: { min: 450, max: 650 },
  todani: { min: 400, max: 550 },
  perni: { min: 350, max: 500 },
  kapni: { min: 400, max: 550 },
  bandhani: { min: 300, max: 450 },
  tractor: { min: 800, max: 1200 },
  drone: { min: 1500, max: 2500 },
  pump: { min: 500, max: 800 },
};

// Average acres a worker can cover per day per service
export const ACRES_PER_DAY: Record<ServiceType, number> = {
  chhatni: 0.5,
  fawrani: 2,
  nagrani: 1,
  todani: 1,
  perni: 1.5,
  kapni: 1.5,
  bandhani: 1,
  tractor: 5,
  drone: 10,
  pump: 3,
};

export const TALUKA_LIST = [
  'सांगली',
  'मिरज',
  'कवठेमहांकाळ',
  'जत',
  'आटपाडी',
  'खानापूर',
  'वाळवा',
  'शिराळा',
  'पलूस',
  'तासगाव',
];

export const TIME_SLOTS = [
  { key: 'morning_6', mr: 'सकाळी ६', en: '6:00 AM' },
  { key: 'morning_7', mr: 'सकाळी ७', en: '7:00 AM' },
  { key: 'morning_8', mr: 'सकाळी ८', en: '8:00 AM' },
  { key: 'noon_12', mr: 'दुपारी १२', en: '12:00 PM' },
  { key: 'asap', mr: 'लवकरात लवकर', en: 'As Soon As Possible' },
];

export const STATUS_COLORS: Record<string, string> = {
  pending: '#FCD34D',
  searching: '#F97316',
  confirmed: '#3B82F6',
  in_progress: '#8B5CF6',
  completed: '#22C55E',
  cancelled: '#EF4444',
};

export const COLORS = {
  earth: '#2C1810',
  soil: '#5C3D2E',
  clay: '#8B5E3C',
  wheat: '#D4A853',
  harvest: '#E8C170',
  cream: '#FBF5E6',
  sage: '#7A8C6E',
  leaf: '#4A6741',
  sky: '#B8D4E8',
  white: '#FFFFFF',
  danger: '#C0392B',
  success: '#27AE60',
};
