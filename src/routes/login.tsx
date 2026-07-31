import { useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/devflow/auth-layout';
import { PillButton } from '@/components/devflow/dialogs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth';

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      { title: 'Sign in — DevFlow CRM' },
      { name: 'description', content: 'Sign in to your DevFlow CRM workspace.' },
      { property: 'og:title', content: 'Sign in — DevFlow CRM' },
      { property: 'og:description', content: 'Access your developer CRM workspace.' },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setError('Email and password are required.');
    setError('');
    loginStore('demo_access_token', 'demo_refresh_token', {
      id: 'usr_1',
      name: 'Rowan Mercer',
      email,
    });
    toast.success('Signed in');
    navigate({ to: '/' });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your DevFlow workspace."
      footer={
        <>
          No account?{' '}
          <Link to="/signup" className="font-semibold text-foreground">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="login-email" className="text-[12px] text-muted-foreground">
            Email
          </Label>
          <Input
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            placeholder="rowan@devflow.dev"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="login-password" className="text-[12px] text-muted-foreground">
            Password
          </Label>
          <Input
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
          />
        </div>
        {error ? <p className="text-[12px] text-danger">{error}</p> : null}
        <PillButton type="submit" className="w-full">
          Sign in
        </PillButton>
      </form>
      <Link
        to="/forgot-password"
        className="mt-4 block text-center text-[12px] text-muted-foreground hover:text-foreground"
      >
        Forgot your password?
      </Link>
    </AuthLayout>
  );
}
