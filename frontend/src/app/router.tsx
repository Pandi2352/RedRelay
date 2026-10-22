import { createBrowserRouter } from 'react-router';
import { homeRoutes } from '@/features/home';
import { hospitalRoutes } from '@/features/hospitals';
import { requestRoutes } from '@/features/requests';
import { statusRoutes } from '@/features/status';
import { AppShell } from '@/shared/layouts';
import { NotFoundPage, RouteErrorPage } from '@/shared/pages';
import { Brand, MainNav } from './nav';

export const router = createBrowserRouter([
  {
    element: <AppShell brand={<Brand />} nav={<MainNav />} />,
    errorElement: <RouteErrorPage />,
    children: [
      ...homeRoutes,
      ...requestRoutes,
      ...hospitalRoutes,
      ...statusRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
