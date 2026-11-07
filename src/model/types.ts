export type Language = 'en' | 'fr';
export type ThemeName = 'light' | 'dark';

export type Item = {
  id: number;
  title: string;
  subtitle: string;
};

export type Account = {
  email: string;
  password: string;
};

export type PersistedState = {
  sessionEmail: string | null;
  accounts: Account[];
  deletedIds: number[];
  lang: Language;
  theme: ThemeName;
  latencyMs: number;
  flakySeed: number;
  knownBug: boolean;
  disableAnimations: boolean;
};

export type AppRoute =
  | { name: 'Login' }
  | { name: 'Main' }
  | { name: 'Settings' }
  | { name: 'Flaky' }
  | { name: 'BadLocators' }
  | { name: 'ItemDetail'; id: number };

export type LoginDecision =
  | { status: 'invalid-fields'; email: boolean; password: boolean }
  | { status: 'success' | 'locked' | 'invalid' };

export type SignupDecision =
  | {
      status: 'invalid-fields';
      email: boolean;
      emailFormat: boolean;
      password: boolean;
      confirm: boolean;
    }
  | { status: 'reserved' | 'duplicate' | 'success' };

export type ItemPage = {
  items: Item[];
  hasMore: boolean;
};
