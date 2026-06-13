import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { Card, BigButton } from '../../components/common';
import { COLORS } from '../../constants/rates';
import { SERVICE_MAP } from '../../constants/services';
import { useBookingStore } from '../../store/bookingStore';
import { useTranslation } from '../../hooks/useTranslation';

type Tab = 'today' | 'upcoming' | 'done';

export default function MyJobsScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { bookings, fetchBookings, updateStatus } = useBookingStore();
  const [tab, setTab] = useState<Tab>('today');

  useEffect(() => {
    fetchBookings();
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const mine = bookings.filter((b) =>
    ['confirmed', 'in_progress', 'completed'].includes(b.status)
  );
  const visible = mine.filter((b) => {
    if (tab === 'today') return b.date === today && b.status !== 'completed';
    if (tab === 'upcoming') return b.date > today && b.status !== 'completed';
    return b.status === 'completed';
  });

  const TABS: { key: Tab; mr: string }[] = [
    { key: 'today', mr: t('todaysJobs') },
    { key: 'upcoming', mr: t('upcomingJobs') },
    { key: 'done', mr: t('completedJobs') },
  ];

  return (
    <View style={s.container}>
      <View style={s.tabs}>
        {TABS.map((tb) => (
          <TouchableOpacity
            key={tb.key}
            style={[s.tab, tab === tb.key && s.tabActive]}
            onPress={() => setTab(tb.key)}
          >
            <Text style={[s.tabText, tab === tb.key && { color: COLORS.white }]}>{tb.mr}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {visible.length === 0 && (
          <Card>
            <Text style={s.empty}>काही काम नाही 🌾</Text>
          </Card>
        )}
        {visible.map((job) => {
          const sv = SERVICE_MAP[job.service_type];
          const done = job.status === 'completed';
          return (
            <Card key={job.id}>
              <Text style={s.jobTitle}>
                {sv?.emoji} {sv?.mr}
              </Text>
              <Text style={s.meta}>
                📅 {job.date} · {job.time_slot}
              </Text>
              <Text style={s.meta}>📍 {job.village}</Text>
              {done ? (
                <Text style={s.earned}>
                  ₹{(job.actual_cost ?? job.estimated_cost_max).toLocaleString('en-IN')}{' '}
                  {t('received')} ✓
                </Text>
              ) : (
                <>
                  <View style={s.row}>
                    <TouchableOpacity
                      style={s.smallBtn}
                      onPress={() =>
                        Linking.openURL(
                          `https://www.google.com/maps/search/${encodeURIComponent(job.village)}`
                        )
                      }
                    >
                      <Text style={s.smallBtnText}>🗺 {t('showOnMap')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={s.smallBtn}
                      onPress={() => Linking.openURL('tel:9999999999')}
                    >
                      <Text style={s.smallBtnText}>📞 {t('callFarmer')}</Text>
                    </TouchableOpacity>
                  </View>
                  {job.status === 'confirmed' ? (
                    <BigButton
                      title={`▶️ ${t('startWork')}`}
                      variant="secondary"
                      style={{ marginTop: 12 }}
                      onPress={() => updateStatus(job.id, 'in_progress')}
                    />
                  ) : (
                    <BigButton
                      title={`✅ ${t('finishWork')}`}
                      variant="success"
                      style={{ marginTop: 12 }}
                      onPress={() => {
                        updateStatus(job.id, 'completed', {
                          actual_cost: job.estimated_cost_max,
                        });
                        navigation.navigate('Rating', { bookingId: job.id });
                      }}
                    />
                  )}
                </>
              )}
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  tabs: { flexDirection: 'row', padding: 12, gap: 8, backgroundColor: COLORS.white },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: COLORS.leaf },
  tabText: { fontSize: 13, fontWeight: '700', color: COLORS.earth },
  empty: { textAlign: 'center', color: COLORS.clay, fontSize: 16, padding: 12 },
  jobTitle: { fontSize: 19, fontWeight: '800', color: COLORS.earth },
  meta: { fontSize: 14, color: COLORS.clay, marginTop: 6 },
  earned: { fontSize: 18, fontWeight: '800', color: COLORS.success, marginTop: 10 },
  row: { flexDirection: 'row', gap: 10, marginTop: 12 },
  smallBtn: {
    flex: 1,
    backgroundColor: COLORS.cream,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.harvest,
  },
  smallBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.earth },
});
