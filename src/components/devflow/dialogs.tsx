import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useDevFlow } from '@/lib/devflow-store';
import type {
  ClientSource,
  Currency,
  DocumentStatus,
  DocumentType,
  Priority,
  ProjectStage,
  ProjectType,
} from '@/lib/devflow-types';

export function PillButton({
  className,
  variant = 'default',
  children,
  ...props
}: ButtonProps & { variant?: 'default' | 'ghost' }) {
  return (
    <Button
      className={cn(
        'rounded-full px-4 py-2 text-[13px] font-medium',
        variant === 'ghost' && 'bg-muted text-muted-foreground hover:text-foreground',
        variant === 'default' && 'bg-surface-dark text-on-dark hover:bg-surface-dark/90',
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

export function NewClientDialog({ trigger }: { trigger: ReactNode }) {
  const { addClient } = useDevFlow();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({
    name: '',
    companyName: '',
    website: '',
    contactEmail: '',
    contactPhone: '',
    country: '',
    timezone: '',
    source: 'other' as ClientSource,
  });

  const save = () => {
    if (!f.name || !f.companyName || !f.contactEmail) {
      toast.error('Name, company and email are required');
      return;
    }
    addClient(f);
    setOpen(false);
    toast.success('Client created');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Client</DialogTitle>
          <DialogDescription>Add a client to your workspace.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          {(
            [
              ['name', 'Contact name'],
              ['companyName', 'Company name'],
              ['website', 'Website'],
              ['contactEmail', 'Email'],
              ['contactPhone', 'Phone'],
              ['country', 'Country'],
              ['timezone', 'Timezone'],
            ] as const
          ).map(([k, label]) => (
            <div key={k} className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground">{label}</Label>
              <Input value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
            </div>
          ))}
          <div className="space-y-1.5">
            <Label className="text-[12px] text-muted-foreground">Source</Label>
            <Select
              value={f.source}
              onValueChange={(v) => setF({ ...f, source: v as ClientSource })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['referral', 'upwork', 'linkedin', 'cold_outreach', 'personal_network', 'other'].map(
                  (s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <PillButton onClick={save}>Save client</PillButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function NewProjectDialog({ trigger }: { trigger: ReactNode }) {
  const { addProject, clients } = useDevFlow();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({
    name: '',
    clientId: '',
    techStack: '',
    githubRepoUrl: '',
    stagingUrl: '',
    productionUrl: '',
    apiDocsUrl: '',
    hostingProvider: '',
    stage: 'client_inquiry' as ProjectStage,
    budget: 0,
    currency: 'USD' as Currency,
    projectType: 'fixed_price' as ProjectType,
    priority: 'medium' as Priority,
    deadline: '',
    nextMeetingAt: '',
  });

  const save = () => {
    if (!f.name || !f.clientId) {
      toast.error('Project name and client are required');
      return;
    }
    addProject({ ...f, budget: Number(f.budget) });
    setOpen(false);
    toast.success('Project created');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>Create a new development project.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-[12px] text-muted-foreground">Project name</Label>
            <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[12px] text-muted-foreground">Client</Label>
            <Select value={f.clientId} onValueChange={(v) => setF({ ...f, clientId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(
            [
              ['techStack', 'Tech stack (comma-separated)'],
              ['githubRepoUrl', 'GitHub repo URL'],
              ['stagingUrl', 'Staging URL'],
              ['productionUrl', 'Production URL'],
              ['apiDocsUrl', 'API docs URL'],
              ['hostingProvider', 'Hosting provider'],
            ] as const
          ).map(([k, label]) => (
            <div key={k} className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground">{label}</Label>
              <Input value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground">Budget</Label>
              <Input
                type="number"
                value={f.budget || ''}
                onChange={(e) => setF({ ...f, budget: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground">Currency</Label>
              <Select
                value={f.currency}
                onValueChange={(v) => setF({ ...f, currency: v as Currency })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['USD', 'EUR', 'INR'] as const).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground">Type</Label>
              <Select
                value={f.projectType}
                onValueChange={(v) => setF({ ...f, projectType: v as ProjectType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['fixed_price', 'hourly', 'retainer'] as const).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground">Priority</Label>
              <Select
                value={f.priority}
                onValueChange={(v) => setF({ ...f, priority: v as Priority })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <SelectItem key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground">Deadline</Label>
              <Input
                type="date"
                value={f.deadline}
                onChange={(e) => setF({ ...f, deadline: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground">Next meeting</Label>
              <Input
                type="date"
                value={f.nextMeetingAt}
                onChange={(e) => setF({ ...f, nextMeetingAt: e.target.value })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <PillButton onClick={save}>Save project</PillButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function NewDocDialog({
  trigger,
  defaultProjectId,
}: {
  trigger: ReactNode;
  defaultProjectId?: string;
}) {
  const { addDoc, projects } = useDevFlow();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({
    projectId: defaultProjectId ?? '',
    type: 'invoice' as DocumentType,
    status: 'draft' as DocumentStatus,
    url: '',
    fileName: '',
    amount: 0,
  });

  const save = () => {
    if (!f.projectId || !f.fileName) {
      toast.error('Project and file name are required');
      return;
    }
    addDoc(f);
    setOpen(false);
    toast.success('Document linked');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link Document</DialogTitle>
          <DialogDescription>Attach a document or invoice to a project.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-[12px] text-muted-foreground">Project</Label>
            <Select value={f.projectId} onValueChange={(v) => setF({ ...f, projectId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[12px] text-muted-foreground">Type</Label>
            <Select
              value={f.type}
              onValueChange={(v) => setF({ ...f, type: v as DocumentType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(['proposal', 'contract', 'nda', 'requirement_doc', 'invoice'] as const).map(
                  (t) => (
                    <SelectItem key={t} value={t}>
                      {t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[12px] text-muted-foreground">File name</Label>
            <Input
              value={f.fileName}
              onChange={(e) => setF({ ...f, fileName: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[12px] text-muted-foreground">URL</Label>
            <Input value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[12px] text-muted-foreground">
              Amount (if invoice)
            </Label>
            <Input
              type="number"
              value={f.amount || ''}
              onChange={(e) => setF({ ...f, amount: Number(e.target.value) })}
            />
          </div>
        </div>
        <DialogFooter>
          <PillButton onClick={save}>Link document</PillButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function NewTaskDialog({
  trigger,
  defaults,
}: {
  trigger: ReactNode;
  defaults?: { clientId?: string; projectId?: string };
}) {
  const { addTask, projects, clients } = useDevFlow();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({
    title: '',
    clientId: defaults?.clientId ?? '',
    projectId: defaults?.projectId ?? '',
    dueDate: '',
  });

  const save = () => {
    if (!f.title) {
      toast.error('Task title is required');
      return;
    }
    addTask(f);
    setOpen(false);
    toast.success('Task created');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>Add a follow-up task.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-[12px] text-muted-foreground">Title</Label>
            <Input
              value={f.title}
              onChange={(e) => setF({ ...f, title: e.target.value })}
              placeholder="Chase invoice, review PR, …"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[12px] text-muted-foreground">Client (optional)</Label>
            <Select
              value={f.clientId}
              onValueChange={(v) => setF({ ...f, clientId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[12px] text-muted-foreground">Project (optional)</Label>
            <Select
              value={f.projectId}
              onValueChange={(v) => setF({ ...f, projectId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[12px] text-muted-foreground">Due date</Label>
            <Input
              type="date"
              value={f.dueDate}
              onChange={(e) => setF({ ...f, dueDate: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <PillButton onClick={save}>Create task</PillButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2">
      <NewClientDialog
        trigger={<PillButton variant="ghost">+ Client</PillButton>}
      />
      <NewProjectDialog
        trigger={<PillButton variant="ghost">+ Project</PillButton>}
      />
      <NewTaskDialog
        trigger={<PillButton variant="ghost">+ Task</PillButton>}
      />
    </div>
  );
}
