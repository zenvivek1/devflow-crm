import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell } from '@/components/devflow/app-shell';
import { NewDocDialog, NewTaskDialog, PillButton } from '@/components/devflow/dialogs';
import {
  EmptyState,
  PriorityPill,
  ProgressBar,
  SectionHeader,
  StatusPill,
  SurfaceCard,
  TechPills,
} from '@/components/devflow/primitives';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useDevFlow } from '@/lib/devflow-store';
import { STAGES, money, stageLabel, titleize } from '@/lib/devflow-types';

export const Route = createFileRoute('/projects/$projectId')({
  head: () => ({
    meta: [
      { title: 'Project Workspace — DevFlow CRM' },
      {
        name: 'description',
        content:
          'Advance pipeline stages, copy repo and deploy URLs, and manage docs, tasks and activity for one project.',
      },
      { property: 'og:title', content: 'Project Workspace — DevFlow CRM' },
      {
        property: 'og:description',
        content: 'Technical config, documents, tasks and activity log for a single project.',
      },
    ],
  }),
  component: ProjectWorkspace,
  errorComponent: ({ error }: { error: Error }) => (
    <AppShell>
      <SurfaceCard className="mt-6">{error.message}</SurfaceCard>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell>
      <SurfaceCard className="mt-6">
        <EmptyState title="Project not found" />
      </SurfaceCard>
    </AppShell>
  ),
});

function CopyChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-code px-4 py-3">
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="truncate font-mono text-[12px] text-indigo">{value || '\u2014'}</p>
      </div>
      <button
        onClick={() => {
          navigator.clipboard?.writeText(value);
          toast.success(`${label} copied`);
        }}
        className="shrink-0 text-muted-foreground hover:text-foreground"
      >
        <Copy className="size-3.5" />
      </button>
    </div>
  );
}

