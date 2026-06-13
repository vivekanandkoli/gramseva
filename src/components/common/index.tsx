import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { COLORS, STATUS_COLORS } from '../../constants/rates';
import { BookingStatus } from '../../types';
import { strings } from '../../i18n/marathi';

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: strings.statusPending.mr,
  searching: strings.statusSearching.mr,
  confirmed: strings.statusConfirmed.mr,
  in_progress: strings.statusInProgress.mr,
  completed: strings.statusCompleted.mr,
  cancelled: strings.statusCancelled.mr,
};

export function BigButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const bg = {
    primary: COLORS.wheat,
    secondary: COLORS.leaf,
    outline: 'transparent',
    danger: COLORS.danger,
    success: COLORS.success,
  }[variant];
  const fg = variant === 'primary' ? COLORS.earth : variant === 'outline' ? COLORS.earth : COLORS.white;
  return (
    <TouchableOpacity
      style={[
        s.btn,
        { backgroundColor: bg, opacity: disabled ? 0.5 : 1 },
        variant === 'outline' && { borderWidth: 2, borderColor: COLORS.clay },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? <ActivityIndicator color={fg} /> : <Text style={[s.btnText, { color: fg }]}>{title}</Text>}
    </TouchableOpacity>
  );
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <View style={[s.badge, { backgroundColor: STATUS_COLORS[status] }]}>
      <Text style={s.badgeText}>{STATUS_LABELS[status]}</Text>
    </View>
  );
}

export function Stepper({
  value,
  onChange,
  min = 1,
  max = 100,
  step = 1,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <View style={s.stepper}>
      <TouchableOpacity
        style={s.stepBtn}
        onPress={() => onChange(Math.max(min, +(value - step).toFixed(1)))}
      >
        <Text style={s.stepBtnText}>−</Text>
      </TouchableOpacity>
      <Text style={s.stepValue}>
        {value}
        {suffix ? ` ${suffix}` : ''}
      </Text>
      <TouchableOpacity
        style={s.stepBtn}
        onPress={() => onChange(Math.min(max, +(value + step).toFixed(1)))}
      >
        <Text style={s.stepBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={s.sectionTitle}>{children}</Text>;
}

const s = StyleSheet.create({
  btn: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  btnText: { fontSize: 18, fontWeight: '700' },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: COLORS.earth },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 8,
  },
  stepBtn: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.wheat,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: { fontSize: 28, fontWeight: '700', color: COLORS.earth },
  stepValue: { fontSize: 26, fontWeight: '700', color: COLORS.earth },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.earth,
    marginBottom: 10,
    marginTop: 8,
  },
});
