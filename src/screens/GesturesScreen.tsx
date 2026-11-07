import { useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { AppText } from '../components/AppText';
import { useApp } from '../state/AppContext';
import { palette } from '../theme/palette';

type Rect = { x: number; y: number; width: number; height: number };
type Measurable = {
  measureInWindow: (
    callback: (x: number, y: number, width: number, height: number) => void,
  ) => void;
};

export function GesturesScreen() {
  const { state, t } = useApp();
  const colors = palette[state.theme];
  const [swiped, setSwiped] = useState(false);
  const [longPressed, setLongPressed] = useState(false);
  const [doubleTapped, setDoubleTapped] = useState(false);
  const lastTap = useRef(0);
  const [drop, setDrop] = useState<'none' | 'A' | 'B'>('none');
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const zoneA = useRef<Measurable | null>(null);
  const zoneB = useRef<Measurable | null>(null);
  const bounds = useRef<{ a?: Rect; b?: Rect }>({});

  const remember = (key: 'a' | 'b', node: Measurable | null) => {
    node?.measureInWindow((x, y, width, height) => {
      bounds.current[key] = { x, y, width, height };
    });
  };

  const resolveDrop = (x: number, y: number) => {
    const hit = (rect?: Rect) =>
      !!rect && x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
    if (hit(bounds.current.a)) {
      setDrop('A');
    } else if (hit(bounds.current.b)) {
      setDrop('B');
    } else {
      setDrop('none');
    }
  };

  const pan = Gesture.Pan()
    .runOnJS(true)
    .onUpdate(event => {
      setOffset({ x: event.translationX, y: event.translationY });
    })
    .onEnd(event => {
      resolveDrop(event.absoluteX, event.absoluteY);
      setOffset({ x: 0, y: 0 });
    });

  const pinch = Gesture.Pinch()
    .runOnJS(true)
    .onUpdate(event => {
      setScale(event.scale);
    });

  return (
    <ScrollView
      testID="gestures.scrollView"
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={styles.content}>
      <AppText>{t('gestures.swipeHint')}</AppText>
      <ReanimatedSwipeable onSwipeableOpen={() => setSwiped(true)}>
        <View testID="gestures.swipeCard" style={[styles.card, { backgroundColor: colors.card }]}>
          <AppText>{t('gestures.swipeHint')}</AppText>
        </View>
      </ReanimatedSwipeable>
      <AppText testID="gestures.swipeResult">
        {swiped ? t('gestures.swiped') : t('gestures.idle')}
      </AppText>

      <AppText>{t('gestures.longHint')}</AppText>
      <Pressable
        testID="gestures.longPressTarget"
        accessibilityRole="button"
        accessibilityLabel={t('gestures.longHint')}
        delayLongPress={800}
        onLongPress={() => setLongPressed(true)}
        style={[styles.target, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <AppText>{t('gestures.longHint')}</AppText>
      </Pressable>
      <AppText testID="gestures.longPressResult">
        {longPressed ? t('gestures.longPressed') : t('gestures.idle')}
      </AppText>

      <AppText>{t('gestures.doubleHint')}</AppText>
      <Pressable
        testID="gestures.doubleTapTarget"
        accessibilityRole="button"
        accessibilityLabel={t('gestures.doubleHint')}
        onPress={() => {
          const now = Date.now();
          if (now - lastTap.current <= 300) {
            setDoubleTapped(true);
            lastTap.current = 0;
            return;
          }
          lastTap.current = now;
        }}
        style={[styles.target, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <AppText>{t('gestures.doubleHint')}</AppText>
      </Pressable>
      <AppText testID="gestures.doubleTapResult">
        {doubleTapped ? t('gestures.doubleTapped') : t('gestures.idle')}
      </AppText>

      <AppText>{t('gestures.dragHint')}</AppText>
      <View style={styles.zones}>
        <View
          ref={node => {
            zoneA.current = node as unknown as Measurable | null;
          }}
          testID="gestures.dropZoneA"
          onLayout={() => remember('a', zoneA.current)}
          style={[styles.zone, { borderColor: colors.primary }]}>
          <AppText>{t('gestures.zoneA')}</AppText>
        </View>
        <View
          ref={node => {
            zoneB.current = node as unknown as Measurable | null;
          }}
          testID="gestures.dropZoneB"
          onLayout={() => remember('b', zoneB.current)}
          style={[styles.zone, { borderColor: colors.primary }]}>
          <AppText>{t('gestures.zoneB')}</AppText>
        </View>
      </View>
      <GestureDetector gesture={pan}>
        <View
          testID="gestures.dragSource"
          style={[
            styles.drag,
            {
              backgroundColor: colors.primary,
              transform: [{ translateX: offset.x }, { translateY: offset.y }],
            },
          ]}>
          <AppText style={styles.dragText}>{t('gestures.dragSource')}</AppText>
        </View>
      </GestureDetector>
      <AppText testID="gestures.dropResult">{drop}</AppText>

      <AppText>{t('gestures.pinchHint')}</AppText>
      <GestureDetector gesture={pinch}>
        <Image
          testID="gestures.zoomImage"
          accessibilityLabel={t('gestures.pinchHint')}
          source={require('../assets/training-image.png')}
          style={[styles.image, { transform: [{ scale }] }]}
        />
      </GestureDetector>
      <AppText testID="gestures.zoomScale">{scale.toFixed(1)}</AppText>

      <AppText>{t('gestures.scrollHint')}</AppText>
      <View style={styles.spacer} />
      <AppText testID="gestures.hiddenTarget">{t('gestures.hidden')}</AppText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  card: { padding: 24, borderRadius: 12 },
  target: { padding: 24, borderWidth: 1, borderRadius: 12 },
  zones: { flexDirection: 'row', gap: 12 },
  zone: { flex: 1, minHeight: 80, borderWidth: 2, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  drag: { alignSelf: 'flex-start', padding: 16, borderRadius: 12 },
  dragText: { color: '#ffffff' },
  image: { width: 120, height: 120, borderRadius: 12 },
  spacer: { height: 2000 },
});
