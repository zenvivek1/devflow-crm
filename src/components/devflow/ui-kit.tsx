import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { DocumentStatus, Priority, ProjectStage } from '@/lib/devflow-types';
import { stageLabel, titleize } from '@/lib/devflow-types';

export function SurfaceCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn('surface-card p-6', className)}>{children}</div>;
}

export function CardLabel({ children }: { children: ReactNode }) {
  return <p className="text-[13px] font-medium text-muted-foreground">{children}</p>;
}

export function Metric({ value, dark = false }: { value: string; dark?: boolean }) {
  return (
    <p
      className={cn(
        'mt-2 text-[34px] font-bold leading-none tracking-tight',
        dark ? 'text-on-dark' : 'text-foreground',
      )}
    >
      {value}
    </p>
  );
}

export function DeltaPill({
  value,
  up = true,
  caption,
  dark = false,
}: {
  value: string;
  up?: boolean;
  caption?: string;
  dark?: boolean;
}) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold',
          up
            ? dark
              ? 'bg-lime/20 text-lime'
              : 'bg-lime-soft text-foreground'
            : 'bg-danger/10 text-danger',
        )}
      >
        {up ? '\u25B2' : '\u25BC'} {value}
      </span>
      {caption ? (
        <span
          className={cn(
            'text-[12px]',
            dark ? 'text-on-dark/60' : 'text-muted-foreground',
          )}
        >
          {caption}
        </span>
      ) : null}
    </div>
  );
}

const DOT: Record<string, string> = {
  draft: 'bg-muted-foreground',
  sent: 'bg-indigo',
  signed: 'bg-success',
  paid: 'bg-success',
  overdue: 'bg-danger',
  completed: 'bg-success',
  pending: 'bg-danger',
  in_progress: 'bg-warning',
};

export function StatusPill({ status }: { status: DocumentStatus | string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-[12px] font-medium">
      <span className={cn('size-1.5 rounded-full', DOT[status] ?? 'bg-muted-foreground')} />
      {titleize(status)}
    </span>
  );
}

export function PriorityPill({ priority }: { priority: Priority }) {
  const cls =
    priority === 'high'
      ? 'bg-danger/10 text-danger'
      : priority === 'medium'
        ? 'bg-warning/15 text-warning'
        : 'bg-muted text-muted-foreground';
  return (
    <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize', cls)}>
      {priority}
    </span>
  );
}

export function StagePill({ stage }: { stage: ProjectStage }) {
  return (
    <span className="rounded-full bg-surface-dark px-2.5 py-1 text-[11px] font-medium text-on-dark">
      {stageLabel(stage)}
    </span>
  );
}

export function TechPills({ stack, limit = 4 }: { stack: string; limit?: number }) {
  const items = stack.split(',').map((s) => s.trim());
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.slice(0, limit).map((t) => (
        <span key={t} className="code-chip text-cyan">
          {t}
        </span>
      ))}
      {items.length > limit ? (
        <span className="code-chip">+{items.length - limit}</span>
      ) : null}
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-lime transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-14 text-center">
      <p className="text-sm font-semibold">{title}</p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-[17px] font-bold">{title}</h2>
        {subtitle ? <p className="mt-1 text-[13px] text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
