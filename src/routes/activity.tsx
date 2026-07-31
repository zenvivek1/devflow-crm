import { createFileRoute } from '@tanstack/react-router';
import {
  FilePlus2,
  FileSignature,
  GitBranch,
  StickyNote,
  UserPlus,
  CheckCircle2,
} from 'lucide-react';
import { AppShell } from '@/components/devflow/app-shell';
import { EmptyState, SurfaceCard } from '@/components/devflow/primitives';
import { useDevFlow } from '@/lib/devflow-store';

export const Route = createFileRoute('/activity')({
  head: () => ({
    meta: [
      { title: 'Activity Stream — DevFlow CRM' },
      {
        name: 'description',
        content:
          'Unified audit timeline of every automated CRM action: client created, stage changed, document status updated.',
      },
      { property: 'og:title', content: 'Activity Stream — DevFlow CRM' },
      {
        property: 'og:description',
        content: 'One timeline for every automated action across your CRM.',
      },
    ],
  }),
  component: ActivityPage,
});

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'client.created': UserPlus,
  'project.created': FilePlus2,
  'project.stage_changed': GitBranch,
  'document.created': FileSignature,
  'document.status_updated': FileSignature,
  'task.completed': CheckCircle2,
  'task.created': CheckCircle2,
  'note.added': StickyNote,
};

function ActivityPage() {
  const { activity, projects, clients } = useDevFlow();

  return (
    <AppShell>
      <div className="mb-7">
        <h1 className="text-[28px] font-bold">Activity Stream</h1>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Every automated action across clients, projects, documents and tasks.
        </p>
      </div>

      <SurfaceCard>
        {activity.length === 0 ? (
          <EmptyState title="No activity yet" />
        ) : (
          <ul>
            {activity.map((a) => {
              const Icon = ICONS[a.action] ?? GitBranch;
              const project = projects.find((p) => p.id === a.projectId);
              const client = clients.find((c) => c.id === a.clientId);
              return (
                <li
                  key={a.id}
                  className="flex items-center gap-4 border-b border-border py-4 last:border-0"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Icon className="size-4 text-muted-foreground" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] text-indigo">{a.action}</p>
                    <p className="mt-0.5 truncate text-[13px] font-medium">
                      {Object.entries(a.meta)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(' \u00B7 ')}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {[project?.name, client?.companyName].filter(Boolean).join(' \u00B7 ')}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {new Date(a.createdAt).toLocaleString()}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </SurfaceCard>
    </AppShell>
  );
}
