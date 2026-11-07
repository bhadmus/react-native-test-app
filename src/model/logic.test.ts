import {
  LOCKED_EMAIL,
  SUCCESS_EMAIL,
  SUCCESS_PASSWORD,
  appendUnique,
  applyTrainingUrl,
  createRequestGate,
  defaultState,
  delay,
  flakyDelayMs,
  flakyToastCovers,
  queryItems,
  validateCredentials,
  validateSignup,
} from './logic';
import { CATALOG } from './catalog';

describe('fake API', () => {
  test('pages 20 items at a time from a 200 item catalog', () => {
    const first = queryItems({ page: 1, query: '', deletedIds: [], knownBug: false });
    const second = queryItems({ page: 2, query: '', deletedIds: [], knownBug: false });
    expect(first.items).toHaveLength(20);
    expect(first.items[0].title).toBe('Item 001');
    expect(first.items[0].subtitle).toBe('Category 1');
    expect(first.hasMore).toBe(true);
    expect(second.items[0].id).toBe(21);
    const last = queryItems({ page: 10, query: '', deletedIds: [], knownBug: false });
    expect(last.items[last.items.length - 1].id).toBe(200);
    expect(last.hasMore).toBe(false);
  });

  test('search matches titles without debounce or case sensitivity', () => {
    const found = queryItems({
      page: 1,
      query: 'item 021',
      deletedIds: [],
      knownBug: false,
    });
    expect(found.items.map(item => item.id)).toEqual([21]);
    expect(
      queryItems({ page: 1, query: 'Category', deletedIds: [], knownBug: false }).items,
    ).toHaveLength(0);
  });

  test('known bug matches the decimal id only', () => {
    expect(
      queryItems({ page: 1, query: '1', deletedIds: [], knownBug: true }).items.map(
        item => item.id,
      ),
    ).toEqual([1]);
    expect(
      queryItems({ page: 1, query: 'Item', deletedIds: [], knownBug: true }).items,
    ).toHaveLength(0);
  });

  test('deleted ids stay out of every page', () => {
    const page = queryItems({ page: 1, query: '', deletedIds: [1], knownBug: false });
    expect(page.items.some(item => item.id === 1)).toBe(false);
    expect(page.items[0].id).toBe(2);
  });

  test('appends a page without duplicating ids', () => {
    const combined = appendUnique(CATALOG.slice(0, 20), CATALOG.slice(10, 30));
    expect(combined).toHaveLength(30);
    expect(new Set(combined.map(item => item.id)).size).toBe(30);
  });

  test('ignores an older response', () => {
    const gate = createRequestGate();
    const first = gate.start();
    const second = gate.start();
    expect(gate.isCurrent(first)).toBe(false);
    expect(gate.isCurrent(second)).toBe(true);
  });

  test('waits for the configured latency', async () => {
    jest.useFakeTimers();
    let done = false;
    const pending = delay(400).then(() => {
      done = true;
    });
    await jest.advanceTimersByTimeAsync(399);
    expect(done).toBe(false);
    await jest.advanceTimersByTimeAsync(1);
    await pending;
    expect(done).toBe(true);
    jest.useRealTimers();
  });

  test('flaky delay and toast follow the seed', () => {
    expect(flakyDelayMs(1)).toBe(2000);
    expect(flakyToastCovers(1)).toBe(false);
    expect(flakyDelayMs(2)).toBe(3000);
    expect(flakyToastCovers(2)).toBe(true);
  });
});

describe('login decisions', () => {
  test('requires both fields', () => {
    expect(validateCredentials('', '')).toEqual({
      status: 'invalid-fields',
      email: true,
      password: true,
    });
    expect(validateCredentials('a@b.c', '')).toEqual({
      status: 'invalid-fields',
      email: false,
      password: true,
    });
  });

  test('accepts the student and rejects everyone else', () => {
    expect(validateCredentials(SUCCESS_EMAIL, SUCCESS_PASSWORD).status).toBe('success');
    expect(validateCredentials(LOCKED_EMAIL, 'anything').status).toBe('locked');
    expect(validateCredentials('other@example.com', SUCCESS_PASSWORD).status).toBe(
      'invalid',
    );
    expect(
      validateCredentials('ada@example.com', 'secret', [
        { email: 'ada@example.com', password: 'secret' },
      ]).status,
    ).toBe('success');
  });

  test('rejects a reserved or duplicate signup and accepts a new email', () => {
    const accounts = [{ email: 'ada@example.com', password: 'secret' }];
    expect(validateSignup('', '', '', accounts)).toEqual({
      status: 'invalid-fields',
      email: true,
      emailFormat: false,
      password: true,
      confirm: true,
    });
    expect(validateSignup('ada', 'secret', 'secret', accounts).status).toBe('invalid-fields');
    expect(validateSignup(SUCCESS_EMAIL, 'secret', 'secret', accounts).status).toBe('reserved');
    expect(validateSignup(LOCKED_EMAIL, 'secret', 'secret', accounts).status).toBe('reserved');
    expect(validateSignup('ada@example.com', 'secret', 'secret', accounts).status).toBe(
      'duplicate',
    );
    expect(validateSignup('new@example.com', 'secret', 'other', accounts).status).toBe(
      'invalid-fields',
    );
    expect(validateSignup('new@example.com', 'secret', 'secret', accounts).status).toBe(
      'success',
    );
  });
});

describe('deep links', () => {
  test('applies reset before the other parameters', () => {
    const applied = applyTrainingUrl(
      { ...defaultState(), sessionEmail: SUCCESS_EMAIL, lang: 'fr', knownBug: true },
      'qatraining://login?resetState=1&lang=fr&knownBug=1&latencyMs=25&disableAnimations=1&flakySeed=4',
    );
    expect(applied.state.sessionEmail).toBeNull();
    expect(applied.state.lang).toBe('fr');
    expect(applied.state.knownBug).toBe(true);
    expect(applied.state.latencyMs).toBe(25);
    expect(applied.state.disableAnimations).toBe(true);
    expect(applied.state.flakySeed).toBe(4);
    expect(applied.route).toEqual({ name: 'Login' });
    expect(applied.pending).toBeNull();
  });

  test('holds a protected route until login', () => {
    const applied = applyTrainingUrl(defaultState(), 'qatraining://item/21');
    expect(applied.route).toEqual({ name: 'Login' });
    expect(applied.pending).toEqual({ name: 'ItemDetail', id: 21 });
  });

  test('opens a protected route when a session exists', () => {
    const applied = applyTrainingUrl(
      { ...defaultState(), sessionEmail: SUCCESS_EMAIL },
      'qatraining://bad-locators?latencyMs=-5',
    );
    expect(applied.state.latencyMs).toBe(0);
    expect(applied.route).toEqual({ name: 'BadLocators' });
  });
});
