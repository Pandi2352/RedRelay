import type { RouteObject } from 'react-router';
import { ROUTES } from '@/shared/constants';

export const homeRoutes: RouteObject[] = [
  {
    path: ROUTES.home,
    lazy: async () => ({ Component: (await import('./pages/HomePage')).HomePage }),
  },
];
