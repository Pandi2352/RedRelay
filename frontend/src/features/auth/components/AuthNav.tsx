import { Link, useNavigate } from 'react-router';
import { useAppSelector } from '@/app/hooks';
import { Badge, Button } from '@/shared/ui';
import { ROUTES } from '@/shared/constants';
import { useLogoutMutation } from '../api/authApi';
import type { Role } from '../types';

function formatRole(role?: Role): { label: string; tone: 'primary' | 'secondary' | 'neutral' } {
  switch (role) {
    case 'donor':
      return { label: 'Donor', tone: 'primary' };
    case 'hospital_staff':
      return { label: 'Staff', tone: 'secondary' };
    case 'hospital_admin':
      return { label: 'Hospital Admin', tone: 'secondary' };
    case 'platform_admin':
      return { label: 'Admin', tone: 'neutral' };
    default:
      return { label: 'User', tone: 'neutral' };
  }
}

export function AuthNav() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate(ROUTES.login);
    } catch {
      // Handled in api lifecycle
      navigate(ROUTES.login);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <Link to={ROUTES.login}>
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
        </Link>
        <Link to={ROUTES.register}>
          <Button variant="primary" size="sm">
            Register
          </Button>
        </Link>
      </div>
    );
  }

  const { label, tone } = formatRole(user.role);
  const initials = user.name
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : user.email.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div
          aria-hidden="true"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
        >
          {initials}
        </div>
        <div className="hidden flex-col text-left text-xs sm:flex">
          <span className="font-medium text-fg">{user.name}</span>
          <span className="text-[10px] text-fg-muted">{user.email}</span>
        </div>
        <Badge tone={tone} variant="soft">
          {label}
        </Badge>
      </div>

      <Button
        variant="ghost"
        size="sm"
        disabled={isLoading}
        onClick={handleLogout}
        className="text-xs text-fg-muted hover:text-fg"
      >
        {isLoading ? '…' : 'Sign out'}
      </Button>
    </div>
  );
}
