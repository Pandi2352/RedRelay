import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button, Card, Field, Input, Select, type SelectOption } from '@/shared/ui';
import { ROUTES } from '@/shared/constants';
import { useRegisterMutation } from '../api/authApi';
import type { Role } from '../types';

const ROLE_OPTIONS: SelectOption[] = [
  { value: 'donor', label: 'Blood Donor (Ready to respond & donate)' },
  { value: 'hospital_staff', label: 'Hospital Staff (Post & manage requests)' },
  { value: 'hospital_admin', label: 'Hospital Admin (Manage hospital & team)' },
];

export function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('donor');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        phone: phone.trim() || undefined,
      }).unwrap();
      navigate(ROUTES.requests, { replace: true });
    } catch (err: unknown) {
      const errorObj = err as { data?: { error?: { message?: string } }; message?: string };
      setErrorMessage(
        errorObj?.data?.error?.message ?? errorObj?.message ?? 'Registration failed. Please try again.',
      );
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col justify-center py-6 sm:py-12">
      <Card className="border border-border bg-surface p-6 sm:p-8">
        <div className="mb-6 flex flex-col gap-1 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-fg">Join RedRelay</h1>
          <p className="text-sm text-fg-muted">Create an account to start saving lives</p>
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
          <Field label="Full name" required>
            <Input
              type="text"
              autoComplete="name"
              required
              placeholder="e.g. Sarah Jenkins"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

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

          <Field label="Password" hint="At least 8 characters" required>
            <Input
              type="password"
              autoComplete="new-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Field label="Account role" required>
            <Select
              options={ROLE_OPTIONS}
              value={role}
              onChange={(val) => setRole(val as Role)}
              placeholder="Select account role"
              searchable={false}
            />
          </Field>

          <Field label="Phone number (optional)">
            <Input
              type="tel"
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Field>

          <Button type="submit" variant="primary" disabled={isLoading} className="mt-2 w-full">
            {isLoading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <div className="mt-6 border-t border-border pt-4 text-center">
          <p className="text-xs text-fg-muted">
            Already have an account?{' '}
            <Link to={ROUTES.login} className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default RegisterPage;
