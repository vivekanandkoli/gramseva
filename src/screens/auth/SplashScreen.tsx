import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { BigButton } from '../../components/common';
import { COLORS } from '../../constants/rates';
import { useTranslation } from '../../hooks/useTranslation';

export default function SplashScreen({ navigation }: any) {
  const { t } = useTranslation();
  const fade1 = useRef(new Animated.Value(0)).current;
  const fade2 = useRef(new Animated.Value(0)).current;
  const fade3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(250, [
      Animated.timing(fade1, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fade2, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fade3, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={s.container}>
      <Animated.Text style={[s.logo, { opacity: fade1 }]}>🌾</Animated.Text>
      <Animated.View style={{ opacity: fade2, alignItems: 'center' }}>
        <Text style={s.title}>{t('appName')}</Text>
        <Text style={s.subtitle}>GramSeva</Text>
        <Text style={s.tagline}>{t('tagline')}</Text>
      </Animated.View>
      <Animated.View style={[s.buttons, { opacity: fade3 }]}>
        <BigButton title={t('getStarted')} onPress={() => navigation.navigate('RoleSelect')} />
        <BigButton
          title={t('existingAccount')}
          variant="outline"
          style={{ marginTop: 12, borderColor: COLORS.wheat }}
          onPress={() => navigation.navigate('PhoneAuth')}
        />
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.earth,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  logo: { fontSize: 72, marginBottom: 16 },
  title: { fontSize: 44, fontWeight: '900', color: COLORS.wheat },
  subtitle: { fontSize: 18, color: COLORS.harvest, letterSpacing: 4, marginTop: 4 },
  tagline: { fontSize: 16, color: COLORS.cream, marginTop: 12, opacity: 0.8 },
  buttons: { width: '100%', marginTop: 56 },
});
