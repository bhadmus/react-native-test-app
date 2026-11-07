import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AppText } from '../components/AppText';
import { itemForDetail } from '../model/logic';
import type { RootStackParamList } from '../navigation/types';
import { useApp } from '../state/AppContext';
import { palette } from '../theme/palette';

export function ItemDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'ItemDetail'>>();
  const { state, t } = useApp();
  const colors = palette[state.theme];
  const item = itemForDetail(route.params.id);

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <Pressable
        testID="itemDetail.back"
        accessibilityRole="button"
        accessibilityLabel={t('itemDetail.back')}
        onPress={() => navigation.goBack()}>
        <AppText style={{ color: colors.primary }}>{t('itemDetail.back')}</AppText>
      </Pressable>
      {item ? (
        <View style={styles.body}>
          <AppText testID="itemDetail.title" style={styles.title}>
            {item.title}
          </AppText>
          <AppText testID="itemDetail.id">{String(item.id)}</AppText>
          <AppText>{item.subtitle}</AppText>
        </View>
      ) : (
        <AppText testID="itemDetail.missing">{t('itemDetail.missing')}</AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 16 },
  body: { gap: 8 },
  title: { fontSize: 24, fontWeight: '700' },
});
