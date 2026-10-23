import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router';
import { ROUTES } from '../constants';

export interface RequireGuestProps {
  redirectTo?: string;
}

/**
 * Route guard that requires an unauthenticated (guest) visitor.
 * Authenticated users are redirected away from login/register pages.
 */
export function RequireGuest({ redirectTo = ROUTES.requests }: RequireGuestProps) {
  const location = useLocation();
  const isAuthenticated = useSelector(
    (state: { auth?: { isAuthenticated?: boolean } }) =>
      Boolean(state.auth?.isAuthenticated),
  );

  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname?: string } })?.from?.pathname ?? redirectTo;
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}
