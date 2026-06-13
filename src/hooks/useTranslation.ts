import { create } from 'zustand';
import { strings, StringKey, Locale } from '../i18n/marathi';

interface LocaleState {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: 'mr',
  setLocale: (locale) => set({ locale }),
}));

export function useTranslation() {
  const { locale, setLocale } = useLocaleStore();

  // t() returns the primary-locale string; tBoth() returns "मराठी · English"
  const t = (key: StringKey) => strings[key][locale];
  const tBoth = (key: StringKey) => `${strings[key].mr} · ${strings[key].en}`;

  return { t, tBoth, locale, setLocale };
}
