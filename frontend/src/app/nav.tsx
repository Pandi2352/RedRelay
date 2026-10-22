import { Link } from 'react-router';
import { env } from '@/shared/config/env';
import { ROUTES } from '@/shared/constants';
import { NavItem } from '@/shared/layouts';

export function Brand() {
  return (
    <Link to={ROUTES.home} className="font-display text-lg font-semibold text-primary">
      {env.appName}
    </Link>
  );
}

export function MainNav() {
  return (
    <>
      <NavItem to={ROUTES.home} label="Requests" />
      <NavItem to={ROUTES.status} label="Status" />
    </>
  );
}
