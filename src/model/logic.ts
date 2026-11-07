import { CATALOG, PAGE_SIZE, findItem } from './catalog';
import type {
  Account,
  AppRoute,
  Item,
  ItemPage,
  LoginDecision,
  PersistedState,
  SignupDecision,
} from './types';

export const SUCCESS_EMAIL = 'student@example.com';
export const SUCCESS_PASSWORD = 'Password123!';
export const LOCKED_EMAIL = 'locked@example.com';

export function defaultState(): PersistedState {
  return {
    sessionEmail: null,
    accounts: [],
    deletedIds: [],
    lang: 'en',
    theme: 'light',
    latencyMs: 0,
    flakySeed: 1,
    knownBug: false,
    disableAnimations: false,
  };
}

export function sanitizeState(value: unknown): PersistedState {
  const base = defaultState();
  if (!value || typeof value !== 'object') {
    return base;
  }
  const record = value as Partial<PersistedState>;
  return {
    sessionEmail:
      typeof record.sessionEmail === 'string' ? record.sessionEmail : null,
    accounts: sanitizeAccounts(record.accounts),
    deletedIds: Array.isArray(record.deletedIds)
      ? record.deletedIds.filter(
          (id): id is number => typeof id === 'number' && Number.isInteger(id),
        )
      : [],
    lang: record.lang === 'fr' ? 'fr' : 'en',
    theme: record.theme === 'dark' ? 'dark' : 'light',
    latencyMs:
      typeof record.latencyMs === 'number' &&
      Number.isInteger(record.latencyMs) &&
      record.latencyMs >= 0
        ? record.latencyMs
        : 0,
    flakySeed:
      typeof record.flakySeed === 'number' && Number.isInteger(record.flakySeed)
        ? record.flakySeed
        : 1,
    knownBug: record.knownBug === true,
    disableAnimations: record.disableAnimations === true,
  };
}

