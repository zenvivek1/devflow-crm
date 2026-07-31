import { useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/devflow/auth-layout';
import { PillButton } from '@/components/devflow/dialogs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/reset-password')({
  head: () => ({
    meta: [
      { title: 'Set new password — DevFlow CRM' },
      { name: 'description', content: 'Choose a new password for your DevFlow CRM account.' },
      { property: 'og:title', content: 'Set new password — DevFlow CRM' },
      { property: 'og:description', content: 'Finish resetting your DevFlow password.' },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose something at least 8 characters long."
      footer={
        <Link to="/login" className="font-semibold text-foreground">
          Back to sign in
        </Link>
      }
    >
      <div className="space-y-1.5">
        <Label className="text-[12px] text-muted-foreground">New password</Label>
        <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-[12px] text-muted-foreground">Confirm password</Label>
        <Input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>
      {error ? <p className="text-[12px] text-danger">{error}</p> : null}
      <PillButton
        className="w-full"
        onClick={() => {
          if (pw.length < 8) return setError('Password must be 8+ characters.');
          if (pw !== confirm) return setError('Passwords do not match.');
          setError('');
          toast.success('Password updated');
          navigate({ to: '/login' });
        }}
      >
        Update password
      </PillButton>
    </AuthLayout>
  );
}
