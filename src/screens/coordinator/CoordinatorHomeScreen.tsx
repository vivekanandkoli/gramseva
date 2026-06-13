import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  RefreshControl,
} from 'react-native';
import { Card, SectionTitle, BigButton } from '../../components/common';
import { COLORS } from '../../constants/rates';
import { SERVICE_MAP } from '../../constants/services';
import { useBookingStore } from '../../store/bookingStore';
import { useTranslation } from '../../hooks/useTranslation';

export default function CoordinatorHomeScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { bookings, fetchBookings, isLoading, updateStatus } = useBookingStore();

  useEffect(() => {
    fetchBookings();
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const pending = bookings.filter((b) => ['pending', 'searching'].includes(b.status));
  const confirmedToday = bookings.filter((b) => b.status === 'confirmed' && b.date === today);
  const active = bookings.filter((b) => b.status === 'in_progress');

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={{ padding: 16, paddingTop: 56 }}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => fetchBookings()} />}
    >
      <Text style={s.heading}>🧑‍💼 समन्वयक डॅशबोर्ड</Text>

      {/* Summary cards */}
      <View style={s.statsRow}>
        <Stat label="प्रतीक्षेत" value={pending.length} color={COLORS.danger} />
        <Stat label="आज पुष्टी" value={confirmedToday.length} color="#3B82F6" />
        <Stat label="सुरू" value={active.length} color="#8B5CF6" />
      </View>

      {/* Pending bookings */}
      <SectionTitle>🔴 प्रलंबित बुकिंग्स</SectionTitle>
      {pending.length === 0 && (
        <Card>
          <Text style={s.empty}>सर्व बुकिंग्स हाताळल्या ✓</Text>
        </Card>
      )}
      {pending.map((b) => {
        const sv = SERVICE_MAP[b.service_type];
        return (
          <Card key={b.id}>
            <Text style={s.jobTitle}>
              {sv?.emoji} {sv?.mr} — {b.village}
            </Text>
            <Text style={s.meta}>
              📅 {b.date} · {b.time_slot} · {b.acres} एकर · 👷 {b.workers_needed}
            </Text>
            <Text style={s.meta}>#{b.booking_number}</Text>
            <View style={s.actions}>
              <TouchableOpacity
                style={s.assignBtn}
                onPress={() => updateStatus(b.id, 'confirmed')}
              >
                <Text style={s.assignText}>👷 {t('assignWorker')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.callBtn}
                onPress={() => Linking.openURL('tel:9999999999')}
              >
                <Text style={s.callText}>📞</Text>
              </TouchableOpacity>
            </View>
          </Card>
        );
      })}

      {/* Quick actions */}
      <SectionTitle>⚡ जलद कृती</SectionTitle>
      <BigButton
        title={`➕ ${t('addNewBooking')}`}
        onPress={() => navigation.navigate('BookingForm', {})}
      />
      <BigButton
        title={`💬 ${t('sendToWhatsAppGroup')}`}
        variant="success"
        style={{ marginTop: 10 }}
        onPress={() => {
          const jobs = pending
            .map((b) => `${SERVICE_MAP[b.service_type]?.mr} — ${b.village} — ${b.date}`)
            .join('\n');
          Linking.openURL(
            `https://wa.me/?text=${encodeURIComponent('ग्रामसेवा — नवीन कामे:\n' + jobs)}`
          );
        }}
      />
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[s.stat, { borderColor: color }]}>
      <Text style={[s.statNum, { color }]}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  heading: { fontSize: 24, fontWeight: '800', color: COLORS.earth, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  stat: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    padding: 12,
  },
  statNum: { fontSize: 26, fontWeight: '900' },
  statLabel: { fontSize: 12, color: COLORS.clay, marginTop: 4 },
  empty: { textAlign: 'center', color: COLORS.success, fontWeight: '700', padding: 8 },
  jobTitle: { fontSize: 17, fontWeight: '800', color: COLORS.earth },
  meta: { fontSize: 13, color: COLORS.clay, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  assignBtn: {
    flex: 1,
    backgroundColor: COLORS.leaf,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  assignText: { color: COLORS.white, fontWeight: '800' },
  callBtn: {
    width: 52,
    borderRadius: 10,
    backgroundColor: COLORS.wheat,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callText: { fontSize: 20 },
});
