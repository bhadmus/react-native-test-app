import AsyncStorage from '@react-native-async-storage/async-storage';

export type KeyValueStore = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
};

export const STORAGE_KEY = '@qa-training/state';

export const asyncStorageStore: KeyValueStore = {
  getItem(key) {
    return AsyncStorage.getItem(key);
  },
  setItem(key, value) {
    return AsyncStorage.setItem(key, value);
  },
};

export function memoryStore(initial: string | null = null): KeyValueStore {
  let value = initial;
  return {
    async getItem() {
      return value;
    },
    async setItem(_key, next) {
      value = next;
    },
  };
}
