import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { BigButton, SectionTitle } from '../../components/common';
import { COLORS, TALUKA_LIST } from '../../constants/rates';
import { SERVICES } from '../../constants/services';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { ServiceType } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

export default function ProfileSetupScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { createProfile } = useAuth();
  const selectedRole = useAuthStore((st) => st.selectedRole) ?? 'farmer';
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [taluka, setTaluka] = useState(TALUKA_LIST[0]);
  const [skills, setSkills] = useState<ServiceType[]>([]);
  const [dailyRate, setDailyRate] = useState('500');
  const [loading, setLoading] = useState(false);

  const isWorker = selectedRole === 'worker';

  const toggleSkill = (key: ServiceType) =>
    setSkills((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const onSubmit = async () => {
    if (!name.trim() || !village.trim()) {
      Alert.alert(t('required'));
      return;
    }
    setLoading(true);
    try {
      await createProfile({
        name: name.trim(),
        village: village.trim(),
        taluka,
        role: selectedRole,
        skills,
        dailyRate: parseInt(dailyRate, 10) || 0,
      });
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch {
      Alert.alert(t('errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
      <Text style={s.heading}>{t('register')}</Text>

      <SectionTitle>{t('yourName')}</SectionTitle>
      <TextInput style={s.input} value={name} onChangeText={setName} placeholder="उदा. विवेक पाटील" />

      <SectionTitle>{t('villageName')}</SectionTitle>
      <TextInput style={s.input} value={village} onChangeText={setVillage} placeholder="उदा. अगलगाव" />

      <SectionTitle>{t('taluka')}</SectionTitle>
      <View style={s.chips}>
        {TALUKA_LIST.map((tk) => (
          <TouchableOpacity
            key={tk}
            style={[s.chip, taluka === tk && s.chipActive]}
            onPress={() => setTaluka(tk)}
          >
            <Text style={[s.chipText, taluka === tk && s.chipTextActive]}>{tk}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isWorker && (
        <>
          <SectionTitle>{t('selectSkills')}</SectionTitle>
          <View style={s.chips}>
            {SERVICES.map((sv) => (
              <TouchableOpacity
                key={sv.key}
                style={[s.chip, skills.includes(sv.key) && s.chipActive]}
                onPress={() => toggleSkill(sv.key)}
              >
                <Text style={[s.chipText, skills.includes(sv.key) && s.chipTextActive]}>
                  {sv.emoji} {sv.mr}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <SectionTitle>{t('dailyRate')}</SectionTitle>
          <TextInput
            style={s.input}
            value={dailyRate}
            onChangeText={setDailyRate}
            keyboardType="number-pad"
          />
        </>
      )}

      <BigButton
        title={t('completeRegistration')}
        onPress={onSubmit}
        loading={loading}
        style={{ marginTop: 24 }}
      />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  heading: { fontSize: 28, fontWeight: '800', color: COLORS.earth, marginBottom: 16 },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.harvest,
    padding: 16,
    fontSize: 18,
    color: COLORS.earth,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.harvest,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: COLORS.leaf, borderColor: COLORS.leaf },
  chipText: { fontSize: 15, color: COLORS.earth, fontWeight: '600' },
  chipTextActive: { color: COLORS.white },
});
