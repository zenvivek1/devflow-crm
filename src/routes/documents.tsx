import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell } from '@/components/devflow/app-shell';
import { NewDocDialog, PillButton } from '@/components/devflow/dialogs';
import { EmptyState, StatusPill, SurfaceCard } from '@/components/devflow/primitives';
import { useDevFlow } from '@/lib/devflow-store';
import { money, titleize, type DocumentStatus, type DocumentType } from '@/lib/devflow-types';

export const Route = createFileRoute('/documents')({
  head: () => ({
    meta: [
      { title: 'Document & Invoice Hub — DevFlow CRM' },
      {
        name: 'description',
        content:
          'Every proposal, contract, NDA, requirement doc and invoice with status tracking and one-click external links.',
      },
      { property: 'og:title', content: 'Document & Invoice Hub — DevFlow CRM' },
      {
        property: 'og:description',
        content: 'Track proposals, contracts, NDAs and invoices by type and status.',
      },
    ],
  }),
  component: DocumentsPage,
});

const TYPES: (DocumentType | 'all')[] = [
  'all',
  'proposal',
  'contract',
  'nda',
  'requirement_doc',
  'invoice',
];
const STATUSES: (DocumentStatus | 'all')[] = ['all', 'draft', 'sent', 'signed', 'paid', 'overdue'];

function DocumentsPage() {
  const { docs, projects } = useDevFlow();
  const [type, setType] = useState<DocumentType | 'all'>('all');
  const [status, setStatus] = useState<DocumentStatus | 'all'>('all');

  const rows = docs.filter(
    (d) =>
      (type === 'all' || d.type === type) && (status === 'all' || d.status === status),
  );

  const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? '\u2014';
  const projectCurrency = (id: string) => projects.find((p) => p.id === id)?.currency ?? 'USD';

  return (
    <AppShell>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold">Document & Invoice Hub</h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            {docs.length} linked documents across all client projects.
          </p>
        </div>
        <NewDocDialog trigger={<PillButton>+ Link Doc</PillButton>} />
      </div>

      <SurfaceCard className="p-0">
        <div className="flex flex-wrap gap-3 p-6 pb-4">
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`rounded-full px-3.5 py-2 text-[12px] font-medium ${
                  type === t
                    ? 'bg-surface-dark text-on-dark'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'all' ? 'All types' : titleize(t)}
              </button>
            ))}
          </div>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-full border px-3.5 py-2 text-[12px] font-medium ${
                  status === s
                    ? 'border-lime bg-lime text-primary-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {s === 'all' ? 'All statuses' : titleize(s)}
              </button>
            ))}
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState title="No documents match" hint="Try another filter combination." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-muted/60 text-[12px] text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Document</th>
                  <th className="px-6 py-3 font-medium">Project</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Link</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.id} className="border-t border-border hover:bg-muted/40">
                    <td className="px-6 py-4 font-medium">{d.fileName}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {projectName(d.projectId)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="code-chip">{titleize(d.type)}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {d.amount ? money(d.amount, projectCurrency(d.projectId)) : '\u2014'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={d.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(d.url);
                            toast.success('Link copied');
                          }}
                          className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="size-3.5" />
                        </button>
                        <a
                          href={d.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex size-8 items-center justify-center rounded-full bg-lime text-primary-foreground"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SurfaceCard>
    </AppShell>
  );
}
