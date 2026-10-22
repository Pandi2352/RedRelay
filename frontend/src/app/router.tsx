import { createBrowserRouter } from 'react-router';
import { homeRoutes } from '@/features/home';
import { statusRoutes } from '@/features/status';
import { AppShell } from '@/shared/layouts';
import { NotFoundPage, RouteErrorPage } from '@/shared/pages';
import { Brand, MainNav } from './nav';

export const router = createBrowserRouter([
  {
    element: <AppShell brand={<Brand />} nav={<MainNav />} />,
    errorElement: <RouteErrorPage />,
    children: [...homeRoutes, ...statusRoutes, { path: '*', element: <NotFoundPage /> }],
  },
]);
