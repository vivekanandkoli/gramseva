import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { BigButton, Card, SectionTitle, Stepper } from '../../components/common';
import { COLORS, TIME_SLOTS } from '../../constants/rates';
import { SERVICES, SERVICE_MAP } from '../../constants/services';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore, estimateCost } from '../../store/bookingStore';
import { ServiceType } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

function nextDays(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

const DAY_SHORT = ['रवि', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

export default function BookingFormScreen({ navigation, route }: any) {
  const { t } = useTranslation();
  const user = useAuthStore((st) => st.user);
  const createBooking = useBookingStore((st) => st.createBooking);

  const [service, setService] = useState<ServiceType>(route.params?.service ?? 'chhatni');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[1].key);
  const [acres, setAcres] = useState(1);
  const [workers, setWorkers] = useState(2);
  const [surveyNo, setSurveyNo] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const sv = SERVICE_MAP[service];
  const isMachinery = ['tractor', 'drone', 'pump'].includes(service);
  const cost = useMemo(
    () => estimateCost(service, acres, isMachinery ? 1 : workers),
    [service, acres, workers, isMachinery]
  );

  const onSubmit = async () => {
    setLoading(true);
    try {
      const booking = await createBooking({
        farmer_id: user?.id,
        service_type: service,
        booking_type: isMachinery ? 'machinery' : 'labour',
        date: date.toISOString().slice(0, 10),
        time_slot: TIME_SLOTS.find((ts) => ts.key === timeSlot)?.mr ?? '',
        acres,
        workers_needed: isMachinery ? 0 : workers,
        village: user?.village ?? '',
        field_survey_number: surveyNo,
        special_instructions: instructions,
        estimated_cost_min: cost.min,
        estimated_cost_max: cost.max,
      });
      navigation.replace('BookingSuccess', { bookingId: booking.id });
    } catch {
      Alert.alert(t('errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
      {/* Section 1: Service */}
      <Card style={s.serviceBanner}>
        <Text style={s.serviceEmoji}>{sv.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.serviceMr}>{sv.mr}</Text>
          <Text style={s.serviceEn}>{sv.en}</Text>
        </View>
        <TouchableOpacity style={s.changeBtn} onPress={() => setPickerOpen(true)}>
          <Text style={s.changeBtnText}>{t('change')}</Text>
        </TouchableOpacity>
      </Card>

      {/* Section 2: When */}
      <SectionTitle>📅 {t('selectDate')}</SectionTitle>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {nextDays(14).map((d) => {
          const active = d.toDateString() === date.toDateString();
          return (
            <TouchableOpacity
              key={d.toISOString()}
              style={[s.dateChip, active && s.dateChipActive]}
              onPress={() => setDate(d)}
            >
              <Text style={[s.dateDay, active && { color: COLORS.white }]}>{DAY_SHORT[d.getDay()]}</Text>
              <Text style={[s.dateNum, active && { color: COLORS.white }]}>{d.getDate()}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <SectionTitle>🕖 {t('selectTime')}</SectionTitle>
      <View style={s.slotRow}>
        {TIME_SLOTS.map((ts) => (
          <TouchableOpacity
            key={ts.key}
            style={[s.slot, timeSlot === ts.key && s.slotActive]}
            onPress={() => setTimeSlot(ts.key)}
          >
            <Text style={[s.slotText, timeSlot === ts.key && { color: COLORS.white }]}>{ts.mr}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Section 3: How much */}
      <SectionTitle>🌾 {t('howManyAcres')}</SectionTitle>
      <Stepper value={acres} onChange={setAcres} min={0.5} max={50} step={0.5} suffix="एकर" />

      {!isMachinery && (
        <>
          <SectionTitle>👷 {t('howManyWorkers')}</SectionTitle>
          <Stepper value={workers} onChange={setWorkers} min={1} max={50} suffix="मजूर" />
        </>
      )}
      <Text style={s.durationHint}>⏱ अंदाजे {cost.days} दिवस लागतील</Text>

      {/* Section 4: Where */}
      <SectionTitle>📍 {t('villageName')}</SectionTitle>
      <TextInput style={s.input} value={user?.village ?? ''} editable={false} />
      <SectionTitle>{t('surveyNumber')}</SectionTitle>
      <TextInput
        style={s.input}
        value={surveyNo}
        onChangeText={setSurveyNo}
        placeholder="उदा. गट नं. 245"
      />

      {/* Section 5: Instructions */}
      <SectionTitle>📝 {t('specialInstructions')}</SectionTitle>
      <TextInput
        style={[s.input, { height: 100, textAlignVertical: 'top' }]}
        value={instructions}
        onChangeText={(text) => text.length <= 200 && setInstructions(text)}
        multiline
        placeholder="उदा. द्राक्ष बागेची छाटणी, अनुभवी मजूर हवेत"
      />
      <Text style={s.counter}>{instructions.length}/200</Text>

      {/* Section 6: Cost */}
      <Card style={{ backgroundColor: COLORS.leaf }}>
        <Text style={s.costLabel}>{t('estimatedCost')}</Text>
        <Text style={s.costValue}>
          ₹{cost.min.toLocaleString('en-IN')} – ₹{cost.max.toLocaleString('en-IN')}
        </Text>
      </Card>

      <BigButton title={`${t('sendBooking')} ✓`} onPress={onSubmit} loading={loading} variant="secondary" />

      {/* Service picker modal */}
      <Modal visible={pickerOpen} animationType="slide" transparent>
        <View style={s.modalWrap}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>{t('bookService')}</Text>
            {SERVICES.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={s.modalRow}
                onPress={() => {
                  setService(item.key);
                  setPickerOpen(false);
                }}
              >
                <Text style={{ fontSize: 26, marginRight: 12 }}>{item.emoji}</Text>
                <Text style={s.modalRowText}>
                  {item.mr} · {item.en}
                </Text>
              </TouchableOpacity>
            ))}
            <BigButton title={t('cancel')} variant="outline" onPress={() => setPickerOpen(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  serviceBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.harvest },
  serviceEmoji: { fontSize: 40, marginRight: 14 },
  serviceMr: { fontSize: 20, fontWeight: '800', color: COLORS.earth },
  serviceEn: { fontSize: 13, color: COLORS.soil },
  changeBtn: { backgroundColor: COLORS.earth, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  changeBtnText: { color: COLORS.wheat, fontWeight: '700' },
  dateChip: {
    width: 60,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.harvest,
  },
  dateChipActive: { backgroundColor: COLORS.leaf, borderColor: COLORS.leaf },
  dateDay: { fontSize: 12, color: COLORS.clay },
  dateNum: { fontSize: 20, fontWeight: '800', color: COLORS.earth, marginTop: 2 },
  slotRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.harvest,
    marginRight: 8,
    marginBottom: 8,
  },
  slotActive: { backgroundColor: COLORS.leaf, borderColor: COLORS.leaf },
  slotText: { fontSize: 15, fontWeight: '600', color: COLORS.earth },
  durationHint: { fontSize: 14, color: COLORS.clay, marginTop: 10 },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.harvest,
    padding: 16,
    fontSize: 17,
    color: COLORS.earth,
  },
  counter: { textAlign: 'right', color: COLORS.clay, fontSize: 12, marginTop: 4, marginBottom: 8 },
  costLabel: { color: COLORS.cream, fontSize: 14 },
  costValue: { color: COLORS.white, fontSize: 26, fontWeight: '800', marginTop: 4 },
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: COLORS.cream,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.earth, marginBottom: 12 },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.harvest,
  },
  modalRowText: { fontSize: 17, color: COLORS.earth, fontWeight: '600' },
});
