import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, SectionTitle, BigButton } from '../../components/common';
import { COLORS } from '../../constants/rates';
import { SERVICE_MAP } from '../../constants/services';
import { useBookingStore } from '../../store/bookingStore';
import { useTranslation } from '../../hooks/useTranslation';

const DAY_SHORT = ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'];

export default function EarningsScreen() {
  const { t } = useTranslation();
  const { bookings, fetchBookings } = useBookingStore();
  const [upi, setUpi] = useState('');

  useEffect(() => {
    fetchBookings();
    AsyncStorage.getItem('gramseva_upi').then((v) => v && setUpi(v));
  }, []);

  const completed = bookings.filter((b) => b.status === 'completed');
  const now = new Date();
  const monthTotal = completed
    .filter((b) => b.date.startsWith(now.toISOString().slice(0, 7)))
    .reduce((sum, b) => sum + (b.actual_cost ?? 0), 0);

  // Last 7 days bar data
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const total = completed
      .filter((b) => b.date === key)
      .reduce((sum, b) => sum + (b.actual_cost ?? 0), 0);
    return { day: DAY_SHORT[d.getDay()], total };
  });
  const max = Math.max(1, ...days.map((d) => d.total));

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16 }}>
      <Card style={{ backgroundColor: COLORS.leaf, alignItems: 'center' }}>
        <Text style={s.monthLabel}>या महिन्याची कमाई</Text>
        <Text style={s.monthTotal}>₹{monthTotal.toLocaleString('en-IN')}</Text>
      </Card>

      <SectionTitle>📊 आठवड्याची कमाई</SectionTitle>
      <Card>
        <View style={s.chart}>
          {days.map((d, i) => (
            <View key={i} style={s.barCol}>
              <View style={[s.bar, { height: Math.max(4, (d.total / max) * 100) }]} />
              <Text style={s.barLabel}>{d.day}</Text>
            </View>
          ))}
        </View>
      </Card>

      <SectionTitle>💸 व्यवहार</SectionTitle>
      {completed.length === 0 && (
        <Card>
          <Text style={s.empty}>अजून कमाई नाही</Text>
        </Card>
      )}
      {completed.map((b) => {
        const sv = SERVICE_MAP[b.service_type];
        return (
          <Card key={b.id} style={s.txRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.txService}>
                {sv?.emoji} {sv?.mr}
              </Text>
              <Text style={s.txMeta}>
                {b.date} · {b.village}
              </Text>
            </View>
            <Text style={s.txAmount}>+₹{(b.actual_cost ?? 0).toLocaleString('en-IN')}</Text>
          </Card>
        );
      })}

      <SectionTitle>🏦 {t('addUpi')}</SectionTitle>
      <TextInput
        style={s.input}
        value={upi}
        onChangeText={setUpi}
        placeholder="yourname@upi"
        autoCapitalize="none"
      />
      <BigButton
        title={t('save')}
        variant="secondary"
        style={{ marginTop: 10 }}
        onPress={() => AsyncStorage.setItem('gramseva_upi', upi)}
      />
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  monthLabel: { color: COLORS.cream, fontSize: 14 },
  monthTotal: { color: COLORS.white, fontSize: 36, fontWeight: '900', marginTop: 4 },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 130,
  },
  barCol: { alignItems: 'center', flex: 1 },
  bar: {
    width: 22,
    backgroundColor: COLORS.wheat,
    borderRadius: 6,
  },
  barLabel: { fontSize: 12, color: COLORS.clay, marginTop: 6 },
  empty: { textAlign: 'center', color: COLORS.clay, padding: 8 },
  txRow: { flexDirection: 'row', alignItems: 'center' },
  txService: { fontSize: 16, fontWeight: '700', color: COLORS.earth },
  txMeta: { fontSize: 13, color: COLORS.clay, marginTop: 2 },
  txAmount: { fontSize: 17, fontWeight: '800', color: COLORS.success },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.harvest,
    padding: 16,
    fontSize: 17,
  },
});