export function delay(ms: number): Promise<void> {
  if (ms <= 0) {
    return Promise.resolve();
  }
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export function createRequestGate() {
  let latest = 0;
  return {
    start() {
      latest += 1;
      return latest;
    },
    isCurrent(id: number) {
      return id === latest;
    },
  };
}

export function appendUnique(current: Item[], incoming: Item[]): Item[] {
  const seen = new Set(current.map(item => item.id));
  return current.concat(incoming.filter(item => !seen.has(item.id)));
}

export function flakyDelayMs(seed: number): number {
  return 1000 + (Math.abs(seed) % 5) * 1000;
}

export function flakyToastCovers(seed: number): boolean {
  return Math.abs(seed) % 2 === 0;
}

export function validateCredentials(
  email: string,
  password: string,
  accounts: Account[] = [],
): LoginDecision {
  const emailMissing = email.trim().length === 0;
  const passwordMissing = password.length === 0;
  if (emailMissing || passwordMissing) {
    return {
      status: 'invalid-fields',
      email: emailMissing,
      password: passwordMissing,
    };
  }
  const normalized = email.trim();
  if (normalized === SUCCESS_EMAIL && password === SUCCESS_PASSWORD) {
    return { status: 'success' };
  }
  if (normalized === LOCKED_EMAIL) {
    return { status: 'locked' };
  }
  const account = accounts.find(item => item.email === normalized);
  if (account && account.password === password) {
    return { status: 'success' };
  }
  return { status: 'invalid' };
}

export function validateSignup(
  email: string,
  password: string,
  confirm: string,
  accounts: Account[],
): SignupDecision {
  const trimmed = email.trim();
  const emailMissing = trimmed.length === 0;
  const emailFormat = !emailMissing && !trimmed.includes('@');
  const passwordMissing = password.length === 0;
  const confirmMissing = confirm.length === 0;
  const confirmMismatch = !passwordMissing && !confirmMissing && confirm !== password;
  if (emailMissing || emailFormat || passwordMissing || confirmMissing || confirmMismatch) {
    return {
      status: 'invalid-fields',
      email: emailMissing,
      emailFormat,
      password: passwordMissing,
      confirm: confirmMissing || confirmMismatch,
    };
  }
  if (trimmed === SUCCESS_EMAIL || trimmed === LOCKED_EMAIL) {
    return { status: 'reserved' };
  }
  if (accounts.some(item => item.email === trimmed)) {
    return { status: 'duplicate' };
  }
  return { status: 'success' };
}

function sanitizeAccounts(value: unknown): Account[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap(item => {
    if (!item || typeof item !== 'object') {
      return [];
    }
    const record = item as Partial<Account>;
    if (typeof record.email !== 'string' || typeof record.password !== 'string') {
      return [];
    }
    const email = record.email.trim();
    if (!email || record.password.length === 0) {
      return [];
    }
    return [{ email, password: record.password }];
  });
}

export function queryItems(input: {
  page: number;
  query: string;
  deletedIds: number[];
  knownBug: boolean;
}): ItemPage {
  const deleted = new Set(input.deletedIds);
  const remaining = CATALOG.filter(item => !deleted.has(item.id));
  const query = input.query.trim();
  const matched = !query
    ? remaining
    : input.knownBug
      ? remaining.filter(item => String(item.id) === query)
      : remaining.filter(item =>
          item.title.toLowerCase().includes(query.toLowerCase()),
        );
  const page = input.page < 1 ? 1 : input.page;
  const start = (page - 1) * PAGE_SIZE;
  return {
    items: matched.slice(start, start + PAGE_SIZE),
    hasMore: start + PAGE_SIZE < matched.length,
  };
}

export function itemForDetail(id: number): Item | undefined {
  return findItem(id);
}

export function applyTrainingUrl(
  state: PersistedState,
  url: string,
): { state: PersistedState; route: AppRoute; pending: AppRoute | null } {
  const parsed = parseTrainingUrl(url);
  if (!parsed) {
    return {
      state,
      route: state.sessionEmail ? { name: 'Main' } : { name: 'Login' },
      pending: null,
    };
  }

  let next = state;
  if (parsed.query.get('resetState') === '1') {
    next = defaultState();
  }
  const latency = parsed.query.get('latencyMs');
  if (latency !== null && /^\d+$/.test(latency)) {
    next = { ...next, latencyMs: Number(latency) };
  }
  if (parsed.query.get('disableAnimations') === '1') {
    next = { ...next, disableAnimations: true };
  }
  const seed = parsed.query.get('flakySeed');
  if (seed !== null && /^-?\d+$/.test(seed)) {
    next = { ...next, flakySeed: Number(seed) };
  }
  const knownBug = parsed.query.get('knownBug');
  if (knownBug === '0' || knownBug === '1') {
    next = { ...next, knownBug: knownBug === '1' };
  }
  const lang = parsed.query.get('lang');
  if (lang === 'en' || lang === 'fr') {
    next = { ...next, lang };
  }

  if (parsed.host === '') {
    return {
      state: next,
      route: next.sessionEmail ? { name: 'Main' } : { name: 'Login' },
      pending: null,
    };
  }

  const route = routeFromHost(parsed.host, parsed.itemId);
  if (route.name === 'Login') {
    return { state: next, route, pending: null };
  }
  if (!next.sessionEmail) {
    return { state: next, route: { name: 'Login' }, pending: route };
  }
  return { state: next, route, pending: null };
}

function routeFromHost(host: string, itemId: string | null): AppRoute {
  if (host === 'login') {
    return { name: 'Login' };
  }
  if (host === 'settings') {
    return { name: 'Settings' };
  }
  if (host === 'flaky') {
    return { name: 'Flaky' };
  }
  if (host === 'bad-locators') {
    return { name: 'BadLocators' };
  }
  if (host === 'item') {
    const id = Number(itemId);
    return { name: 'ItemDetail', id: Number.isInteger(id) ? id : Number.NaN };
  }
  return { name: 'Main' };
}

function parseTrainingUrl(url: string): {
  host: string;
  itemId: string | null;
  query: URLSearchParams;
} | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'qatraining:') {
      return null;
    }
    const host = parsed.hostname;
    const itemId =
      host === 'item'
        ? decodeURIComponent(parsed.pathname.replace(/^\//, ''))
        : null;
    return { host, itemId, query: parsed.searchParams };
  } catch {
    return null;
  }
}
