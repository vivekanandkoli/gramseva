import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/rates';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

const ROLES: { role: UserRole; emoji: string; mr: string; en: string }[] = [
  { role: 'farmer', emoji: '👨‍🌾', mr: 'शेतकरी', en: 'Farmer' },
  { role: 'worker', emoji: '👷', mr: 'मजूर / कंत्राटदार', en: 'Worker / Contractor' },
  { role: 'machinery_owner', emoji: '🚜', mr: 'यंत्र मालक', en: 'Machinery Owner' },
];

export default function RoleSelectScreen({ navigation }: any) {
  const { t } = useTranslation();
  const setSelectedRole = useAuthStore((st) => st.setSelectedRole);

  return (
    <View style={s.container}>
      <Text style={s.heading}>{t('whoAreYou')}</Text>
      {ROLES.map((r) => (
        <TouchableOpacity
          key={r.role}
          style={s.card}
          activeOpacity={0.8}
          onPress={() => {
            setSelectedRole(r.role);
            navigation.navigate('PhoneAuth');
          }}
        >
          <Text style={s.emoji}>{r.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.titleMr}>{r.mr}</Text>
            <Text style={s.titleEn}>{r.en}</Text>
          </View>
          <Text style={s.arrow}>→</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream, padding: 24, justifyContent: 'center' },
  heading: { fontSize: 28, fontWeight: '800', color: COLORS.earth, marginBottom: 28, textAlign: 'center' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 22,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.harvest,
  },
  emoji: { fontSize: 44, marginRight: 18 },
  titleMr: { fontSize: 20, fontWeight: '700', color: COLORS.earth },
  titleEn: { fontSize: 13, color: COLORS.clay, marginTop: 2 },
  arrow: { fontSize: 24, color: COLORS.wheat, fontWeight: '700' },
});
