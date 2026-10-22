import type { RouteObject } from 'react-router';
import { ROUTES } from '@/shared/constants';

export const statusRoutes: RouteObject[] = [
  {
    path: ROUTES.status,
    lazy: async () => ({ Component: (await import('./pages/StatusPage')).StatusPage }),
  },
];
