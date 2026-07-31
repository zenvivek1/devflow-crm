import { createFileRoute } from '@tanstack/react-router';
import { AppShell } from '@/components/devflow/app-shell';
import { NewTaskDialog, PillButton } from '@/components/devflow/dialogs';
import { EmptyState, SurfaceCard } from '@/components/devflow/primitives';
import { Checkbox } from '@/components/ui/checkbox';
import { useDevFlow } from '@/lib/devflow-store';
import type { Task } from '@/lib/devflow-types';

export const Route = createFileRoute('/tasks')({
  head: () => ({
    meta: [
      { title: 'Follow-up Tasks — DevFlow CRM' },
      {
        name: 'description',
        content:
          'Lightweight follow-up reminders grouped by overdue, today, upcoming and completed, linked to clients and projects.',
      },
      { property: 'og:title', content: 'Follow-up Tasks — DevFlow CRM' },
      {
        property: 'og:description',
        content: 'Fast todo list for developer client follow-ups.',
      },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const { tasks, projects, clients, toggleTask } = useDevFlow();

  const now = new Date();
  const isToday = (d: string) => new Date(d).toDateString() === now.toDateString();
  const open = tasks.filter((t) => !t.done);

  const groups: { key: string; label: string; items: Task[] }[] = [
    {
      key: 'overdue',
      label: 'Overdue',
      items: open.filter((t) => new Date(t.dueDate) < now && !isToday(t.dueDate)),
    },
    { key: 'today', label: 'Today', items: open.filter((t) => isToday(t.dueDate)) },
    {
      key: 'upcoming',
      label: 'Upcoming',
      items: open.filter((t) => new Date(t.dueDate) > now && !isToday(t.dueDate)),
    },
    { key: 'done', label: 'Completed', items: tasks.filter((t) => t.done) },
  ];

  const label = (t: Task) =>
    [projects.find((p) => p.id === t.projectId)?.name, clients.find((c) => c.id === t.clientId)?.companyName]
      .filter(Boolean)
      .join(' \u00B7 ');

  return (
    <AppShell>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold">Follow-up Tasks</h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            {open.length} open reminders linked to clients and projects.
          </p>
        </div>
        <NewTaskDialog trigger={<PillButton>+ Quick Task</PillButton>} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {groups.map((g) => (
          <SurfaceCard key={g.key}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[15px] font-bold">{g.label}</h2>
              <span className="rounded-full bg-muted px-3 py-1 text-[11px] text-muted-foreground">
                {g.items.length}
              </span>
            </div>
            {g.items.length === 0 ? (
              <EmptyState title="Nothing here" />
            ) : (
              <ul>
                {g.items.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center gap-3 border-b border-border py-3 last:border-0"
                  >
                    <Checkbox
                      className="rounded-full"
                      checked={t.done}
                      onCheckedChange={() => toggleTask(t.id)}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-[13px] ${t.done ? 'text-muted-foreground line-through' : 'font-medium'}`}
                      >
                        {t.title}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {label(t) || 'Unlinked'}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${
                        g.key === 'overdue'
                          ? 'bg-danger/10 text-danger'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {new Date(t.dueDate).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </SurfaceCard>
        ))}
      </div>
    </AppShell>
  );
}
