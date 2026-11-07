import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../components/AppText';
import { flakyDelayMs, flakyToastCovers } from '../model/logic';
import { useApp } from '../state/AppContext';
import { palette } from '../theme/palette';

export function FlakyScreen() {
  const { state, t } = useApp();
  const colors = palette[state.theme];
  const [waiting, setWaiting] = useState(false);
  const [result, setResult] = useState(false);
  const [toast, setToast] = useState(flakyToastCovers(state.flakySeed));

  useEffect(() => {
    setToast(flakyToastCovers(state.flakySeed));
  }, [state.flakySeed]);

  useEffect(() => {
    if (!waiting) {
      return;
    }
    const timer = setTimeout(() => {
      setWaiting(false);
      setResult(true);
    }, flakyDelayMs(state.flakySeed));
    return () => clearTimeout(timer);
  }, [state.flakySeed, waiting]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <Pressable
        testID="flaky.delayButton"
        accessibilityRole="button"
        accessibilityLabel={t('flaky.delay')}
        onPress={() => {
          setResult(false);
          setWaiting(true);
        }}
        style={[styles.button, { backgroundColor: colors.primary }]}>
        <AppText style={styles.buttonText}>{t('flaky.delay')}</AppText>
      </Pressable>
      {waiting ? (
        <View>
          <ActivityIndicator />
          <AppText testID="flaky.spinner">{t('items.loading')}</AppText>
        </View>
      ) : null}
      <AppText testID="flaky.result">{result ? t('flaky.result') : ''}</AppText>
      <View>
        <Pressable
          testID="flaky.coveredButton"
          accessibilityRole="button"
          accessibilityLabel={t('flaky.covered')}
          onPress={() => undefined}
          style={[styles.button, styles.covered, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <AppText>{t('flaky.covered')}</AppText>
        </Pressable>
        {toast ? (
          <View
            testID="flaky.toast"
            accessibilityLabel={t('flaky.toast')}
            style={[styles.toast, { backgroundColor: colors.danger }]}>
            <AppText style={styles.buttonText}>{t('flaky.toast')}</AppText>
            <Pressable
              testID="flaky.toastDismiss"
              accessibilityRole="button"
              accessibilityLabel={t('flaky.dismiss')}
              onPress={() => setToast(false)}>
              <AppText style={styles.buttonText}>{t('flaky.dismiss')}</AppText>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 16 },
  button: { borderRadius: 8, padding: 16, alignItems: 'center' },
  buttonText: { color: '#ffffff' },
  covered: { borderWidth: 1 },
  toast: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 12,
    gap: 8,
    borderRadius: 8,
  },
});
