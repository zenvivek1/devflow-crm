import { useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/devflow/auth-layout';
import { PillButton } from '@/components/devflow/dialogs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/signup')({
  head: () => ({
    meta: [
      { title: 'Create account — DevFlow CRM' },
      { name: 'description', content: 'Create your DevFlow CRM workspace for dev client work.' },
      { property: 'og:title', content: 'Create account — DevFlow CRM' },
      { property: 'og:description', content: 'Start managing clients and dev projects.' },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Manage clients, repos and invoices in one place."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-foreground">
            Sign in
          </Link>
        </>
      }
    >
      <div className="space-y-1.5">
        <Label className="text-[12px] text-muted-foreground">Full name</Label>
        <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-[12px] text-muted-foreground">Email</Label>
        <Input
          type="email"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-[12px] text-muted-foreground">Password</Label>
        <Input
          type="password"
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
        />
      </div>
      {error ? <p className="text-[12px] text-danger">{error}</p> : null}
      <PillButton
        className="w-full"
        onClick={() => {
          if (!f.name || !f.email || f.password.length < 8)
            return setError('All fields required; password must be 8+ characters.');
          setError('');
          toast.success('Workspace created');
          navigate({ to: '/' });
        }}
      >
        Create account
      </PillButton>
    </AuthLayout>
  );
}
