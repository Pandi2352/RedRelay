import { Navigate } from 'react-router';
import { ROUTES } from '@/shared/constants';

export function HomePage() {
  return <Navigate to={ROUTES.requests} replace />;
}
