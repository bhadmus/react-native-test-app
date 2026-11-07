import { StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { useApp } from '../state/AppContext';
import { palette } from '../theme/palette';

export function AppTextInput({ style, ...rest }: TextInputProps) {
  const { state } = useApp();
  const colors = palette[state.theme];
  return (
    <TextInput
      allowFontScaling={false}
      maxFontSizeMultiplier={1}
      placeholderTextColor={colors.muted}
      style={[
        styles.input,
        {
          color: colors.text,
          backgroundColor: colors.input,
          borderColor: colors.border,
        },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
});
