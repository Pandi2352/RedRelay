import { NavLink } from 'react-router';
import { cn } from '../lib';

export interface NavItemProps {
  to: string;
  label: string;
}

export function NavItem({ to, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          'rounded-md px-3 py-1.5 font-medium text-fg-muted hover:bg-surface-muted hover:text-fg',
          isActive && 'bg-secondary-soft text-secondary-soft-fg',
        )
      }
    >
      {label}
    </NavLink>
  );
}
