import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { Booking, BookingStatus, ServiceType } from '../types';
import { SERVICE_RATES, ACRES_PER_DAY } from '../constants/rates';

const CACHE_KEY = 'gramseva_bookings_cache';
let localSeq = 2847;

export function estimateCost(service: ServiceType, acres: number, workers: number) {
  const rate = SERVICE_RATES[service];
  const days = Math.max(1, Math.ceil(acres / (ACRES_PER_DAY[service] * Math.max(1, workers))));
  return {
    min: rate.min * workers * days,
    max: rate.max * workers * days,
    days,
  };
}

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  isOffline: boolean;
  fetchBookings: (farmerId?: string) => Promise<void>;
  createBooking: (b: Partial<Booking>) => Promise<Booking>;
  updateStatus: (id: string, status: BookingStatus, extra?: Partial<Booking>) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  isLoading: false,
  isOffline: false,

  fetchBookings: async (farmerId) => {
    set({ isLoading: true });
    try {
      if (isSupabaseConfigured) {
        let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });
        if (farmerId) query = query.eq('farmer_id', farmerId);
        const { data, error } = await query;
        if (error) throw error;
        set({ bookings: (data as Booking[]) ?? [], isOffline: false });
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data ?? []));
      } else {
        const raw = await AsyncStorage.getItem(CACHE_KEY);
        set({ bookings: raw ? JSON.parse(raw) : [], isOffline: false });
      }
    } catch {
      // offline fallback: show cached data
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      set({ bookings: raw ? JSON.parse(raw) : [], isOffline: true });
    } finally {
      set({ isLoading: false });
    }
  },

  createBooking: async (b) => {
    const booking: Booking = {
      id: `local-${Date.now()}`,
      booking_number: `GS-${++localSeq}`,
      farmer_id: b.farmer_id ?? '',
      service_type: b.service_type as ServiceType,
      booking_type: b.booking_type ?? 'labour',
      status: 'pending',
      date: b.date ?? new Date().toISOString().slice(0, 10),
      time_slot: b.time_slot ?? '',
      acres: b.acres ?? 1,
      workers_needed: b.workers_needed ?? 1,
      village: b.village ?? '',
      field_survey_number: b.field_survey_number,
      special_instructions: b.special_instructions,
      estimated_cost_min: b.estimated_cost_min ?? 0,
      estimated_cost_max: b.estimated_cost_max ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const { id, booking_number, created_at, updated_at, ...insertable } = booking;
      const { data, error } = await supabase.from('bookings').insert(insertable).select().single();
      if (error) throw error;
      const created = data as Booking;
      const bookings = [created, ...get().bookings];
      set({ bookings });
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(bookings));
      return created;
    }

    const bookings = [booking, ...get().bookings];
    set({ bookings });
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(bookings));
    return booking;
  },

  updateStatus: async (id, status, extra = {}) => {
    if (isSupabaseConfigured && !id.startsWith('local-')) {
      await supabase.from('bookings').update({ status, ...extra }).eq('id', id);
    }
    const bookings = get().bookings.map((b) =>
      b.id === id ? { ...b, status, ...extra, updated_at: new Date().toISOString() } : b
    );
    set({ bookings });
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(bookings));
  },
}));
