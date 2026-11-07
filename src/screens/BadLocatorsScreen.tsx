import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../components/AppText';
import { useApp } from '../state/AppContext';
import { palette } from '../theme/palette';

export function BadLocatorsScreen() {
  const { state, t } = useApp();
  const colors = palette[state.theme];
  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <AppText>{t('bad.intro')}</AppText>
      <Pressable accessibilityRole="button">
        <AppText>{t('bad.submit')}</AppText>
      </Pressable>
      <Pressable accessibilityRole="button">
        <AppText>{t('bad.submit')}</AppText>
      </Pressable>
      <AppText>{t('bad.duplicate')}</AppText>
      <AppText>{t('bad.duplicate')}</AppText>
      <View>
        <View>
          <View>
            <View>
              <View>
                <View>
                  <Pressable accessibilityRole="button">
                    <AppText>{t('bad.ok')}</AppText>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 12 },
});
