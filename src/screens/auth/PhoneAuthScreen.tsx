import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { BigButton } from '../../components/common';
import { COLORS } from '../../constants/rates';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';

export default function PhoneAuthScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { sendOtp } = useAuth();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const valid = phone.replace(/\D/g, '').length === 10;

  const onSend = async () => {
    if (!valid) {
      Alert.alert(t('invalidPhone'));
      return;
    }
    setLoading(true);
    try {
      await sendOtp(phone);
      navigation.navigate('OTPVerify');
    } catch (e: any) {
      Alert.alert(e?.message === 'invalid_phone' ? t('invalidPhone') : t('errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.heading}>📱 {t('phoneNumber')}</Text>
      <View style={s.inputRow}>
        <Text style={s.prefix}>+91</Text>
        <TextInput
          style={s.input}
          keyboardType="number-pad"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
          placeholder="98765 43210"
          placeholderTextColor={COLORS.clay}
          autoFocus
        />
      </View>
      <BigButton title={t('sendOtp')} onPress={onSend} loading={loading} disabled={!valid} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream, padding: 24, justifyContent: 'center' },
  heading: { fontSize: 26, fontWeight: '800', color: COLORS.earth, marginBottom: 24, textAlign: 'center' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.wheat,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  prefix: { fontSize: 22, fontWeight: '700', color: COLORS.earth, marginRight: 10 },
  input: { flex: 1, fontSize: 22, paddingVertical: 18, color: COLORS.earth, letterSpacing: 1 },
});
