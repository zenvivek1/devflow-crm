import { type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { Gauge } from 'lucide-react';

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-lime">
            <Gauge className="size-4 text-primary-foreground" />
          </span>
          <span className="text-[17px] font-bold tracking-tight">DevFlow CRM</span>
        </Link>
        <div className="surface-card p-8">
          <h1 className="text-[22px] font-bold">{title}</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">{subtitle}</p>
          <div className="mt-6 space-y-4">{children}</div>
          <div className="mt-6 text-center text-[12px] text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}
