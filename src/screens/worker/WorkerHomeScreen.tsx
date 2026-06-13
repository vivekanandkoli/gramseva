import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, SectionTitle } from '../../components/common';
import { COLORS } from '../../constants/rates';
import { SERVICES, SERVICE_MAP } from '../../constants/services';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';
import { supabase, isSupabaseConfigured } from '../../services/supabase';
import { useTranslation } from '../../hooks/useTranslation';

const AVAIL_KEY = 'gramseva_worker_available';

export default function WorkerHomeScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((st) => st.user);
  const { bookings, fetchBookings, isLoading, updateStatus } = useBookingStore();
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(AVAIL_KEY).then((v) => v != null && setAvailable(v === 'true'));
    fetchBookings();
  }, []);

  const toggleAvailability = async (value: boolean) => {
    setAvailable(value);
    await AsyncStorage.setItem(AVAIL_KEY, String(value));
    if (isSupabaseConfigured && user) {
      await supabase.from('workers').update({ is_available: value }).eq('user_id', user.id);
    }
  };

  const openJobs = bookings.filter((b) => ['pending', 'searching'].includes(b.status));
  const todayEarnings = bookings
    .filter((b) => b.status === 'completed' && b.date === new Date().toISOString().slice(0, 10))
    .reduce((sum, b) => sum + (b.actual_cost ?? 0), 0);

  const acceptJob = (id: string) => {
    Alert.alert(t('accept'), 'हे काम स्वीकारायचे?', [
      { text: t('no'), style: 'cancel' },
      {
        text: t('yes'),
        onPress: () => updateStatus(id, 'confirmed'),
      },
    ]);
  };

  return (
    <ScrollView
      style={s.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => fetchBookings()} />}
    >
      {/* Header */}
      <View style={s.header}>
        <Text style={s.greeting}>
          {t('greeting')}, {user?.name ?? 'मजूर'}! 💪
        </Text>
        <Text style={s.earnings}>
          {t('todaysEarning')}: ₹{todayEarnings.toLocaleString('en-IN')}
        </Text>
      </View>

      {/* Availability toggle */}
      <Card style={{ ...s.availCard, ...(!available ? { backgroundColor: '#F5E6E6' } : {}) }}>
        <View style={{ flex: 1 }}>
          <Text style={s.availTitle}>{t('iAmAvailable')}</Text>
          {!available && <Text style={s.availWarn}>{t('notAvailable')}</Text>}
        </View>
        <Switch
          value={available}
          onValueChange={toggleAvailability}
          trackColor={{ true: COLORS.success, false: COLORS.danger }}
          thumbColor={COLORS.white}
          style={{ transform: [{ scale: 1.3 }] }}
        />
      </Card>

      {/* Skills */}
      <View style={s.section}>
        <SectionTitle>{t('mySkills')}</SectionTitle>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {SERVICES.slice(0, 5).map((sv) => (
            <View key={sv.key} style={s.skillBadge}>
              <Text style={s.skillText}>
                {sv.emoji} {sv.mr}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Job feed */}
      <View style={s.section}>
        <SectionTitle>📢 {t('availableJobs')}</SectionTitle>
        {openJobs.length === 0 ? (
          <Card>
            <Text style={s.empty}>सध्या नवीन काम नाही. नंतर पुन्हा पाहा 🙏</Text>
          </Card>
        ) : (
          openJobs.map((job) => {
            const sv = SERVICE_MAP[job.service_type];
            return (
              <Card key={job.id}>
                <View style={s.rowBetween}>
                  <Text style={s.jobTitle}>
                    {sv?.emoji} {sv?.mr}
                  </Text>
                  <Text style={s.wage}>
                    ₹{Math.round(job.estimated_cost_max / Math.max(1, job.workers_needed))}
                    <Text style={s.wageUnit}> /दिवस</Text>
                  </Text>
                </View>
                <View style={s.tags}>
                  <Text style={s.tag}>📅 {job.date}</Text>
                  <Text style={s.tag}>📍 {job.village}</Text>
                  <Text style={s.tag}>🌾 {job.acres} एकर</Text>
                  {job.workers_needed > 0 && <Text style={s.tag}>👷 {job.workers_needed}</Text>}
                </View>
                <View style={s.actions}>
                  <TouchableOpacity style={s.acceptBtn} onPress={() => acceptJob(job.id)}>
                    <Text style={s.acceptText}>✓ {t('accept')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={s.declineBtn}
                    onPress={() => updateStatus(job.id, 'cancelled')}
                  >
                    <Text style={s.declineText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            );
          })
        )}
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    backgroundColor: COLORS.leaf,
    padding: 24,
    paddingTop: 56,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: { fontSize: 24, fontWeight: '800', color: COLORS.white },
  earnings: { fontSize: 16, color: COLORS.harvest, marginTop: 6, fontWeight: '700' },
  availCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginBottom: 0,
    backgroundColor: '#E8F5E9',
  },
  availTitle: { fontSize: 18, fontWeight: '800', color: COLORS.earth },
  availWarn: { fontSize: 13, color: COLORS.danger, marginTop: 4 },
  section: { paddingHorizontal: 16, marginTop: 16 },
  skillBadge: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.sage,
  },
  skillText: { fontSize: 14, fontWeight: '600', color: COLORS.earth },
  empty: { textAlign: 'center', color: COLORS.clay, fontSize: 15, padding: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobTitle: { fontSize: 19, fontWeight: '800', color: COLORS.earth },
  wage: { fontSize: 20, fontWeight: '800', color: COLORS.leaf },
  wageUnit: { fontSize: 12, color: COLORS.clay },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  tag: {
    backgroundColor: COLORS.cream,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 13,
    color: COLORS.soil,
    overflow: 'hidden',
  },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  acceptBtn: {
    flex: 1,
    backgroundColor: COLORS.success,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  acceptText: { color: COLORS.white, fontWeight: '800', fontSize: 16 },
  declineBtn: {
    width: 52,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineText: { color: COLORS.danger, fontWeight: '800', fontSize: 18 },
});
