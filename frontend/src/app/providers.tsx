import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { AuthBootstrap } from '@/features/auth';
import { useThemeSync } from '@/shared/hooks';
import { store } from './store';

function ThemeSync() {
  useThemeSync();
  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeSync />
      <AuthBootstrap />
      {children}
    </Provider>
  );
}
