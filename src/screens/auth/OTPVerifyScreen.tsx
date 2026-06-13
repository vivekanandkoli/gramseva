import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/rates';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';

export default function OTPVerifyScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { verifyOtp, sendOtp } = useAuth();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const refs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const onDigit = async (text: string, i: number) => {
    const next = [...digits];
    next[i] = text.slice(-1);
    setDigits(next);
    setError(false);
    if (text && i < 5) refs.current[i + 1]?.focus();

    const otp = next.join('');
    if (otp.length === 6) {
      try {
        const { isNewUser } = await verifyOtp(otp);
        navigation.reset({
          index: 0,
          routes: [{ name: isNewUser ? 'ProfileSetup' : 'Main' }],
        });
      } catch {
        setError(true);
        setDigits(['', '', '', '', '', '']);
        refs.current[0]?.focus();
      }
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.heading}>🔐 {t('enterOtp')}</Text>
      <View style={s.boxes}>
        {digits.map((d, i) => (
          <TextInput
            key={i}
            ref={(r) => { refs.current[i] = r; }}
            style={[s.box, error && s.boxError]}
            keyboardType="number-pad"
            maxLength={1}
            value={d}
            onChangeText={(text) => onDigit(text, i)}
            autoFocus={i === 0}
          />
        ))}
      </View>
      {error && <Text style={s.error}>{t('wrongOtp')}</Text>}
      <Text
        style={[s.resend, countdown === 0 && { color: COLORS.leaf, fontWeight: '700' }]}
        onPress={() => {
          if (countdown === 0) {
            setCountdown(45);
            sendOtp('');
          }
        }}
      >
        {t('resendOtp')} {countdown > 0 ? `(${countdown} सेकंद)` : ''}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream, padding: 24, justifyContent: 'center' },
  heading: { fontSize: 26, fontWeight: '800', color: COLORS.earth, marginBottom: 28, textAlign: 'center' },
  boxes: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  box: {
    width: 50,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.wheat,
    backgroundColor: COLORS.white,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS.earth,
  },
  boxError: { borderColor: COLORS.danger },
  error: { color: COLORS.danger, textAlign: 'center', fontSize: 16, marginBottom: 8 },
  resend: { textAlign: 'center', color: COLORS.clay, fontSize: 16, marginTop: 16 },
});
