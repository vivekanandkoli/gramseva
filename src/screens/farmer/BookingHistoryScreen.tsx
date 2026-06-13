import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Card, StatusBadge } from '../../components/common';
import { COLORS } from '../../constants/rates';
import { SERVICE_MAP } from '../../constants/services';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';
import { BookingStatus } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

const FILTERS: { key: BookingStatus | 'all'; mr: string }[] = [
  { key: 'all', mr: 'सर्व' },
  { key: 'pending', mr: 'प्रतीक्षेत' },
  { key: 'confirmed', mr: 'पुष्टी' },
  { key: 'completed', mr: 'पूर्ण' },
  { key: 'cancelled', mr: 'रद्द' },
];

export default function BookingHistoryScreen({ navigation }: any) {
  const { t } = useTranslation();
  const user = useAuthStore((st) => st.user);
  const { bookings, fetchBookings, isLoading } = useBookingStore();
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');

  useEffect(() => {
    fetchBookings(user?.id);
  }, [user?.id]);

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <View style={s.container}>
      <View style={s.tabs}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[s.tab, filter === f.key && s.tabActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[s.tabText, filter === f.key && { color: COLORS.white }]}>{f.mr}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => fetchBookings(user?.id)} />
        }
        ListEmptyComponent={
          <View style={s.emptyWrap}>
            <Text style={{ fontSize: 56 }}>🌾</Text>
            <Text style={s.emptyText}>{t('noBookingsYet')}</Text>
          </View>
        }
        renderItem={({ item }) => {
          const sv = SERVICE_MAP[item.service_type];
          return (
            <Card>
              <View style={s.rowBetween}>
                <Text style={s.service}>
                  {sv?.emoji} {sv?.mr}
                </Text>
                <StatusBadge status={item.status} />
              </View>
              <Text style={s.meta}>
                📅 {item.date} · {item.time_slot}
              </Text>
              <Text style={s.meta}>
                #{item.booking_number} · {item.acres} एकर
              </Text>
              {item.actual_cost != null && (
                <Text style={s.cost}>₹{item.actual_cost.toLocaleString('en-IN')}</Text>
              )}
              {item.status === 'completed' && (
                <TouchableOpacity
                  style={s.rebookBtn}
                  onPress={() => navigation.navigate('BookingForm', { service: item.service_type })}
                >
                  <Text style={s.rebookText}>🔄 {t('rebook')}</Text>
                </TouchableOpacity>
              )}
            </Card>
          );
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  tabs: {
    flexDirection: 'row',
    padding: 12,
    gap: 6,
    backgroundColor: COLORS.white,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: COLORS.leaf },
  tabText: { fontSize: 13, fontWeight: '700', color: COLORS.earth },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  service: { fontSize: 18, fontWeight: '700', color: COLORS.earth },
  meta: { fontSize: 14, color: COLORS.clay, marginTop: 6 },
  cost: { fontSize: 18, fontWeight: '800', color: COLORS.success, marginTop: 6 },
  rebookBtn: {
    marginTop: 10,
    backgroundColor: COLORS.harvest,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  rebookText: { fontWeight: '700', color: COLORS.earth },
  emptyWrap: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 17, color: COLORS.clay, marginTop: 12 },
});
