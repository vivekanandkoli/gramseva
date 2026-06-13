import { ServiceType } from '../types';

export const SERVICES: {
  key: ServiceType;
  mr: string;
  en: string;
  emoji: string;
}[] = [
  { key: 'chhatni', mr: 'छाटणी', en: 'Pruning', emoji: '✂️' },
  { key: 'fawrani', mr: 'फवारणी', en: 'Spraying', emoji: '💧' },
  { key: 'nagrani', mr: 'नागरणी', en: 'Ploughing', emoji: '🔧' },
  { key: 'todani', mr: 'तोडणी', en: 'Harvesting', emoji: '🍇' },
  { key: 'perni', mr: 'पेरणी', en: 'Sowing', emoji: '🌱' },
  { key: 'kapni', mr: 'कापणी', en: 'Cutting', emoji: '🌾' },
  { key: 'bandhani', mr: 'बांधणी', en: 'Binding', emoji: '🪢' },
  { key: 'tractor', mr: 'ट्रॅक्टर', en: 'Tractor', emoji: '🚜' },
  { key: 'drone', mr: 'ड्रोन फवारणी', en: 'Drone Spray', emoji: '🚁' },
  { key: 'pump', mr: 'पाणी पंप', en: 'Water Pump', emoji: '⚙️' },
];

export const SERVICE_MAP = Object.fromEntries(SERVICES.map((s) => [s.key, s]));
