import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { translate, type StringKey } from '../i18n/strings';
import {
  applyTrainingUrl,
  defaultState,
  delay,
  sanitizeState,
  validateCredentials,
  validateSignup,
} from '../model/logic';
import type { AppRoute, LoginDecision, PersistedState, SignupDecision } from '../model/types';
import {
  STORAGE_KEY,
  asyncStorageStore,
  type KeyValueStore,
} from '../storage/store';

type RouteRequest = { id: number; route: AppRoute };

type AppContextValue = {
  state: PersistedState;
  routeRequest: RouteRequest | null;
  t: (key: StringKey) => string;
  login: (email: string, password: string) => Promise<LoginDecision>;
  signup: (email: string, password: string, confirm: string) => Promise<SignupDecision>;
  logout: () => Promise<void>;
  reset: () => Promise<void>;
  setLanguage: (lang: PersistedState['lang']) => Promise<void>;
  setTheme: (theme: PersistedState['theme']) => Promise<void>;
  setKnownBug: (knownBug: boolean) => Promise<void>;
  setLatency: (latencyMs: number) => Promise<void>;
  setFlakySeed: (flakySeed: number) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

type ProviderProps = {
  children: ReactNode;
  store?: KeyValueStore;
  initialState?: PersistedState;
};

export function AppProvider({
  children,
  store = asyncStorageStore,
  initialState,
}: ProviderProps) {
  const [state, setState] = useState<PersistedState | null>(initialState ?? null);
  const [routeRequest, setRouteRequest] = useState<RouteRequest | null>(null);
  const stateRef = useRef<PersistedState | null>(initialState ?? null);
  const pendingRef = useRef<AppRoute | null>(null);
  const requestSeq = useRef(0);
  const skipUrl = useRef<string | null>(null);

  const persist = useCallback(
    async (next: PersistedState) => {
      stateRef.current = next;
      setState(next);
      await store.setItem(STORAGE_KEY, JSON.stringify(next));
    },
    [store],
  );

  const publishRoute = useCallback((route: AppRoute) => {
    requestSeq.current += 1;
    setRouteRequest({ id: requestSeq.current, route });
  }, []);

  const applyUrl = useCallback(
    async (url: string) => {
      const current = stateRef.current ?? defaultState();
      const applied = applyTrainingUrl(current, url);
      pendingRef.current = applied.pending;
      await persist(applied.state);
      publishRoute(applied.route);
    },
    [persist, publishRoute],
  );

  useEffect(() => {
    if (initialState) {
      return;
    }
    let cancelled = false;
    (async () => {
      const raw = await store.getItem(STORAGE_KEY);
      let next = defaultState();
      if (raw) {
        try {
          next = sanitizeState(JSON.parse(raw));
        } catch {
          next = defaultState();
        }
      }
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        const applied = applyTrainingUrl(next, initialUrl);
        next = applied.state;
        pendingRef.current = applied.pending;
        await store.setItem(STORAGE_KEY, JSON.stringify(next));
        skipUrl.current = initialUrl;
        if (!cancelled) {
          stateRef.current = next;
          setState(next);
          publishRoute(applied.route);
        }
        return;
      }
      if (!cancelled) {
        stateRef.current = next;
        setState(next);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialState, publishRoute, store]);

  useEffect(() => {
    if (!state) {
      return;
    }
    const subscription = Linking.addEventListener('url', event => {
      if (skipUrl.current === event.url) {
        skipUrl.current = null;
        return;
      }
      void applyUrl(event.url);
    });
    return () => subscription.remove();
  }, [applyUrl, state]);

  const update = useCallback(
    (patch: Partial<PersistedState>) => {
      const current = stateRef.current ?? defaultState();
      return persist({ ...current, ...patch });
    },
    [persist],
  );

  const value = useMemo<AppContextValue | null>(() => {
    if (!state) {
      return null;
    }
    return {
      state,
      routeRequest,
      t: key => translate(state.lang, key),
      async login(email, password) {
        const current = stateRef.current ?? defaultState();
        const decision = validateCredentials(email, password, current.accounts);
        if (decision.status === 'invalid-fields') {
          return decision;
        }
        await delay(current.latencyMs);
        if (decision.status === 'success') {
          const pending = pendingRef.current;
          pendingRef.current = null;
          await persist({
            ...(stateRef.current ?? defaultState()),
            sessionEmail: email.trim(),
          });
          publishRoute(pending ?? { name: 'Main' });
        }
        return decision;
      },
      async signup(email, password, confirm) {
        const current = stateRef.current ?? defaultState();
        const decision = validateSignup(email, password, confirm, current.accounts);
        if (decision.status !== 'success') {
          return decision;
        }
        await delay(current.latencyMs);
        const latest = stateRef.current ?? defaultState();
        const account = { email: email.trim(), password };
        if (latest.accounts.some(item => item.email === account.email)) {
          return { status: 'duplicate' };
        }
        const pending = pendingRef.current;
        pendingRef.current = null;
        await persist({
          ...latest,
          accounts: [...latest.accounts, account],
          sessionEmail: account.email,
        });
        publishRoute(pending ?? { name: 'Main' });
        return decision;
      },
      async logout() {
        pendingRef.current = null;
        await update({ sessionEmail: null });
        publishRoute({ name: 'Login' });
      },
      async reset() {
        pendingRef.current = null;
        await persist(defaultState());
        publishRoute({ name: 'Login' });
      },
      setLanguage: lang => update({ lang }),
      setTheme: theme => update({ theme }),
      setKnownBug: knownBug => update({ knownBug }),
      setLatency: latencyMs => update({ latencyMs }),
      setFlakySeed: flakySeed => update({ flakySeed }),
      async deleteItem(id) {
        const current = stateRef.current ?? defaultState();
        if (current.deletedIds.includes(id)) {
          return;
        }
        await persist({ ...current, deletedIds: [...current.deletedIds, id] });
      },
    };
  }, [persist, publishRoute, routeRequest, state, update]);

  if (!value) {
    return <View testID="app.loading" style={styles.loading} />;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return value;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
});
