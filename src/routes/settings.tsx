import { createFileRoute } from '@tanstack/react-router';
import { AppShell } from '@/components/devflow/app-shell';
import { SectionHeader, SurfaceCard } from '@/components/devflow/primitives';
import { PillButton } from '@/components/devflow/dialogs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const Route = createFileRoute('/settings')({
  head: () => ({
    meta: [
      { title: 'Workspace Settings — DevFlow CRM' },
      { name: 'description', content: 'Manage your DevFlow CRM profile and workspace defaults.' },
      { property: 'og:title', content: 'Workspace Settings — DevFlow CRM' },
      { property: 'og:description', content: 'Profile and workspace preferences.' },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell>
      <div className="mb-7">
        <h1 className="text-[28px] font-bold">Settings</h1>
        <p className="mt-1 text-[14px] text-muted-foreground">Workspace profile and defaults.</p>
      </div>
      <SurfaceCard className="max-w-2xl">
        <SectionHeader title="Profile" subtitle="Shown across your workspace" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-[12px] text-muted-foreground">Name</Label>
            <Input defaultValue="Rowan Mercer" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[12px] text-muted-foreground">Email</Label>
            <Input defaultValue="rowan@devflow.dev" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[12px] text-muted-foreground">Studio</Label>
            <Input defaultValue="DevFlow Studio" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[12px] text-muted-foreground">Default currency</Label>
            <Input defaultValue="USD" />
          </div>
        </div>
        <div className="mt-5">
          <PillButton onClick={() => toast.success('Settings saved')}>Save changes</PillButton>
        </div>
      </SurfaceCard>
    </AppShell>
  );
}
