import { useNavigate } from '@tanstack/react-router';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useDevFlow } from '@/lib/devflow-store';

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const { clients, projects } = useDevFlow();

  const go = (to: string) => {
    onOpenChange(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search clients, projects, pages…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {[
            ['Dashboard', '/'],
            ['Clients', '/clients'],
            ['Projects', '/projects'],
            ['Documents', '/documents'],
            ['Tasks', '/tasks'],
            ['Activity', '/activity'],
          ].map(([label, to]) => (
            <CommandItem key={to} value={label} onSelect={() => go(to)}>
              {label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Clients">
          {clients.map((c) => (
            <CommandItem
              key={c.id}
              value={`${c.companyName} ${c.name}`}
              onSelect={() => go(`/clients/${c.id}`)}
            >
              {c.companyName}
              <span className="ml-2 text-xs text-muted-foreground">{c.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Projects">
          {projects.map((p) => (
            <CommandItem
              key={p.id}
              value={`${p.name} ${p.techStack}`}
              onSelect={() => go(`/projects/${p.id}`)}
            >
              {p.name}
              <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                {p.techStack}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
