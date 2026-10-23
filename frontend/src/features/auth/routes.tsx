import type { RouteObject } from 'react-router';
import { ROUTES } from '@/shared/constants';
import { RequireGuest } from '@/shared/guards';

export const authRoutes: RouteObject[] = [
  {
    element: <RequireGuest />,
    children: [
      {
        path: ROUTES.login,
        lazy: async () => ({
          Component: (await import('./pages/LoginPage')).LoginPage,
        }),
      },
      {
        path: ROUTES.register,
        lazy: async () => ({
          Component: (await import('./pages/RegisterPage')).RegisterPage,
        }),
      },
    ],
  },
];
