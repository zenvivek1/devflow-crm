import { useMemo, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Github, LayoutGrid, Rows3, Search } from 'lucide-react';
import { AppShell } from '@/components/devflow/app-shell';
import { NewProjectDialog, PillButton } from '@/components/devflow/dialogs';
import {
  EmptyState,
  PriorityPill,
  SurfaceCard,
  TechPills,
} from '@/components/devflow/primitives';
import { useDevFlow } from '@/lib/devflow-store';
import { STAGES, money, stageLabel, titleize } from '@/lib/devflow-types';

export const Route = createFileRoute('/projects/')({
  head: () => ({
    meta: [
      { title: 'Technical Project Hub — DevFlow CRM' },
      {
        name: 'description',
        content:
          'Kanban board and data table across nine developer pipeline stages, with tech stacks, repos and deploy URLs.',
      },
      { property: 'og:title', content: 'Technical Project Hub — DevFlow CRM' },
      {
        property: 'og:description',
        content: 'Board and table views of every dev project and its technical metadata.',
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { projects, clients } = useDevFlow();
  const [view, setView] = useState<'board' | 'table'>('board');
  const [q, setQ] = useState('');

  const filtered = useMemo(
    () =>
      projects.filter((p) =>
        `${p.name} ${p.techStack} ${p.hostingProvider}`
          .toLowerCase()
          .includes(q.toLowerCase()),
      ),
    [projects, q],
  );

  const clientName = (id: string) =>
    clients.find((c) => c.id === id)?.companyName ?? 'Unknown';

  return (
    <AppShell>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold">Technical Project Hub</h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            {projects.length} projects across the 9-stage developer pipeline.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-muted p-1">
            <button
              onClick={() => setView('board')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-medium ${
                view === 'board'
                  ? 'bg-surface-dark text-on-dark'
                  : 'text-muted-foreground'
              }`}
            >
              <LayoutGrid className="size-3.5" /> Board
            </button>
            <button
              onClick={() => setView('table')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-medium ${
                view === 'table'
                  ? 'bg-surface-dark text-on-dark'
                  : 'text-muted-foreground'
              }`}
            >
              <Rows3 className="size-3.5" /> Table
            </button>
          </div>
          <NewProjectDialog trigger={<PillButton>+ New Project</PillButton>} />
        </div>
      </div>

      <div className="mb-5 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 shadow-[var(--shadow-card)]">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search projects, stacks, hosting providers"
          className="w-full bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
        />
      </div>

      {filtered.length === 0 ? (
        <SurfaceCard>
          <EmptyState title="No projects match" hint="Adjust your search." />
        </SurfaceCard>
      ) : view === 'board' ? (
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">
          {STAGES.map((s) => {
            const col = filtered.filter((p) => p.stage === s.key);
            return (
              <div key={s.key} className="w-[280px] shrink-0">
                <div className="mb-3 flex items-center justify-between rounded-full bg-surface px-4 py-2 shadow-[var(--shadow-card)]">
                  <p className="text-[12px] font-semibold">{s.label}</p>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                    {col.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {col.map((p) => (
                    <Link
                      key={p.id}
                      to="/projects/$projectId"
                      params={{ projectId: p.id }}
                      className="block surface-card p-4 transition-shadow hover:shadow-[var(--shadow-pop)]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13px] font-semibold">{p.name}</p>
                        <PriorityPill priority={p.priority} />
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {clientName(p.clientId)}
                      </p>
                      <p className="mt-3 text-[15px] font-bold">
                        {money(p.budget, p.currency)}
                        <span className="ml-1 text-[11px] font-medium text-muted-foreground">
                          {p.currency} \u00B7 {titleize(p.projectType)}
                        </span>
                      </p>
                      <div className="mt-3">
                        <TechPills stack={p.techStack} limit={3} />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Github className="size-3" /> {p.hostingProvider}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="size-1.5 rounded-full bg-success" /> staging up
                        </span>
                      </div>
                    </Link>
                  ))}
                  {col.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border py-8 text-center text-[11px] text-muted-foreground">
                      Empty
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <SurfaceCard className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-muted/60 text-[12px] text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Project</th>
                  <th className="px-6 py-3 font-medium">Client</th>
                  <th className="px-6 py-3 font-medium">Stack</th>
                  <th className="px-6 py-3 font-medium">Budget</th>
                  <th className="px-6 py-3 font-medium">Stage</th>
                  <th className="px-6 py-3 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/40">
                    <td className="px-6 py-4 font-semibold">
                      <Link to="/projects/$projectId" params={{ projectId: p.id }}>
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {clientName(p.clientId)}
                    </td>
                    <td className="px-6 py-4">
                      <TechPills stack={p.techStack} limit={2} />
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {money(p.budget, p.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[12px]">{stageLabel(p.stage)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <PriorityPill priority={p.priority} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SurfaceCard>
      )}
    </AppShell>
  );
}
