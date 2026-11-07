import type { Item } from './types';

export const PAGE_SIZE = 20;
export const CATALOG_LENGTH = 200;

export const CATALOG: Item[] = Array.from({ length: CATALOG_LENGTH }, (_, index) => {
  const id = index + 1;
  return {
    id,
    title: `Item ${String(id).padStart(3, '0')}`,
    subtitle: `Category ${((id - 1) % 5) + 1}`,
  };
});

export function findItem(id: number): Item | undefined {
  if (!Number.isInteger(id) || id < 1 || id > CATALOG_LENGTH) {
    return undefined;
  }
  return CATALOG[id - 1];
}
