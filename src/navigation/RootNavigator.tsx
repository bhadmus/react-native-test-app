import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AppRoute } from '../model/types';
import { BadLocatorsScreen } from '../screens/BadLocatorsScreen';
import { FlakyScreen } from '../screens/FlakyScreen';
import { FormsScreen } from '../screens/FormsScreen';
import { GesturesScreen } from '../screens/GesturesScreen';
import { ItemDetailScreen } from '../screens/ItemDetailScreen';
import { ItemsScreen } from '../screens/ItemsScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { PermissionsScreen } from '../screens/PermissionsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { WebViewScreen } from '../screens/WebViewScreen';
import { useApp } from '../state/AppContext';
import { palette } from '../theme/palette';
import type { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

function followRoute(route: AppRoute) {
  if (!navigationRef.isReady()) {
    return;
  }
  if (route.name === 'Login') {
    navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
    return;
  }
  if (route.name === 'Main') {
    navigationRef.reset({ index: 0, routes: [{ name: 'Main' }] });
    return;
  }
  if (route.name === 'Settings') {
    navigationRef.reset({
      index: 0,
      routes: [
        {
          name: 'Main',
          state: { index: 5, routes: [{ name: 'Settings' }] },
        },
      ],
    });
    return;
  }
  navigationRef.reset({
    index: 1,
    routes: [
      { name: 'Main' },
      route.name === 'ItemDetail'
        ? { name: 'ItemDetail', params: { id: route.id } }
        : { name: route.name },
    ],
  });
}

function Tabs() {
  const { t, state } = useApp();
  const colors = palette[state.theme];
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.card },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        animation: state.disableAnimations ? 'none' : 'shift',
      }}>
      <Tab.Screen name="Items" component={ItemsScreen} options={{ title: t('tabs.items') }} />
      <Tab.Screen name="Forms" component={FormsScreen} options={{ title: t('tabs.forms') }} />
      <Tab.Screen name="Gestures" component={GesturesScreen} options={{ title: t('tabs.gestures') }} />
      <Tab.Screen name="WebView" component={WebViewScreen} options={{ title: t('tabs.webview') }} />
      <Tab.Screen name="Permissions" component={PermissionsScreen} options={{ title: t('tabs.permissions') }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: t('tabs.settings') }} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { state, routeRequest } = useApp();
  const colors = palette[state.theme];
  const signedIn = state.sessionEmail !== null;

  useEffect(() => {
    if (routeRequest) {
      followRoute(routeRequest.route);
    }
  }, [routeRequest]);

  return (
    <View style={[styles.fill, { backgroundColor: colors.bg }]}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          if (routeRequest) {
            followRoute(routeRequest.route);
          }
        }}>
        <Stack.Navigator
          key={signedIn ? 'in' : 'out'}
          screenOptions={{
            animation: state.disableAnimations ? 'none' : 'default',
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
            contentStyle: { backgroundColor: colors.bg },
          }}>
          {signedIn ? (
            <>
              <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
              <Stack.Screen name="ItemDetail" component={ItemDetailScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Flaky" component={FlakyScreen} options={{ title: 'Flaky' }} />
              <Stack.Screen name="BadLocators" component={BadLocatorsScreen} options={{ title: 'Bad Locators' }} />
            </>
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
