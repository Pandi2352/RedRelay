import type { ReactNode } from 'react';
import { Outlet } from 'react-router';
import { ThemeToggle } from './ThemeToggle';

export interface AppShellProps {
  brand: ReactNode;
  nav?: ReactNode;
  actions?: ReactNode;
}

/** Top bar + page area. Owns the page gutter so pages and components add none. */
export function AppShell({ brand, nav, actions }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 md:px-6">
          {brand}
          {nav && <nav className="flex flex-1 items-center gap-1">{nav}</nav>}
          <div className="ml-auto flex items-center gap-3">
            {actions}
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-4 md:px-6">
        <Outlet />
      </main>
    </div>
  );
}
