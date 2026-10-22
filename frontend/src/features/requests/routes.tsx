import type { RouteObject } from 'react-router';
import { ROUTES } from '@/shared/constants';

export const requestRoutes: RouteObject[] = [
  {
    path: ROUTES.requests,
    lazy: async () => ({ Component: (await import('./pages/RequestsListPage')).RequestsListPage }),
  },
  {
    path: ROUTES.requestNew,
    lazy: async () => ({ Component: (await import('./pages/CreateRequestPage')).CreateRequestPage }),
  },
  {
    path: '/requests/:id',
    lazy: async () => ({ Component: (await import('./pages/RequestDetailPage')).RequestDetailPage }),
  },
];
