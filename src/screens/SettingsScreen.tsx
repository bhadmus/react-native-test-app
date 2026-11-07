import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../components/AppText';
import { AppTextInput } from '../components/AppTextInput';
import { useApp } from '../state/AppContext';
import { palette } from '../theme/palette';

export function SettingsScreen() {
  const navigation = useNavigation();
  const { state, t, logout, reset, setLanguage, setTheme, setKnownBug, setLatency, setFlakySeed } = useApp();
  const colors = palette[state.theme];
  const [latencyText, setLatencyText] = useState(String(state.latencyMs));
  const [seedText, setSeedText] = useState(String(state.flakySeed));
  const [latencyError, setLatencyError] = useState(false);
  const [seedError, setSeedError] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setLatencyText(String(state.latencyMs));
  }, [state.latencyMs]);

  useEffect(() => {
    setSeedText(String(state.flakySeed));
  }, [state.flakySeed]);

  const open = (name: 'Flaky' | 'BadLocators') => {
    const parent = navigation.getParent() as { navigate: (screen: string) => void } | undefined;
    parent?.navigate(name);
  };

  return (
    <ScrollView contentContainerStyle={[styles.content, { backgroundColor: colors.bg }]}>
      <View style={styles.row}>
        <AppText>{t('settings.theme')}</AppText>
        <Switch
          testID="settings.themeSwitch"
          accessibilityLabel={t('settings.theme')}
          value={state.theme === 'dark'}
          onValueChange={enabled => {
            void setTheme(enabled ? 'dark' : 'light');
          }}
        />
      </View>
      <Pressable
        testID="settings.languageEn"
        accessibilityRole="button"
        accessibilityLabel={t('settings.english')}
        onPress={() => {
          void setLanguage('en');
        }}>
        <AppText>{t('settings.english')}</AppText>
      </Pressable>
      <Pressable
        testID="settings.languageFr"
        accessibilityRole="button"
        accessibilityLabel={t('settings.french')}
        onPress={() => {
          void setLanguage('fr');
        }}>
        <AppText>{t('settings.french')}</AppText>
      </Pressable>
      <Pressable
        testID="settings.logoutButton"
        accessibilityRole="button"
        accessibilityLabel={t('settings.logout')}
        onPress={() => {
          void logout();
        }}>
        <AppText>{t('settings.logout')}</AppText>
      </Pressable>
      <Pressable
        testID="settings.resetButton"
        accessibilityRole="button"
        accessibilityLabel={t('settings.reset')}
        onPress={() => setConfirmReset(true)}>
        <AppText>{t('settings.reset')}</AppText>
      </Pressable>
      <View style={styles.row}>
        <AppText>{t('settings.knownBug')}</AppText>
        <Switch
          testID="settings.knownBugSwitch"
          accessibilityLabel={t('settings.knownBug')}
          value={state.knownBug}
          onValueChange={enabled => {
            void setKnownBug(enabled);
          }}
        />
      </View>
      <Pressable
        testID="settings.flakyLink"
        accessibilityRole="button"
        accessibilityLabel={t('settings.flaky')}
        onPress={() => open('Flaky')}>
        <AppText style={{ color: colors.primary }}>{t('settings.flaky')}</AppText>
      </Pressable>
      <Pressable
        testID="settings.badLocatorsLink"
        accessibilityRole="button"
        accessibilityLabel={t('settings.bad')}
        onPress={() => open('BadLocators')}>
        <AppText style={{ color: colors.primary }}>{t('settings.bad')}</AppText>
      </Pressable>
      <AppText style={styles.heading}>{t('settings.controls')}</AppText>
      <AppTextInput
        testID="settings.latencyInput"
        accessibilityLabel={t('settings.latency')}
        keyboardType="number-pad"
        value={latencyText}
        onChangeText={value => {
          setLatencyText(value);
          setLatencyError(false);
        }}
      />
      {latencyError ? (
        <AppText testID="settings.latencyError">{t('settings.latencyError')}</AppText>
      ) : null}
      <Pressable
        testID="settings.applyLatencyButton"
        accessibilityRole="button"
        accessibilityLabel={t('settings.applyLatency')}
        onPress={() => {
          if (!/^\d+$/.test(latencyText.trim())) {
            setLatencyError(true);
            return;
          }
          void setLatency(Number(latencyText.trim()));
        }}>
        <AppText>{t('settings.applyLatency')}</AppText>
      </Pressable>
      <AppTextInput
        testID="settings.flakySeedInput"
        accessibilityLabel={t('settings.seed')}
        keyboardType="numbers-and-punctuation"
        value={seedText}
        onChangeText={value => {
          setSeedText(value);
          setSeedError(false);
        }}
      />
      {seedError ? <AppText testID="settings.seedError">{t('settings.seedError')}</AppText> : null}
      <Pressable
        testID="settings.applySeedButton"
        accessibilityRole="button"
        accessibilityLabel={t('settings.applySeed')}
        onPress={() => {
          if (!/^-?\d+$/.test(seedText.trim())) {
            setSeedError(true);
            return;
          }
          void setFlakySeed(Number(seedText.trim()));
        }}>
        <AppText>{t('settings.applySeed')}</AppText>
      </Pressable>
      <Modal visible={confirmReset} transparent animationType={state.disableAnimations ? 'none' : 'fade'}>
        <View style={styles.backdrop}>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <AppText>{t('settings.resetTitle')}</AppText>
            <Pressable
              testID="settings.resetConfirm"
              accessibilityRole="button"
              accessibilityLabel={t('settings.confirm')}
              onPress={() => {
                setConfirmReset(false);
                void reset();
              }}>
              <AppText>{t('settings.confirm')}</AppText>
            </Pressable>
            <Pressable
              testID="settings.resetCancel"
              accessibilityRole="button"
              accessibilityLabel={t('settings.cancel')}
              onPress={() => setConfirmReset(false)}>
              <AppText>{t('settings.cancel')}</AppText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heading: { fontSize: 20, fontWeight: '700', marginTop: 8 },
  backdrop: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'rgba(0,0,0,0.4)' },
  card: { borderRadius: 12, padding: 20, gap: 16 },
});
