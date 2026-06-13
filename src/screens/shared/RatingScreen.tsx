import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { BigButton } from '../../components/common';
import { COLORS } from '../../constants/rates';
import { supabase, isSupabaseConfigured } from '../../services/supabase';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../hooks/useTranslation';

export default function RatingScreen({ navigation, route }: any) {
  const { t } = useTranslation();
  const user = useAuthStore((st) => st.user);
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && route.params?.bookingId && user) {
        await supabase.from('ratings').insert({
          booking_id: route.params.bookingId,
          rated_by: user.id,
          rated_user_id: route.params?.ratedUserId ?? user.id,
          score,
          comment,
        });
      }
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.heading}>काम कसे झाले? ⭐</Text>
      <View style={s.stars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} onPress={() => setScore(n)}>
            <Text style={[s.star, { opacity: n <= score ? 1 : 0.25 }]}>⭐</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={s.input}
        value={comment}
        onChangeText={setComment}
        placeholder="अभिप्राय लिहा (ऐच्छिक)"
        multiline
      />
      <BigButton
        title={t('giveRating')}
        variant="secondary"
        onPress={submit}
        disabled={score === 0}
        loading={loading}
      />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={s.skip}>{t('skip')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream, padding: 24, justifyContent: 'center' },
  heading: { fontSize: 26, fontWeight: '800', color: COLORS.earth, textAlign: 'center' },
  stars: { flexDirection: 'row', justifyContent: 'center', marginVertical: 28, gap: 8 },
  star: { fontSize: 44 },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.harvest,
    padding: 16,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  skip: { textAlign: 'center', color: COLORS.clay, fontSize: 16, marginTop: 18 },
});
