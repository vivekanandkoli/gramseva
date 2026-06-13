import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, Alert } from 'react-native';
import { Card, BigButton, SectionTitle } from '../../components/common';
import { COLORS } from '../../constants/rates';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../hooks/useTranslation';

const ROLE_LABELS: Record<string, string> = {
  farmer: '👨‍🌾 शेतकरी',
  worker: '👷 मजूर',
  machinery_owner: '🚜 यंत्र मालक',
  coordinator: '🧑‍💼 समन्वयक',
};

export default function ProfileScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16 }}>
      <Card style={{ alignItems: 'center', paddingVertical: 28 }}>
        <Text style={{ fontSize: 64 }}>🧑‍🌾</Text>
        <Text style={s.name}>{user?.name}</Text>
        <Text style={s.role}>{ROLE_LABELS[user?.role ?? 'farmer']}</Text>
        <Text style={s.phone}>{user?.phone}</Text>
      </Card>

      <SectionTitle>📍 ठिकाण</SectionTitle>
      <Card>
        <Row label="गाव" value={user?.village ?? '—'} />
        <Row label="तालुका" value={user?.taluka ?? '—'} />
        <Row label="जिल्हा" value={user?.district ?? 'Sangli'} />
      </Card>

      <SectionTitle>{t('needHelp')}</SectionTitle>
      <BigButton
        title="💬 WhatsApp मदत"
        variant="success"
        onPress={() =>
          Linking.openURL('https://wa.me/919999999999?text=' + encodeURIComponent('मला मदत हवी'))
        }
      />

      <BigButton
        title="बाहेर पडा · Logout"
        variant="outline"
        style={{ marginTop: 12 }}
        onPress={async () => {
          await logout();
          navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
        }}
      />

      <BigButton
        title={t('deleteAccount')}
        variant="danger"
        style={{ marginTop: 12 }}
        onPress={() =>
          Alert.alert(t('deleteAccount'), 'खात्री आहे का?', [
            { text: t('no'), style: 'cancel' },
            {
              text: t('yes'),
              style: 'destructive',
              onPress: async () => {
                await logout();
                navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
              },
            },
          ])
        }
      />
      <Text style={s.version}>GramSeva v1.0.0</Text>
    </ScrollView>
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
  container: { flex: 1, backgroundColor: COLORS.cream },
  name: { fontSize: 24, fontWeight: '800', color: COLORS.earth, marginTop: 8 },
  role: { fontSize: 15, color: COLORS.leaf, fontWeight: '700', marginTop: 4 },
  phone: { fontSize: 14, color: COLORS.clay, marginTop: 4 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cream,
  },
  rowLabel: { fontSize: 15, color: COLORS.clay },
  rowValue: { fontSize: 15, fontWeight: '700', color: COLORS.earth },
  version: { textAlign: 'center', color: COLORS.clay, fontSize: 12, marginVertical: 24 },
});
