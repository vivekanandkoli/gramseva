import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  selectedRole: UserRole | null;
  phone: string;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSelectedRole: (role: UserRole) => void;
  setPhone: (phone: string) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

const USER_KEY = 'gramseva_user';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  selectedRole: null,
  phone: '',
  isLoading: true,
  setUser: (user) => {
    set({ user });
    if (user) AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    else AsyncStorage.removeItem(USER_KEY);
  },
  setSelectedRole: (selectedRole) => set({ selectedRole }),
  setPhone: (phone) => set({ phone }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: async () => {
    await AsyncStorage.removeItem(USER_KEY);
    set({ user: null, selectedRole: null, phone: '' });
  },
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(USER_KEY);
      if (raw) set({ user: JSON.parse(raw) });
    } finally {
      set({ isLoading: false });
    }
  },
}));
