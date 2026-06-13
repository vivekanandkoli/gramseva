import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Linking } from 'react-native';
import { BigButton, Card } from '../../components/common';
import { COLORS } from '../../constants/rates';
import { SERVICE_MAP } from '../../constants/services';
import { useBookingStore } from '../../store/bookingStore';
import { useTranslation } from '../../hooks/useTranslation';

export default function BookingSuccessScreen({ navigation, route }: any) {
  const { t } = useTranslation();
  const booking = useBookingStore((st) => st.bookings.find((b) => b.id === route.params?.bookingId));
  const scale = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4 }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.4, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  if (!booking) return null;
  const sv = SERVICE_MAP[booking.service_type];

  const shareWhatsApp = () => {
    const msg = `ग्रामसेवा बुकिंग ${booking.booking_number}\nसेवा: ${sv.mr}\nतारीख: ${booking.date}\nवेळ: ${booking.time_slot}\nगाव: ${booking.village} 🌾`;
    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(msg)}`).catch(() =>
      Linking.openURL(`https://wa.me/?text=${encodeURIComponent(msg)}`)
    );
  };

  return (
    <View style={s.container}>
      <Animated.Text style={[s.check, { transform: [{ scale }] }]}>✅</Animated.Text>
      <Text style={s.heading}>{t('bookingRecorded')}</Text>

      <Card style={{ width: '100%', marginTop: 20 }}>
        <Text style={s.bookingNo}>{booking.booking_number}</Text>
        <Row label="सेवा" value={`${sv.emoji} ${sv.mr}`} />
        <Row label="तारीख" value={`${booking.date} · ${booking.time_slot}`} />
        {booking.workers_needed > 0 && <Row label="मजूर" value={`${booking.workers_needed}`} />}
        <Row
          label={t('estimatedCost')}
          value={`₹${booking.estimated_cost_min.toLocaleString('en-IN')} – ₹${booking.estimated_cost_max.toLocaleString('en-IN')}`}
        />
        <Animated.Text style={[s.searching, { opacity: pulse }]}>
          🔍 {t('searchingWorkers')}
        </Animated.Text>
      </Card>

      <BigButton
        title={`💬 ${t('shareOnWhatsApp')}`}
        variant="success"
        onPress={shareWhatsApp}
        style={{ width: '100%', marginTop: 20 }}
      />
      <BigButton
        title={t('goHome')}
        onPress={() => navigation.navigate('Home')}
        style={{ width: '100%', marginTop: 10 }}
      />
      <BigButton
        title={t('bookAnother')}
        variant="outline"
        onPress={() => navigation.replace('BookingForm', {})}
        style={{ width: '100%', marginTop: 10 }}
      />
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  check: { fontSize: 72 },
  heading: { fontSize: 26, fontWeight: '800', color: COLORS.success, marginTop: 12 },
  bookingNo: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.earth,
    textAlign: 'center',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cream,
  },
  rowLabel: { fontSize: 14, color: COLORS.clay },
  rowValue: { fontSize: 15, fontWeight: '700', color: COLORS.earth },
  searching: {
    textAlign: 'center',
    color: '#F97316',
    fontWeight: '700',
    fontSize: 16,
    marginTop: 14,
  },
});
