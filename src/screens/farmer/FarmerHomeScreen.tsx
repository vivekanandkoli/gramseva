import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Card, StatusBadge, SectionTitle } from '../../components/common';
import { COLORS } from '../../constants/rates';
import { SERVICES, SERVICE_MAP } from '../../constants/services';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';
import { useTranslation } from '../../hooks/useTranslation';

const MARATHI_DAYS = ['रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const MARATHI_MONTHS = ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'];

export function marathiDate(d = new Date()) {
  return `${MARATHI_DAYS[d.getDay()]}, ${d.getDate()} ${MARATHI_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export default function FarmerHomeScreen({ navigation }: any) {
  const { t } = useTranslation();
  const user = useAuthStore((st) => st.user);
  const { bookings, fetchBookings, isLoading, isOffline } = useBookingStore();

  const load = useCallback(() => fetchBookings(user?.id), [user?.id]);
  useEffect(() => {
    load();
  }, [load]);

  const active = bookings.slice(0, 3);
  const completedCount = bookings.filter((b) => b.status === 'completed').length;

  return (
    <ScrollView
      style={s.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={load} />}
    >
      {isOffline && (
        <View style={s.offlineBanner}>
          <Text style={s.offlineText}>{t('errorNetwork')}</Text>
        </View>
      )}

      {/* Greeting card */}
      <View style={s.greetingCard}>
        <Text style={s.greeting}>
          {t('greeting')}, {user?.name ?? 'शेतकरी'}! 🙏
        </Text>
        <Text style={s.date}>{marathiDate()}</Text>
        <Text style={s.village}>📍 {user?.village ?? ''}</Text>
      </View>

      {/* Service grid */}
      <View style={s.section}>
        <SectionTitle>{t('whatToday')}</SectionTitle>
        <View style={s.grid}>
          {SERVICES.slice(0, 6).map((sv) => (
            <TouchableOpacity
              key={sv.key}
              style={s.tile}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('BookingForm', { service: sv.key })}
            >
              <Text style={s.tileEmoji}>{sv.emoji}</Text>
              <Text style={s.tileMr}>{sv.mr}</Text>
              <Text style={s.tileEn}>{sv.en}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('BookingForm', {})}>
          <Text style={s.moreLink}>{t('moreServices')} →</Text>
        </TouchableOpacity>
      </View>

      {/* Active bookings */}
      <View style={s.section}>
        <View style={s.rowBetween}>
          <SectionTitle>{t('myBookings')}</SectionTitle>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={s.moreLink}>{t('seeAll')} →</Text>
          </TouchableOpacity>
        </View>
        {active.length === 0 ? (
          <Card>
            <Text style={s.empty}>{t('noBookingsYet')} 🌾</Text>
          </Card>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {active.map((b) => {
              const sv = SERVICE_MAP[b.service_type];
              return (
                <Card key={b.id} style={{ width: 220, marginRight: 12 }}>
                  <Text style={s.bkService}>
                    {sv?.emoji} {sv?.mr}
                  </Text>
                  <Text style={s.bkDate}>📅 {b.date}</Text>
                  <View style={{ marginTop: 8 }}>
                    <StatusBadge status={b.status} />
                  </View>
                </Card>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Quick stats */}
      <View style={[s.section, s.statsRow]}>
        <View style={s.stat}>
          <Text style={s.statNum}>{bookings.length}</Text>
          <Text style={s.statLabel}>एकूण बुकिंग्स</Text>
        </View>
        <View style={s.stat}>
          <Text style={s.statNum}>₹{completedCount * 150}</Text>
          <Text style={s.statLabel}>बचत</Text>
        </View>
        <View style={s.stat}>
          <Text style={s.statNum}>{completedCount}</Text>
          <Text style={s.statLabel}>मजुरांना मदत</Text>
        </View>
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  offlineBanner: { backgroundColor: COLORS.danger, padding: 8 },
  offlineText: { color: COLORS.white, textAlign: 'center', fontSize: 13 },
  greetingCard: {
    backgroundColor: COLORS.soil,
    padding: 24,
    paddingTop: 56,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: { fontSize: 24, fontWeight: '800', color: COLORS.cream },
  date: { fontSize: 15, color: COLORS.harvest, marginTop: 6 },
  village: { fontSize: 14, color: COLORS.cream, marginTop: 4, opacity: 0.8 },
  section: { paddingHorizontal: 16, marginTop: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '31%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.harvest,
  },
  tileEmoji: { fontSize: 36 },
  tileMr: { fontSize: 15, fontWeight: '700', color: COLORS.earth, marginTop: 6 },
  tileEn: { fontSize: 11, color: COLORS.clay, marginTop: 2 },
  moreLink: { color: COLORS.leaf, fontWeight: '700', fontSize: 15, marginTop: 4 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  empty: { textAlign: 'center', color: COLORS.clay, fontSize: 16, padding: 12 },
  bkService: { fontSize: 17, fontWeight: '700', color: COLORS.earth },
  bkDate: { fontSize: 14, color: COLORS.clay, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10 },
  stat: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    alignItems: 'center',
    padding: 14,
  },
  statNum: { fontSize: 22, fontWeight: '800', color: COLORS.leaf },
  statLabel: { fontSize: 12, color: COLORS.clay, marginTop: 4, textAlign: 'center' },
});
