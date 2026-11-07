import type { ThemeName } from '../model/types';

export const palette: Record<
  ThemeName,
  {
    bg: string;
    card: string;
    text: string;
    muted: string;
    primary: string;
    danger: string;
    border: string;
    input: string;
  }
> = {
  light: {
    bg: '#f4f6f8',
    card: '#ffffff',
    text: '#1b1f24',
    muted: '#5c6770',
    primary: '#0b6e4f',
    danger: '#a33b32',
    border: '#d5dbe1',
    input: '#ffffff',
  },
  dark: {
    bg: '#121417',
    card: '#1e2329',
    text: '#f2f4f6',
    muted: '#b7c0c7',
    primary: '#3ddc97',
    danger: '#ff8a80',
    border: '#343b44',
    input: '#1e2329',
  },
};
