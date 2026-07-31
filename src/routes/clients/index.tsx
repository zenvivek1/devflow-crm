import { useMemo, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Filter, Mail, Search } from 'lucide-react';
import { AppShell } from '@/components/devflow/app-shell';
import { NewClientDialog, PillButton } from '@/components/devflow/dialogs';
import { EmptyState, SectionHeader, SurfaceCard, TechPills } from '@/components/devflow/primitives';
import { useDevFlow } from '@/lib/devflow-store';
import { titleize, type ClientSource } from '@/lib/devflow-types';

export const Route = createFileRoute('/clients/')({
  head: () => ({
    meta: [
      { title: 'Client Directory — DevFlow CRM' },
      {
        name: 'description',
        content:
          'Search, filter and sort every client by source, country and linked technical projects.',
      },
      { property: 'og:title', content: 'Client Directory — DevFlow CRM' },
      {
        property: 'og:description',
        content: 'Every client, their source, timezone and linked dev projects.',
      },
    ],
  }),
  component: ClientsPage,
});

const SOURCES: (ClientSource | 'all')[] = [
  'all',
  'referral',
  'upwork',
  'linkedin',
  'cold_outreach',
  'personal_network',
  'other',
];

function ClientsPage() {
  const { clients, projects } = useDevFlow();
  const [q, setQ] = useState('');
  const [source, setSource] = useState<ClientSource | 'all'>('all');
  const [asc, setAsc] = useState(true);

  const rows = useMemo(() => {
    return clients
      .filter(
        (c) =>
          (source === 'all' || c.source === source) &&
          `${c.name} ${c.companyName} ${c.country}`
            .toLowerCase()
            .includes(q.toLowerCase()),
      )
      .sort((a, b) =>
        asc
          ? a.companyName.localeCompare(b.companyName)
          : b.companyName.localeCompare(a.companyName),
      );
  }, [clients, q, source, asc]);

  return (
    <AppShell>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold">Client Directory</h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            {clients.length} clients across {projects.length} technical projects.
          </p>
        </div>
        <NewClientDialog trigger={<PillButton>+ New Client</PillButton>} />
      </div>

      <SurfaceCard className="p-0">
        <div className="flex flex-wrap items-center gap-3 p-6 pb-4">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-border px-4 py-2.5">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search clients"
              className="w-full bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {SOURCES.map((s) => (
              <button
                key={s}
                onClick={() => setSource(s)}
                className={`rounded-full px-3.5 py-2 text-[12px] font-medium transition-colors ${
                  source === s
                    ? 'bg-surface-dark text-on-dark'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {s === 'all' ? 'All sources' : titleize(s)}
              </button>
            ))}
          </div>
          <PillButton variant="ghost" onClick={() => setAsc((v) => !v)}>
            <Filter className="size-3.5" /> {asc ? 'A\u2013Z' : 'Z\u2013A'}
          </PillButton>
        </div>

        {rows.length === 0 ? (
          <EmptyState title="No clients match" hint="Try a different search or filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-muted/60 text-[12px] text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Company</th>
                  <th className="px-6 py-3 font-medium">Contact</th>
                  <th className="px-6 py-3 font-medium">Country</th>
                  <th className="px-6 py-3 font-medium">Source</th>
                  <th className="px-6 py-3 font-medium">Projects</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => {
                  const own = projects.filter((p) => p.clientId === c.id);
                  return (
                    <tr key={c.id} className="border-t border-border hover:bg-muted/40">
                      <td className="px-6 py-4">
                        <Link
                          to="/clients/$clientId"
                          params={{ clientId: c.id }}
                          className="flex items-center gap-3"
                        >
                          <span className="flex size-8 items-center justify-center rounded-full bg-surface-dark text-[11px] font-semibold text-on-dark">
                            {c.companyName.slice(0, 2).toUpperCase()}
                          </span>
                          <span className="font-semibold">{c.companyName}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p>{c.name}</p>
                        <p className="text-[11px] text-muted-foreground">{c.contactEmail}</p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {c.country}
                        <span className="ml-2 text-[11px]">{c.timezone}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium">
                          {titleize(c.source)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {own.length ? (
                          <TechPills stack={own.map((p) => p.techStack).join(', ')} limit={2} />
                        ) : (
                          <span className="text-muted-foreground">{'\u2014'}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SurfaceCard>

      <SurfaceCard className="mt-6">
        <SectionHeader
          title="Need to reach out?"
          subtitle="Email any client directly from their detail page."
          action={
            <PillButton variant="ghost">
              <Mail className="size-3.5" /> Compose
            </PillButton>
          }
        />
      </SurfaceCard>
    </AppShell>
  );
}
