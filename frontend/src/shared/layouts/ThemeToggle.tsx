import { Monitor, Moon, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTheme, setTheme, type ThemePreference } from '../store';
import { Button } from '../ui';

const NEXT: Record<ThemePreference, ThemePreference> = { system: 'light', light: 'dark', dark: 'system' };
const ICON = { light: Sun, dark: Moon, system: Monitor };
const LABEL: Record<ThemePreference, string> = {
  light: 'Theme: light. Switch to dark',
  dark: 'Theme: dark. Switch to system',
  system: 'Theme: system. Switch to light',
};

/** Cycles light → dark → system. */
export function ThemeToggle() {
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();
  const Icon = ICON[theme];

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={LABEL[theme]}
      title={LABEL[theme]}
      onClick={() => dispatch(setTheme(NEXT[theme]))}
    >
      <Icon className="size-4" aria-hidden="true" />
    </Button>
  );
}
