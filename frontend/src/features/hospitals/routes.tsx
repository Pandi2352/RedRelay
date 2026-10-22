import type { RouteObject } from 'react-router';
import { ROUTES } from '@/shared/constants';

export const hospitalRoutes: RouteObject[] = [
  {
    path: ROUTES.hospitals,
    lazy: async () => ({ Component: (await import('./pages/HospitalsListPage')).HospitalsListPage }),
  },
  {
    path: ROUTES.hospitalNew,
    lazy: async () => ({ Component: (await import('./pages/CreateHospitalPage')).CreateHospitalPage }),
  },
  {
    path: '/hospitals/:id',
    lazy: async () => ({ Component: (await import('./pages/HospitalDetailPage')).HospitalDetailPage }),
  },
];