function ProjectWorkspace() {
  const { projectId } = Route.useParams();
  const { projects, clients, docs, tasks, notes, activity, setStage, toggleTask, addNote } =
    useDevFlow();
  const [draft, setDraft] = useState('');

  const project = projects.find((p) => p.id === projectId);
  if (!project) throw notFound();

  const client = clients.find((c) => c.id === project.clientId);
  const pDocs = docs.filter((d) => d.projectId === project.id);
  const pTasks = tasks.filter((t) => t.projectId === project.id);
  const pNotes = notes.filter((n) => n.projectId === project.id);
  const pActivity = activity.filter((a) => a.projectId === project.id);
  const stageIndex = STAGES.findIndex((s) => s.key === project.stage);

  const advance = () => {
    const next = STAGES[stageIndex + 1];
    if (!next) return toast.error('Project is already at the final stage');
    setStage(project.id, next.key);
    toast.success(`Project stage updated to ${next.label}`);
  };

  return (
    <AppShell>
      <Link
        to="/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to projects
      </Link>

      <SurfaceCard className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[26px] font-bold">{project.name}</h1>
              <PriorityPill priority={project.priority} />
            </div>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {client?.companyName} \u00B7 {titleize(project.projectType)} \u00B7{' '}
              {project.hostingProvider}
            </p>
            <div className="mt-3">
              <TechPills stack={project.techStack} limit={6} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-[30px] font-bold">
              {money(project.budget, project.currency)}
            </p>
            <p className="text-[12px] text-muted-foreground">
              Deadline {new Date(project.deadline).toLocaleDateString()} \u00B7 Next
              meeting {new Date(project.nextMeetingAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[13px] font-semibold">
              Stage {stageIndex + 1} of 9 \u00B7 {stageLabel(project.stage)}
            </p>
            <PillButton onClick={advance}>Advance stage \u2192</PillButton>
          </div>
          <ProgressBar value={((stageIndex + 1) / STAGES.length) * 100} />
          <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
            {STAGES.map((s, i) => (
              <button
                key={s.key}
                onClick={() => {
                  setStage(project.id, s.key);
                  toast.success(`Project stage updated to ${s.label}`);
                }}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  i === stageIndex
                    ? 'bg-surface-dark text-on-dark'
                    : i < stageIndex
                      ? 'bg-lime-soft text-foreground'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <CopyChip label="GitHub Repo" value={project.githubRepoUrl} />
          <CopyChip label="Staging URL" value={project.stagingUrl} />
          <CopyChip label="Production URL" value={project.productionUrl} />
          <CopyChip label="API Docs" value={project.apiDocsUrl} />
        </div>
      </SurfaceCard>

      <Tabs defaultValue="overview">
        <TabsList className="rounded-full bg-muted p-1">
          {[
            ['overview', 'Overview & Notes'],
            ['specs', 'Technical Specs'],
            ['docs', 'Documents'],
            ['tasks', 'Tasks'],
            ['log', 'Activity Log'],
          ].map(([v, l]) => (
            <TabsTrigger
              key={v}
              value={v}
              className="rounded-full px-4 text-[12px] data-[state=active]:bg-surface-dark data-[state=active]:text-on-dark"
            >
              {l}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-5">
          <SurfaceCard>
            <SectionHeader title="Notes" subtitle="Project context and decisions" />
            <Textarea
              rows={3}
              className="rounded-2xl"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a project note\u2026"
            />
            <div className="mt-3">
              <PillButton
                onClick={() => {
                  if (!draft.trim()) return toast.error('Note is empty');
                  addNote({
                    projectId: project.id,
                    clientId: project.clientId,
                    content: draft.trim(),
                  });
                  setDraft('');
                  toast.success('Note added');
                }}
              >
                Save note
              </PillButton>
            </div>
            <div className="mt-5 space-y-3">
              {pNotes.length === 0 ? (
                <EmptyState title="No notes yet" />
              ) : (
                pNotes.map((n) => (
                  <div key={n.id} className="rounded-2xl bg-muted/60 p-4">
                    <p className="text-[13px]">{n.content}</p>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </SurfaceCard>
        </TabsContent>

        <TabsContent value="specs" className="mt-5">
          <SurfaceCard>
            <SectionHeader title="Technical Specs" subtitle="Stack and infrastructure" />
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                ['Tech stack', project.techStack],
                ['Hosting provider', project.hostingProvider],
                ['Project type', titleize(project.projectType)],
                ['Currency', project.currency],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-border p-4">
                  <dt className="text-[11px] text-muted-foreground">{k}</dt>
                  <dd className="mt-1 font-mono text-[12px]">{v}</dd>
                </div>
              ))}
            </dl>
          </SurfaceCard>
        </TabsContent>

        <TabsContent value="docs" className="mt-5">
          <SurfaceCard>
            <SectionHeader
              title="Documents & Invoices"
              action={
                <NewDocDialog
                  defaultProjectId={project.id}
                  trigger={<PillButton>+ Link Doc</PillButton>}
                />
              }
            />
            {pDocs.length === 0 ? (
              <EmptyState title="No documents linked" />
            ) : (
              <ul>
                {pDocs.map((d) => (
                  <li
                    key={d.id}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-3 last:border-0"
                  >
                    <div>
                      <p className="text-[13px] font-medium">{d.fileName}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {titleize(d.type)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusPill status={d.status} />
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SurfaceCard>
        </TabsContent>

        <TabsContent value="tasks" className="mt-5">
          <SurfaceCard>
            <SectionHeader
              title="Tasks & Follow-ups"
              action={
                <NewTaskDialog
                  defaults={{ projectId: project.id, clientId: project.clientId }}
                  trigger={<PillButton>+ Task</PillButton>}
                />
              }
            />
            {pTasks.length === 0 ? (
              <EmptyState title="No tasks" />
            ) : (
              <ul>
                {pTasks.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center gap-3 border-b border-border py-3 last:border-0"
                  >
                    <Checkbox
                      className="rounded-full"
                      checked={t.done}
                      onCheckedChange={() => toggleTask(t.id)}
                    />
                    <p
                      className={`flex-1 text-[13px] ${t.done ? 'text-muted-foreground line-through' : 'font-medium'}`}
                    >
                      {t.title}
                    </p>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(t.dueDate).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </SurfaceCard>
        </TabsContent>

        <TabsContent value="log" className="mt-5">
          <SurfaceCard>
            <SectionHeader title="Activity Log" />
            {pActivity.length === 0 ? (
              <EmptyState title="No activity yet" />
            ) : (
              <ol className="relative space-y-5 border-l border-border pl-5">
                {pActivity.map((a) => (
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
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
