import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { AppText } from '../components/AppText';
import { AppTextInput } from '../components/AppTextInput';
import { appendUnique, createRequestGate, delay, queryItems } from '../model/logic';
import type { Item } from '../model/types';
import { useApp } from '../state/AppContext';
import { palette } from '../theme/palette';

export function ItemsScreen() {
  const navigation = useNavigation();
  const { state, t, deleteItem } = useApp();
  const colors = palette[state.theme];
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const gate = useRef(createRequestGate()).current;
  const deletedRef = useRef(state.deletedIds);
  deletedRef.current = state.deletedIds;

  const load = useCallback(
    async (nextPage: number, nextQuery: string, append: boolean) => {
      const requestId = gate.start();
      if (append) {
        setLoadingMore(true);
      }
      await delay(state.latencyMs);
      if (!gate.isCurrent(requestId)) {
        return;
      }
      const pageResult = queryItems({
        page: nextPage,
        query: nextQuery,
        deletedIds: deletedRef.current,
        knownBug: state.knownBug,
      });
      setRows(current =>
        append ? appendUnique(current, pageResult.items) : pageResult.items,
      );
      setPage(nextPage);
      setHasMore(pageResult.hasMore);
      setLoadingMore(false);
      setRefreshing(false);
      setLoaded(true);
    },
    [gate, state.knownBug, state.latencyMs],
  );

  useEffect(() => {
    void load(1, query, false);
  }, [load, query, state.deletedIds, state.knownBug]);

  const openItem = (id: number) => {
    const parent = navigation.getParent() as
      | { navigate: (name: string, params?: object) => void }
      | undefined;
    parent?.navigate('ItemDetail', { id });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <View style={styles.searchRow}>
        <AppTextInput
          testID="items.searchInput"
          accessibilityLabel={t('items.search')}
          value={query}
          onChangeText={setQuery}
          placeholder={t('items.search')}
          style={styles.search}
        />
        <Pressable
          testID="items.searchClear"
          accessibilityRole="button"
          accessibilityLabel={t('items.clear')}
          onPress={() => setQuery('')}>
          <AppText style={{ color: colors.primary }}>{t('items.clear')}</AppText>
        </Pressable>
      </View>
      <FlatList
        testID="items.list"
        data={rows}
        keyExtractor={item => String(item.id)}
        initialNumToRender={20}
        removeClippedSubviews={false}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!loaded || !hasMore || loadingMore) {
            return;
          }
          void load(page + 1, query, true);
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              void load(1, query, false);
            }}
          />
        }
        ListEmptyComponent={
          loaded ? <AppText testID="items.empty">{t('items.empty')}</AppText> : undefined
        }
        ListFooterComponent={
          loadingMore ? (
            <View>
              <ActivityIndicator />
              <AppText testID="items.loadingMore">{t('items.loading')}</AppText>
            </View>
          ) : undefined
        }
        renderItem={({ item }) => (
          <ReanimatedSwipeable
            renderRightActions={() => (
              <Pressable
                testID={`items.delete.${item.id}`}
                accessibilityRole="button"
                accessibilityLabel={t('items.delete')}
                onPress={() => {
                  void deleteItem(item.id);
                }}
                style={[styles.delete, { backgroundColor: colors.danger }]}>
                <AppText style={styles.deleteText}>{t('items.delete')}</AppText>
              </Pressable>
            )}>
            <Pressable
              testID={`items.row.${item.id}`}
              accessibilityRole="button"
              accessibilityLabel={item.title}
              onPress={() => openItem(item.id)}
              style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <AppText>{item.title}</AppText>
              <AppText style={{ color: colors.muted }}>{item.subtitle}</AppText>
            </Pressable>
          </ReanimatedSwipeable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  search: { flex: 1 },
  row: {
    padding: 16,
    borderBottomWidth: 1,
  },
  delete: {
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  deleteText: { color: '#ffffff' },
});
