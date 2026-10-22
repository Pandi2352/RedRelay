import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { STORAGE_KEYS } from '../constants';
import { storage } from '../lib';
import { selectTheme } from '../store';
import { useMediaQuery } from './useMediaQuery';

/** Applies the theme preference to <html class="dark"> and remembers it. Mount once. */
export function useThemeSync(): void {
  const theme = useSelector(selectTheme);
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.theme, theme);
  }, [theme]);
}
