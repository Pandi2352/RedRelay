import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Button, Card, Field, IconButton, Input } from '@/shared/ui';
import { ROUTES } from '@/shared/constants';
import { useLoginMutation } from '../api/authApi';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname ?? ROUTES.requests;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      await login({ email: email.trim(), password }).unwrap();
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const errorObj = err as { data?: { error?: { message?: string } }; message?: string };
      setErrorMessage(
        errorObj?.data?.error?.message ?? errorObj?.message ?? 'Invalid email or password. Please try again.',
      );
    }
  };

  const handleQuickFill = (role: 'donor' | 'hospital') => {
    if (role === 'donor') {
      setEmail('donor@example.com');
      setPassword('DonorPass123!');
    } else {
      setEmail('staff@cityhospital.org');
      setPassword('HospitalPass123!');
    }
    setErrorMessage(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col justify-center py-6 sm:py-12">
      <Card className="border border-border bg-surface p-6 sm:p-8">
        <div className="mb-6 flex flex-col gap-1 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-fg">Welcome back</h1>
          <p className="text-sm text-fg-muted">Sign in to manage requests and donor alerts</p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mb-4 rounded-md border border-primary/30 bg-primary/10 p-3 text-xs text-primary"
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Email address" required>
            <Input
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field label="Password" required>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <span className="text-xs text-fg-muted">{showPassword ? 'Hide' : 'Show'}</span>
                </IconButton>
              </div>
            </div>
          </Field>

          <Button type="submit" variant="primary" disabled={isLoading} className="mt-2 w-full">
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-fg-muted">
            <span>Demo accounts:</span>
            <button
              type="button"
              onClick={() => handleQuickFill('donor')}
              className="text-primary hover:underline"
            >
              Donor
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => handleQuickFill('hospital')}
              className="text-primary hover:underline"
            >
              Hospital Staff
            </button>
          </div>

          <p className="text-xs text-fg-muted">
            Don&apos;t have an account?{' '}
            <Link to={ROUTES.register} className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
