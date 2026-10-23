import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';
import { ROUTES } from '../constants';

export interface RequireRoleProps {
  roles: string[];
  redirectTo?: string;
  fallback?: ReactNode;
}

/**
 * Route guard checking if the authenticated user has one of the allowed roles.
 */
export function RequireRole({
  roles,
  redirectTo = ROUTES.requests,
  fallback,
}: RequireRoleProps) {
  const user = useSelector(
    (state: { auth?: { user?: { role?: string } | null } }) => state.auth?.user,
  );

  if (!user || !roles.includes(user.role ?? '')) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
