import { useState } from 'react';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowLeft, Globe, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell } from '@/components/devflow/app-shell';
import { NewTaskDialog, PillButton } from '@/components/devflow/dialogs';
import {
  EmptyState,
  SectionHeader,
  StagePill,
  SurfaceCard,
  TechPills,
} from '@/components/devflow/primitives';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useDevFlow } from '@/lib/devflow-store';
import { money, titleize } from '@/lib/devflow-types';

export const Route = createFileRoute('/clients/$clientId')({
  head: () => ({
    meta: [
      { title: 'Client Detail — DevFlow CRM' },
      {
        name: 'description',
        content:
          'Client profile with linked projects, tech stacks, notes, follow-up tasks and an auto-generated activity timeline.',
      },
      { property: 'og:title', content: 'Client Detail — DevFlow CRM' },
      {
        property: 'og:description',
        content: 'Contact info, linked projects, notes and timeline for a single client.',
      },
    ],
  }),
  component: ClientDetail,
  errorComponent: ({ error }: { error: Error }) => (
    <AppShell>
      <SurfaceCard className="mt-6">{error.message}</SurfaceCard>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell>
      <SurfaceCard className="mt-6">
        <EmptyState title="Client not found" hint="It may have been removed." />
      </SurfaceCard>
    </AppShell>
  ),
});

function ClientDetail() {
  const { clientId } = Route.useParams();
  const { clients, projects, tasks, notes, activity, addNote, toggleTask } = useDevFlow();
  const [draft, setDraft] = useState('');

  const client = clients.find((c) => c.id === clientId);
  if (!client) throw notFound();

  const own = projects.filter((p) => p.clientId === client.id);
  const clientTasks = tasks.filter((t) => t.clientId === client.id);
  const clientNotes = notes.filter((n) => n.clientId === client.id);
  const timeline = activity.filter((a) => a.clientId === client.id);

  return (
    <AppShell>
      <Link
        to="/clients"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to clients
      </Link>

      <SurfaceCard className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-surface-dark text-[16px] font-bold text-on-dark">
              {client.companyName.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <h1 className="text-[26px] font-bold">{client.companyName}</h1>
              <p className="mt-1 text-[13px] text-muted-foreground">
                {client.name} \u00B7 {client.country} \u00B7 {client.timezone}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium">
                  Source: {titleize(client.source)}
                </span>
                <span className="code-chip">{client.website}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <PillButton variant="ghost" onClick={() => toast.success('Draft email opened')}>
              <Mail className="size-3.5" /> Email
            </PillButton>
            <PillButton variant="ghost" onClick={() => toast.success('Dialing\u2026')}>
              <Phone className="size-3.5" /> Call
            </PillButton>
            <PillButton variant="ghost" onClick={() => toast.success('Website opened')}>
              <Globe className="size-3.5" /> Website
            </PillButton>
          </div>
        </div>
      </SurfaceCard>

      <div className="grid gap-6 lg:grid-cols-3">
        <SurfaceCard className="lg:col-span-2">
          <SectionHeader title="Linked Projects" subtitle={`${own.length} projects`} />
          {own.length === 0 ? (
            <EmptyState title="No projects yet" hint="Create a project for this client." />
          ) : (
            <div className="space-y-3">
              {own.map((p) => (
                <Link
                  key={p.id}
                  to="/projects/$projectId"
                  params={{ projectId: p.id }}
                  className="block rounded-2xl border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[14px] font-semibold">{p.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold">
                        {money(p.budget, p.currency)}
                      </span>
                      <StagePill stage={p.stage} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <TechPills stack={p.techStack} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </SurfaceCard>

        <SurfaceCard>
          <SectionHeader
            title="Follow-up Tasks"
            action={
              <NewTaskDialog
                defaults={{ clientId: client.id }}
                trigger={<PillButton variant="ghost">+ Task</PillButton>}
              />
            }
          />
          {clientTasks.length === 0 ? (
            <EmptyState title="No tasks" />
          ) : (
            <ul>
              {clientTasks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-3 border-b border-border py-3 last:border-0"
                >
                  <Checkbox
                    className="rounded-full"
                    checked={t.done}
                    onCheckedChange={() => toggleTask(t.id)}
                  />
                  <div className="min-w-0">
                    <p
                      className={`truncate text-[13px] ${t.done ? 'text-muted-foreground line-through' : 'font-medium'}`}
                    >
                      {t.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(t.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SurfaceCard>

        <SurfaceCard className="lg:col-span-2">
          <SectionHeader title="Notes" subtitle="Markdown-friendly freeform notes" />
          <Textarea
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a note about this client\u2026"
            className="rounded-2xl"
          />
          <div className="mt-3">
            <PillButton
              onClick={() => {
                if (!draft.trim()) return toast.error('Note is empty');
                addNote({ clientId: client.id, content: draft.trim() });
                setDraft('');
                toast.success('Note added');
              }}
            >
              Save note
            </PillButton>
          </div>
          <div className="mt-5 space-y-3">
            {clientNotes.map((n) => (
              <div key={n.id} className="rounded-2xl bg-muted/60 p-4">
                <p className="text-[13px]">{n.content}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <SectionHeader title="Timeline" subtitle="Auto-generated activity" />
          {timeline.length === 0 ? (
            <EmptyState title="No activity yet" />
          ) : (
            <ol className="relative space-y-5 border-l border-border pl-5">
              {timeline.map((a) => (
                <li key={a.id} className="relative">
                  <span className="absolute -left-[26px] top-1.5 size-2 rounded-full bg-lime" />
                  <p className="font-mono text-[11px] text-indigo">{a.action}</p>
                  <p className="mt-1 text-[12px]">
                    {Object.values(a.meta).join(' \u2192 ')}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
