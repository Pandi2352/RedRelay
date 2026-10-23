import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router';
import { ROUTES } from '../constants';

export interface RequireAuthProps {
  redirectTo?: string;
}

/**
 * Route guard that requires an authenticated user session.
 * Unauthenticated users are redirected to the login page with the previous location saved in state.
 */
export function RequireAuth({ redirectTo = ROUTES.login }: RequireAuthProps) {
  const location = useLocation();
  const isAuthenticated = useSelector(
    (state: { auth?: { isAuthenticated?: boolean } }) =>
      Boolean(state.auth?.isAuthenticated),
  );

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
