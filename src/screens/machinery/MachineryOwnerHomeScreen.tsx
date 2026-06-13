import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, SectionTitle, BigButton } from '../../components/common';
import { COLORS } from '../../constants/rates';
import { SERVICE_MAP } from '../../constants/services';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';
import { useTranslation } from '../../hooks/useTranslation';

const MACHINE_TYPES = [
  { type: 'tractor', mr: 'ट्रॅक्टर', emoji: '🚜' },
  { type: 'sprayer', mr: 'पॉवर स्प्रेयर', emoji: '💧' },
  { type: 'drone', mr: 'ड्रोन स्प्रेयर', emoji: '🚁' },
  { type: 'pump', mr: 'पाणी पंप', emoji: '⚙️' },
  { type: 'duster', mr: 'डस्टर', emoji: '🌀' },
];

interface LocalMachine {
  type: string;
  available: boolean;
}

export default function MachineryOwnerHomeScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((st) => st.user);
  const { bookings, fetchBookings, isLoading, updateStatus } = useBookingStore();
  const [machines, setMachines] = useState<LocalMachine[]>([
    { type: 'tractor', available: true },
  ]);

  useEffect(() => {
    fetchBookings();
    AsyncStorage.getItem('gramseva_machines').then((v) => v && setMachines(JSON.parse(v)));
  }, []);

  const saveMachines = (next: LocalMachine[]) => {
    setMachines(next);
    AsyncStorage.setItem('gramseva_machines', JSON.stringify(next));
  };

  const requests = bookings.filter(
    (b) => b.booking_type === 'machinery' && ['pending', 'searching'].includes(b.status)
  );
  const monthEarnings = bookings
    .filter((b) => b.booking_type === 'machinery' && b.status === 'completed')
    .reduce((sum, b) => sum + (b.actual_cost ?? 0), 0);

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={{ padding: 16, paddingTop: 56 }}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => fetchBookings()} />}
    >
      <Text style={s.heading}>🚜 {t('greeting')}, {user?.name}!</Text>

      <Card style={{ backgroundColor: COLORS.leaf, alignItems: 'center' }}>
        <Text style={{ color: COLORS.cream }}>या महिन्याची कमाई</Text>
        <Text style={s.earnings}>₹{monthEarnings.toLocaleString('en-IN')}</Text>
      </Card>

      <SectionTitle>⚙️ माझी यंत्रे</SectionTitle>
      {machines.map((m, i) => {
        const info = MACHINE_TYPES.find((mt) => mt.type === m.type)!;
        return (
          <Card key={i} style={s.machineRow}>
            <Text style={s.machineName}>
              {info.emoji} {info.mr}
            </Text>
            <Switch
              value={m.available}
              onValueChange={(v) =>
                saveMachines(machines.map((mm, j) => (j === i ? { ...mm, available: v } : mm)))
              }
              trackColor={{ true: COLORS.success }}
            />
          </Card>
        );
      })}
      <BigButton
        title={`➕ ${t('addNewMachine')}`}
        variant="outline"
        onPress={() => {
          const unused = MACHINE_TYPES.find((mt) => !machines.some((m) => m.type === mt.type));
          if (unused) saveMachines([...machines, { type: unused.type, available: true }]);
        }}
      />

      <SectionTitle>📨 येणाऱ्या विनंत्या</SectionTitle>
      {requests.length === 0 && (
        <Card>
          <Text style={s.empty}>सध्या विनंत्या नाहीत</Text>
        </Card>
      )}
      {requests.map((b) => {
        const sv = SERVICE_MAP[b.service_type];
        return (
          <Card key={b.id}>
            <Text style={s.reqTitle}>
              {sv?.emoji} {sv?.mr} — {b.village}
            </Text>
            <Text style={s.meta}>
              📅 {b.date} · {b.acres} एकर · ₹{b.estimated_cost_min}–{b.estimated_cost_max}
            </Text>
            <View style={s.actions}>
              <TouchableOpacity style={s.acceptBtn} onPress={() => updateStatus(b.id, 'confirmed')}>
                <Text style={s.acceptText}>✓ {t('accept')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.declineBtn}
                onPress={() => updateStatus(b.id, 'cancelled')}
              >
                <Text style={s.declineText}>✕ {t('decline')}</Text>
              </TouchableOpacity>
            </View>
          </Card>
        );
      })}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  heading: { fontSize: 24, fontWeight: '800', color: COLORS.earth, marginBottom: 16 },
  earnings: { color: COLORS.white, fontSize: 32, fontWeight: '900', marginTop: 4 },
  machineRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  machineName: { fontSize: 17, fontWeight: '700', color: COLORS.earth },
  empty: { textAlign: 'center', color: COLORS.clay, padding: 8 },
  reqTitle: { fontSize: 17, fontWeight: '800', color: COLORS.earth },
  meta: { fontSize: 13, color: COLORS.clay, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  acceptBtn: {
    flex: 1,
    backgroundColor: COLORS.success,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  acceptText: { color: COLORS.white, fontWeight: '800' },
  declineBtn: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.danger,
    paddingVertical: 12,
    alignItems: 'center',
  },
  declineText: { color: COLORS.danger, fontWeight: '800' },
});
