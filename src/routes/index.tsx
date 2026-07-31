import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ArrowUpRight,
  Copy,
  FileWarning,
  FolderGit2,
  MoreHorizontal,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from 'recharts';
import { Checkbox } from '@/components/ui/checkbox';
import { AppShell } from '@/components/devflow/app-shell';
import { QuickActions } from '@/components/devflow/dialogs';
import {
  CardLabel,
  DeltaPill,
  EmptyState,
  Metric,
  ProgressBar,
  SectionHeader,
  StatusPill,
  SurfaceCard,
  TechPills,
} from '@/components/devflow/primitives';
import { useDevFlow } from '@/lib/devflow-store';
import { STAGES, money, throughput, type Currency } from '@/lib/devflow-types';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Dashboard — DevFlow CRM for developers' },
      {
        name: 'description',
        content:
          'Track clients, dev pipeline stages, overdue tasks and pending invoice revenue in one developer-first CRM dashboard.',
      },
      { property: 'og:title', content: 'Dashboard — DevFlow CRM' },
      {
        property: 'og:description',
        content: 'Clients, pipeline, tasks and revenue for freelance developers.',
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { clients, projects, tasks, docs, activity, toggleTask } = useDevFlow();

  const activeProjects = projects.filter((p) => p.stage !== 'maintenance');
  const overdue = tasks.filter((t) => !t.done && new Date(t.dueDate) < new Date());
  const pendingInvoices = docs.filter(
    (d) => d.type === 'invoice' && (d.status === 'sent' || d.status === 'overdue'),
  );
  const pendingByCurrency = pendingInvoices.reduce<Record<Currency, number>>(
    (acc, d) => {
      const currency = projects.find((p) => p.id === d.projectId)?.currency ?? 'USD';
      acc[currency] = (acc[currency] ?? 0) + (d.amount ?? 0);
      return acc;
    },
    { USD: 0, EUR: 0, INR: 0 },
  );
  const pendingCurrencies = (['USD', 'EUR', 'INR'] as const)
    .map((currency) => [currency, pendingByCurrency[currency]] as const)
    .filter(([, amount]) => amount > 0);

  const urgent = tasks.filter((t) => !t.done).slice(0, 5);
  const max = Math.max(...throughput.map((t) => t.paid + t.pending));

  return (
    <AppShell>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold">Welcome back, Rowan</h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Stay on top of your clients, ship your pipeline, and get paid on time.
          </p>
        </div>
        <QuickActions />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="grid gap-6 sm:grid-cols-2 xl:col-span-2">
          <StatCard
            label="Total Active Clients"
            value={String(clients.length)}
            delta="7%"
            up
            icon={<Users className="size-4" />}
          />
          <StatCard
            label="Active Projects"
            value={String(activeProjects.length)}
            delta="4%"
            up
            icon={<FolderGit2 className="size-4" />}
          />
          <StatCard
            label="Overdue Tasks"
            value={String(overdue.length)}
            delta="12%"
            up={false}
            icon={<FileWarning className="size-4" />}
          />
            <div className="rounded-2xl bg-surface-dark p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-start justify-between">
                <p className="text-[13px] font-medium text-on-dark/60">
                  Pending Invoice Revenue
                </p>
                <span className="flex size-8 items-center justify-center rounded-full bg-on-dark/10">
                  <ArrowUpRight className="size-4 text-lime" />
                </span>
              </div>
              {pendingCurrencies.length === 0 ? (
                <p className="mt-4 text-[13px] text-on-dark/60">Nothing pending</p>
              ) : (
                <div className="mt-4 space-y-2">
                  {pendingCurrencies.map(([currency, amount]) => (
                    <div
                      key={currency}
                      className="flex items-baseline justify-between"
                    >
                      <span className="text-[12px] font-medium text-on-dark/60">
                        {currency}
                      </span>
                      <span className="text-[24px] font-bold leading-none tracking-tight text-on-dark">
                        {money(Math.round(amount), currency)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {pendingInvoices.length > 0 && (
                <DeltaPill
                  value="9%"
                  up
                  caption={`Across ${pendingInvoices.length} open invoice${pendingInvoices.length === 1 ? '' : 's'}`}
                  dark
                />
              )}
            </div>
        </div>

        <SurfaceCard>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[17px] font-bold">Pipeline Throughput</h2>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Paid vs. pending value by month
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <i className="size-2 rounded-full bg-lime" /> Paid
              </span>
              <span className="flex items-center gap-1.5">
                <i className="size-2 rounded-full bg-surface-dark" /> Pending
              </span>
            </div>
          </div>
          <div className="mt-6 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={throughput} barGap={2}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                />
                <Bar dataKey="pending" fill="var(--surface-dark)" radius={6} barSize={10} />
                <Bar dataKey="paid" fill="var(--lime)" radius={6} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Peak month tracked at {max} units of throughput.
          </p>
        </SurfaceCard>
      </div>

      <SurfaceCard className="mt-6">
        <SectionHeader
          title="9-Stage Project Pipeline"
          subtitle="How your active work is distributed across the developer lifecycle"
        />
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {STAGES.map((s) => {
            const count = projects.filter((p) => p.stage === s.key).length;
            const hot =
              count ===
              Math.max(...STAGES.map((x) => projects.filter((p) => p.stage === x.key).length));
            return (
              <div
                key={s.key}
                className={`min-w-[132px] flex-1 rounded-2xl border border-border px-4 py-3 ${
                  hot && count > 0 ? 'bg-lime' : 'bg-muted'
                }`}
              >
                <p className="text-[11px] font-medium text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-[22px] font-bold">{count}</p>
              </div>
            );
          })}
        </div>
      </SurfaceCard>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <SurfaceCard>
          <SectionHeader title="Urgent Tasks" subtitle="Follow-ups due soon" />
          <ul className="space-y-1">
            {urgent.length === 0 ? (
              <EmptyState title="Nothing urgent" hint="You're all caught up." />
            ) : (
              urgent.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-3 border-b border-border py-3 last:border-0"
                >
                  <Checkbox
                    className="rounded-full"
                    checked={t.done}
                    onCheckedChange={(checked) => {
                      toggleTask(t.id);
                      if (checked) toast.success('Task completed');
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{t.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Due {new Date(t.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </SurfaceCard>

        <div className="space-y-6">
          <SurfaceCard>
            <SectionHeader title="Sprint Progress" subtitle="Northlane Billing Portal" />
            <ProgressBar value={62} />
            <div className="mt-3 flex justify-between text-[12px] text-muted-foreground">
              <span className="font-semibold text-foreground">62% shipped</span>
              <span>24 days to deadline</span>
            </div>
          </SurfaceCard>
          <SurfaceCard>
            <SectionHeader title="Connected Infrastructure" />
            <div className="grid gap-3 sm:grid-cols-2">
              {projects.slice(0, 2).map((p) => (
                <div key={p.id} className="rounded-2xl bg-surface-dark p-4 text-on-dark">
                  <p className="text-[12px] text-on-dark/60">{p.hostingProvider}</p>
                  <p className="mt-6 font-mono text-[11px] text-on-dark/80">
                    {p.githubRepoUrl}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="rounded-full bg-lime/20 px-2 py-0.5 text-[10px] font-semibold text-lime">
                      Active
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(p.githubRepoUrl);
                        toast.success('Repo URL copied');
                      }}
                      className="text-on-dark/60 hover:text-on-dark"
                    >
                      <Copy className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>

        <SurfaceCard>
          <SectionHeader title="Budgets by Currency" subtitle="Across all live projects" />
          <div className="grid grid-cols-3 gap-2">
            {(['USD', 'EUR', 'INR'] as const).map((cur) => {
              const total = projects
                .filter((p) => p.currency === cur)
                .reduce((s, p) => s + p.budget, 0);
              return (
                <div key={cur} className="rounded-2xl border border-border p-3">
                  <p className="text-[11px] font-semibold">{cur}</p>
                  <p className="mt-2 text-[14px] font-bold">{money(total, cur)}</p>
                  <p className="mt-1 text-[10px] text-success">Active</p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 space-y-3">
            {projects.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                to="/projects/$projectId"
                params={{ projectId: p.id }}
                className="block rounded-2xl border border-border p-3 transition-colors hover:bg-muted"
              >
                <p className="text-[13px] font-semibold">{p.name}</p>
                <div className="mt-2">
                  <TechPills stack={p.techStack} limit={3} />
                </div>
              </Link>
            ))}
          </div>
        </SurfaceCard>
      </div>

      <SurfaceCard className="mt-6 p-0">
        <div className="p-6 pb-2">
          <SectionHeader title="Recent Activity" subtitle="Automated audit log" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-muted/60 text-[12px] text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Project</th>
                <th className="px-6 py-3 font-medium">Detail</th>
                <th className="px-6 py-3 font-medium">When</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {activity.slice(0, 6).map((a) => {
                const project = projects.find((p) => p.id === a.projectId);
                return (
                  <tr key={a.id} className="border-t border-border">
                    <td className="px-6 py-4">
                      <span className="font-mono text-[11px] text-indigo">{a.action}</span>
                    </td>
                    <td className="px-6 py-4 font-medium">{project?.name ?? '\u2014'}</td>
                    <td className="px-6 py-4">
                      <StatusPill
                        status={
                          (
                            a.meta.to ?? a.meta.doc ?? a.meta.task ?? a.meta.client ?? 'completed'
                          ).toLowerCase()
                        }
                      />
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(a.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      <MoreHorizontal className="ml-auto size-4" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SurfaceCard>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  delta,
  up,
  icon,
}: {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  icon: React.ReactNode;
}) {
  return (
    <SurfaceCard>
      <div className="flex items-start justify-between">
        <CardLabel>{label}</CardLabel>
        <span className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </span>
      </div>
      <Metric value={value} />
      <DeltaPill value={delta} up={up} caption="vs. last month" />
    </SurfaceCard>
  );
}
