import { useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { useAuthStore } from '../store/authStore';
import { User, UserRole, ServiceType } from '../types';

// Phone OTP auth via Supabase. In demo mode (no Supabase config), OTP "123456" works.
const DEMO_OTP = '123456';

export function useAuth() {
  const { user, setUser, phone, setPhone, selectedRole, logout } = useAuthStore();

  const sendOtp = useCallback(async (rawPhone: string) => {
    const cleaned = rawPhone.replace(/\D/g, '');
    if (cleaned.length !== 10) throw new Error('invalid_phone');
    const full = `+91${cleaned}`;
    setPhone(full);
    if (!isSupabaseConfigured) return; // demo mode: pretend OTP sent
    const { error } = await supabase.auth.signInWithOtp({ phone: full });
    if (error) throw error;
  }, [setPhone]);

  const verifyOtp = useCallback(
    async (otp: string): Promise<{ isNewUser: boolean }> => {
      if (!isSupabaseConfigured) {
        if (otp !== DEMO_OTP) throw new Error('wrong_otp');
        return { isNewUser: true };
      }
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });
      if (error) throw new Error('wrong_otp');
      const authId = data.user?.id;
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .single();
      if (profile) {
        setUser(profile as User);
        return { isNewUser: false };
      }
      return { isNewUser: true };
    },
    [phone, setUser]
  );

  const createProfile = useCallback(
    async (input: {
      name: string;
      village: string;
      taluka: string;
      role: UserRole;
      skills?: ServiceType[];
      dailyRate?: number;
    }) => {
      const newUser: User = {
        id: `local-${Date.now()}`,
        phone,
        name: input.name,
        role: input.role,
        village: input.village,
        taluka: input.taluka,
        district: 'Sangli',
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured) {
        const { data: authData } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from('users')
          .insert({
            auth_id: authData.user?.id,
            phone,
            name: input.name,
            role: input.role,
            village: input.village,
            taluka: input.taluka,
          })
          .select()
          .single();
        if (error) throw error;
        if (input.role === 'worker') {
          await supabase.from('workers').insert({
            user_id: data.id,
            skills: input.skills ?? [],
            daily_rate: input.dailyRate ?? 0,
          });
        }
        setUser(data as User);
      } else {
        setUser(newUser);
      }
    },
    [phone, setUser]
  );

  return { user, selectedRole, sendOtp, verifyOtp, createProfile, logout };
}
