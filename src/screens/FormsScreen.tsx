import { useState, type ReactNode } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { AppText } from '../components/AppText';
import { AppTextInput } from '../components/AppTextInput';
import type { StringKey } from '../i18n/strings';
import { useApp } from '../state/AppContext';
import { palette } from '../theme/palette';

const COUNTRIES = ['Canada', 'France', 'Japan'] as const;
type Country = (typeof COUNTRIES)[number];
type Plan = 'basic' | 'pro';

type Errors = {
  name: boolean;
  email: boolean;
  quantity: boolean;
  date: boolean;
  country: boolean;
  terms: boolean;
  plan: boolean;
};

const emptyErrors: Errors = {
  name: false,
  email: false,
  quantity: false,
  date: false,
  country: false,
  terms: false,
  plan: false,
};

function formatDate(value: Date): string {
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${value.getFullYear()}-${month}-${day}`;
}

function dateFromValue(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return new Date();
  }
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0, 0);
}

export function FormsScreen() {
  const { state, t } = useApp();
  const colors = palette[state.theme];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [showDate, setShowDate] = useState(false);
  const [country, setCountry] = useState<Country | null>(null);
  const [showCountries, setShowCountries] = useState(false);
  const [terms, setTerms] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [newsletter, setNewsletter] = useState(false);
  const [rating, setRating] = useState(5);
  const [errors, setErrors] = useState<Errors>(emptyErrors);
  const [saved, setSaved] = useState(false);

  const clear = (key: keyof Errors) => {
    setErrors(current => ({ ...current, [key]: false }));
  };

  const submit = () => {
    const quantityNumber = Number(quantity);
    const next: Errors = {
      name: name.trim().length === 0,
      email: !email.includes('@'),
      quantity:
        !/^\d+$/.test(quantity) || quantityNumber < 1 || quantityNumber > 10,
      date: !/^\d{4}-\d{2}-\d{2}$/.test(dateValue),
      country: country === null,
      terms: !terms,
      plan: plan === null,
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      return;
    }
    setSaved(true);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setQuantity('');
    setDateValue('');
    setCountry(null);
    setTerms(false);
    setPlan(null);
    setNewsletter(false);
    setRating(5);
    setErrors(emptyErrors);
    setSaved(false);
  };

  const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowDate(false);
    }
    if (event.type === 'dismissed' || !selected) {
      return;
    }
    setDateValue(formatDate(selected));
    clear('date');
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.content, { backgroundColor: colors.bg }]}>
      <Field label={t('forms.name')} error={errors.name ? t('forms.nameRequired') : null} errorId="forms.error.name">
        <AppTextInput
          testID="forms.nameInput"
          accessibilityLabel={t('forms.name')}
          value={name}
          onChangeText={value => {
            setName(value);
            clear('name');
          }}
        />
      </Field>
      <Field label={t('forms.email')} error={errors.email ? t('forms.emailInvalid') : null} errorId="forms.error.email">
        <AppTextInput
          testID="forms.emailInput"
          accessibilityLabel={t('forms.email')}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={value => {
            setEmail(value);
            clear('email');
          }}
        />
      </Field>
      <Field label={t('forms.quantity')} error={errors.quantity ? t('forms.quantityInvalid') : null} errorId="forms.error.quantity">
        <AppTextInput
          testID="forms.quantityInput"
          accessibilityLabel={t('forms.quantity')}
          keyboardType="number-pad"
          value={quantity}
          onChangeText={value => {
            setQuantity(value);
            clear('quantity');
          }}
        />
      </Field>
      <Field label={t('forms.date')} error={errors.date ? t('forms.dateRequired') : null} errorId="forms.error.date">
        <Pressable
          testID="forms.dateButton"
          accessibilityRole="button"
          accessibilityLabel={t('forms.chooseDate')}
          onPress={() => setShowDate(current => !current)}
          style={[styles.choice, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <AppText>{dateValue || t('forms.chooseDate')}</AppText>
        </Pressable>
        <AppText testID="forms.dateValue">{dateValue}</AppText>
        {showDate ? (
          <DateTimePicker
            value={dateFromValue(dateValue)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
          />
        ) : null}
      </Field>
      <Field label={t('forms.country')} error={errors.country ? t('forms.countryRequired') : null} errorId="forms.error.country">
        <Pressable
          testID="forms.countrySelect"
          accessibilityRole="button"
          accessibilityLabel={t('forms.country')}
          onPress={() => setShowCountries(true)}
          style={[styles.choice, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <AppText testID="forms.countryValue">
            {country ? t(`forms.country.${country}` as StringKey) : t('forms.country')}
          </AppText>
        </Pressable>
      </Field>
      <Pressable
        testID="forms.termsCheckbox"
        accessibilityRole="checkbox"
        accessibilityState={{ checked: terms }}
        accessibilityLabel={t('forms.terms')}
        onPress={() => {
          setTerms(current => !current);
          clear('terms');
        }}
        style={styles.row}>
        <View style={[styles.box, { borderColor: colors.primary, backgroundColor: terms ? colors.primary : colors.bg }]} />
        <AppText>{t('forms.terms')}</AppText>
      </Pressable>
      {errors.terms ? <AppText testID="forms.error.terms">{t('forms.termsRequired')}</AppText> : null}
      <AppText>{t('forms.plan')}</AppText>
      <Pressable
        testID="forms.planBasic"
        accessibilityRole="radio"
        accessibilityState={{ selected: plan === 'basic' }}
        accessibilityLabel={t('forms.planBasic')}
        onPress={() => {
          setPlan('basic');
          clear('plan');
        }}>
        <AppText>{t('forms.planBasic')}</AppText>
      </Pressable>
      <Pressable
        testID="forms.planPro"
        accessibilityRole="radio"
        accessibilityState={{ selected: plan === 'pro' }}
        accessibilityLabel={t('forms.planPro')}
        onPress={() => {
          setPlan('pro');
          clear('plan');
        }}>
        <AppText>{t('forms.planPro')}</AppText>
      </Pressable>
      {errors.plan ? <AppText testID="forms.error.plan">{t('forms.planRequired')}</AppText> : null}
      <View style={styles.row}>
        <AppText>{t('forms.newsletter')}</AppText>
        <Switch
          testID="forms.newsletterSwitch"
          accessibilityLabel={t('forms.newsletter')}
          value={newsletter}
          onValueChange={setNewsletter}
        />
      </View>
      <AppText>{t('forms.rating')}</AppText>
      <AppText testID="forms.ratingValue">{String(rating)}</AppText>
      <View
        testID="forms.ratingSlider"
        accessibilityLabel={t('forms.rating')}
        accessibilityRole="adjustable"
        accessibilityValue={{ min: 0, max: 10, now: rating }}>
        <Pressable accessibilityLabel="0" onPress={() => setRating(0)}><AppText>0</AppText></Pressable>
        <Pressable accessibilityLabel="10" onPress={() => setRating(10)}><AppText>10</AppText></Pressable>
        <View
          onStartShouldSetResponder={() => true}
          onResponderRelease={event => {
            const width = 280;
            const ratio = Math.min(1, Math.max(0, event.nativeEvent.locationX / width));
            setRating(Math.round(ratio * 10));
          }}
          style={[styles.slider, { backgroundColor: colors.border }]}>
          <View style={[styles.sliderFill, { width: `${rating * 10}%`, backgroundColor: colors.primary }]} />
        </View>
      </View>
      <Pressable
        testID="forms.submitButton"
        accessibilityRole="button"
        accessibilityLabel={t('forms.submit')}
        onPress={submit}
        style={[styles.button, { backgroundColor: colors.primary }]}>
        <AppText style={styles.buttonText}>{t('forms.submit')}</AppText>
      </Pressable>
      <Modal visible={showCountries} transparent animationType={state.disableAnimations ? 'none' : 'fade'}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            {COUNTRIES.map(option => (
              <Pressable
                key={option}
                testID={`forms.country.${option}`}
                accessibilityRole="button"
                accessibilityLabel={t(`forms.country.${option}` as StringKey)}
                onPress={() => {
                  setCountry(option);
                  clear('country');
                  setShowCountries(false);
                }}>
                <AppText>{t(`forms.country.${option}` as StringKey)}</AppText>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
      <Modal visible={saved} transparent animationType={state.disableAnimations ? 'none' : 'fade'}>
        <View style={styles.modalBackdrop}>
          <View testID="forms.successModal" style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <AppText>{t('forms.saved')}</AppText>
            <Pressable
              testID="forms.successOk"
              accessibilityRole="button"
              accessibilityLabel={t('forms.ok')}
              onPress={resetForm}>
              <AppText style={{ color: colors.primary }}>{t('forms.ok')}</AppText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function Field({
  label,
  error,
  errorId,
  children,
}: {
  label: string;
  error: string | null;
  errorId: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.field}>
      <AppText>{label}</AppText>
      {children}
      {error ? <AppText testID={errorId}>{error}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  field: { gap: 6 },
  choice: { borderWidth: 1, borderRadius: 8, padding: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  box: { width: 22, height: 22, borderWidth: 2, borderRadius: 4 },
  slider: { height: 28, borderRadius: 14, justifyContent: 'center' },
  sliderFill: { height: 28, borderRadius: 14 },
  button: { borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '700' },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCard: { borderRadius: 12, padding: 20, gap: 16 },
});
