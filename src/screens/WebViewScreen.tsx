import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { WEBVIEW_HTML } from '../content/webviewHtml';
import { useApp } from '../state/AppContext';
import { palette } from '../theme/palette';

export function WebViewScreen() {
  const { state } = useApp();
  return (
    <View style={[styles.screen, { backgroundColor: palette[state.theme].bg }]}>
      <WebView
        testID="webview.container"
        originWhitelist={['*']}
        source={{ html: WEBVIEW_HTML }}
        javaScriptEnabled
        setSupportMultipleWindows={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
