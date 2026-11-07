import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../components/AppText';
import { AppTextInput } from '../components/AppTextInput';
import { useApp } from '../state/AppContext';
import { palette } from '../theme/palette';

export function LoginScreen() {
  const { state, t, login, signup } = useApp();
  const colors = palette[state.theme];
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailFormatError, setEmailFormatError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmError, setConfirmError] = useState<'signup.confirmRequired' | 'signup.confirmMismatch' | null>(
    null,
  );
  const [authError, setAuthError] = useState<
    'login.locked' | 'login.invalid' | 'signup.reserved' | 'signup.duplicate' | null
  >(null);
  const [busy, setBusy] = useState(false);

  const clearBanner = () => {
    setEmailError(false);
    setEmailFormatError(false);
    setPasswordError(false);
    setConfirmError(null);
    setAuthError(null);
  };

  const switchMode = (next: 'login' | 'signup') => {
    setMode(next);
    setEmail('');
    setPassword('');
    setConfirm('');
    setShowPassword(false);
    clearBanner();
  };

  const submit = async () => {
    if (busy) {
      return;
    }
    setBusy(true);
    const decision = await login(email, password);
    if (decision.status === 'invalid-fields') {
      setEmailError(decision.email);
      setEmailFormatError(false);
      setPasswordError(decision.password);
      setConfirmError(null);
      setAuthError(null);
    } else if (decision.status === 'locked') {
      setEmailError(false);
      setPasswordError(false);
      setAuthError('login.locked');
    } else if (decision.status === 'invalid') {
      setEmailError(false);
      setPasswordError(false);
      setAuthError('login.invalid');
    }
    setBusy(false);
  };

  const submitSignup = async () => {
    if (busy) {
      return;
    }
    setBusy(true);
    const decision = await signup(email, password, confirm);
    if (decision.status === 'invalid-fields') {
      setEmailError(decision.email);
      setEmailFormatError(decision.emailFormat);
      setPasswordError(decision.password);
      setConfirmError(confirmMessage(decision.confirm, confirm));
      setAuthError(null);
    } else if (decision.status === 'reserved' || decision.status === 'duplicate') {
      setEmailError(false);
      setEmailFormatError(false);
      setPasswordError(false);
      setConfirmError(null);
      setAuthError(decision.status === 'reserved' ? 'signup.reserved' : 'signup.duplicate');
    }
    setBusy(false);
  };

  const showBanner =
    emailError || emailFormatError || passwordError || confirmError !== null || authError !== null;

  const bannerText = [
    emailError ? t('login.emailRequired') : '',
    emailFormatError ? t('signup.emailInvalid') : '',
    passwordError ? t('login.passwordRequired') : '',
    confirmError ? t(confirmError) : '',
    authError ? t(authError) : '',
  ].filter(Boolean);

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <AppText style={styles.heading}>{mode === 'login' ? t('login.submit') : t('signup.title')}</AppText>
      <AppTextInput
        testID={mode === 'login' ? 'login.emailInput' : 'signup.emailInput'}
        accessibilityLabel={t('login.email')}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        onChangeText={value => {
          setEmail(value);
          clearBanner();
        }}
        placeholder={t('login.email')}
      />
      <AppTextInput
        testID={mode === 'login' ? 'login.passwordInput' : 'signup.passwordInput'}
        accessibilityLabel={t('login.password')}
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={value => {
          setPassword(value);
          clearBanner();
        }}
        placeholder={t('login.password')}
      />
      {mode === 'signup' ? (
        <AppTextInput
          testID="signup.confirmInput"
          accessibilityLabel={t('signup.confirm')}
          secureTextEntry={!showPassword}
          value={confirm}
          onChangeText={value => {
            setConfirm(value);
            clearBanner();
          }}
          placeholder={t('signup.confirm')}
        />
      ) : null}
      <Pressable
        testID={mode === 'login' ? 'login.passwordToggle' : 'signup.passwordToggle'}
        accessibilityRole="button"
        accessibilityLabel={showPassword ? t('login.hidePassword') : t('login.showPassword')}
        onPress={() => setShowPassword(current => !current)}>
        <AppText style={{ color: colors.primary }}>
          {showPassword ? t('login.hidePassword') : t('login.showPassword')}
        </AppText>
      </Pressable>
      {showBanner ? (
        <View
          testID={mode === 'login' ? 'login.errorBanner' : 'signup.errorBanner'}
          accessibilityRole="alert"
          accessibilityLabel={bannerText.join('. ')}
          style={[styles.banner, { backgroundColor: colors.card, borderColor: colors.danger }]}>
          {bannerText.map(line => (
            <AppText key={line}>{line}</AppText>
          ))}
        </View>
      ) : null}
      <Pressable
        testID={mode === 'login' ? 'login.submitButton' : 'signup.submitButton'}
        accessibilityRole="button"
        accessibilityLabel={mode === 'login' ? t('login.submit') : t('signup.submit')}
        disabled={busy}
        onPress={() => {
          void (mode === 'login' ? submit() : submitSignup());
        }}
        style={[styles.button, { backgroundColor: busy ? colors.border : colors.primary }]}>
        <AppText style={styles.buttonText}>
          {mode === 'login' ? t('login.submit') : t('signup.submit')}
        </AppText>
      </Pressable>
      <Pressable
        testID={mode === 'login' ? 'login.signupLink' : 'signup.loginLink'}
        accessibilityRole="button"
        accessibilityLabel={mode === 'login' ? t('login.signup') : t('signup.login')}
        onPress={() => switchMode(mode === 'login' ? 'signup' : 'login')}>
        <AppText style={{ color: colors.primary }}>
          {mode === 'login' ? t('login.signup') : t('signup.login')}
        </AppText>
      </Pressable>
    </View>
  );
}

function confirmMessage(
  invalid: boolean,
  confirm: string,
): 'signup.confirmRequired' | 'signup.confirmMismatch' | null {
  if (!invalid) {
    return null;
  }
  return confirm.length === 0 ? 'signup.confirmRequired' : 'signup.confirmMismatch';
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
    gap: 12,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
  },
  banner: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
