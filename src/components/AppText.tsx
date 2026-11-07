import { StyleSheet, Text, type TextProps } from 'react-native';
import { useApp } from '../state/AppContext';
import { palette } from '../theme/palette';

export function AppText({ style, ...rest }: TextProps) {
  const { state } = useApp();
  return (
    <Text
      allowFontScaling={false}
      maxFontSizeMultiplier={1}
      style={[styles.text, { color: palette[state.theme].text }, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});
