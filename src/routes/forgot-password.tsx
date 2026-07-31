import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/devflow/auth-layout';
import { PillButton } from '@/components/devflow/dialogs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/forgot-password')({
  head: () => ({
    meta: [
      { title: 'Reset link — DevFlow CRM' },
      { name: 'description', content: 'Request a password reset link for DevFlow CRM.' },
      { property: 'og:title', content: 'Reset link — DevFlow CRM' },
      { property: 'og:description', content: 'Recover access to your DevFlow workspace.' },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  return (
    <AuthLayout
      title="Forgot password"
      subtitle="We'll email you a secure reset link."
      footer={
        <Link to="/login" className="font-semibold text-foreground">
          Back to sign in
        </Link>
      }
    >
      <div className="space-y-1.5">
        <Label className="text-[12px] text-muted-foreground">Email</Label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <PillButton
        className="w-full"
        onClick={() =>
          email ? toast.success('Reset link sent') : toast.error('Enter your email')
        }
      >
        Send reset link
      </PillButton>
    </AuthLayout>
  );
}
