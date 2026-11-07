import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { PERMISSIONS, request, requestNotifications, type PermissionStatus } from 'react-native-permissions';
import { AppText } from '../components/AppText';
import { useApp } from '../state/AppContext';
import { palette } from '../theme/palette';

type Kind = 'camera' | 'location' | 'notifications';
type ShownStatus = 'unknown' | 'granted' | 'denied' | 'blocked' | 'unavailable';

function permissionFor(kind: Exclude<Kind, 'notifications'>) {
  if (Platform.OS === 'ios') {
    return kind === 'camera' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
  }
  return kind === 'camera' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
}

function toShown(status: PermissionStatus): ShownStatus {
  if (status === 'limited' || status === 'granted') {
    return 'granted';
  }
  if (status === 'denied' || status === 'blocked' || status === 'unavailable') {
    return status;
  }
  return 'unavailable';
}

export function PermissionsScreen() {
  const { state, t } = useApp();
  const colors = palette[state.theme];
  const [camera, setCamera] = useState<ShownStatus>('unknown');
  const [location, setLocation] = useState<ShownStatus>('unknown');
  const [notifications, setNotifications] = useState<ShownStatus>('unknown');

  const ask = async (kind: Kind) => {
    const setStatus =
      kind === 'camera' ? setCamera : kind === 'location' ? setLocation : setNotifications;
    try {
      if (kind === 'notifications') {
        const response = await requestNotifications(['alert', 'badge', 'sound']);
        setStatus(toShown(response.status));
        return;
      }
      const result = await request(permissionFor(kind));
      setStatus(toShown(result));
    } catch {
      setStatus('unavailable');
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <PermissionRow
        buttonId="permissions.cameraButton"
        statusId="permissions.cameraStatus"
        label={t('permissions.camera')}
        status={camera}
        onPress={() => {
          void ask('camera');
        }}
      />
      <PermissionRow
        buttonId="permissions.locationButton"
        statusId="permissions.locationStatus"
        label={t('permissions.location')}
        status={location}
        onPress={() => {
          void ask('location');
        }}
      />
      <PermissionRow
        buttonId="permissions.notificationsButton"
        statusId="permissions.notificationsStatus"
        label={t('permissions.notifications')}
        status={notifications}
        onPress={() => {
          void ask('notifications');
        }}
      />
    </View>
  );
}

function PermissionRow({
  buttonId,
  statusId,
  label,
  status,
  onPress,
}: {
  buttonId: string;
  statusId: string;
  label: string;
  status: ShownStatus;
  onPress: () => void;
}) {
  return (
    <View style={styles.row}>
      <Pressable testID={buttonId} accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
        <AppText>{label}</AppText>
      </Pressable>
      <AppText testID={statusId}>{status}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 20 },
  row: { gap: 8 },
});
