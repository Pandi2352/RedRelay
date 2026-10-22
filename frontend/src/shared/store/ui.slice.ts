import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../constants';
import { storage } from '../lib';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface UiState {
  theme: ThemePreference;
}

/** Shape any store must have to use the shared UI selectors. */
export interface UiRootState {
  ui: UiState;
}

const THEMES: ThemePreference[] = ['light', 'dark', 'system'];

function readStoredTheme(): ThemePreference {
  const stored = storage.get(STORAGE_KEYS.theme);
  return THEMES.find((theme) => theme === stored) ?? 'system';
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: (): UiState => ({ theme: readStoredTheme() }),
  reducers: {
    setTheme(state, action: PayloadAction<ThemePreference>) {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
export const selectTheme = (state: UiRootState): ThemePreference => state.ui.theme;
