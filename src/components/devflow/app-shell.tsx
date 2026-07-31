import { useEffect, useState, type ReactNode } from 'react';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import {
  Bell,
  CalendarDays,
  CircleHelp,
  FileText,
  Folders,
  Gauge,
  LayoutGrid,
  ListChecks,
  LogOut,
  Search,
  Settings,
  Users,
  Waves,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import { CommandPalette } from './command-palette';

const NAV = [
  { to: '/', label: 'Dashboard' },
  { to: '/clients', label: 'Clients' },
  { to: '/projects', label: 'Projects' },
  { to: '/documents', label: 'Documents' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/activity', label: 'Activity' },
] as const;

const RAIL = [
  { to: '/', icon: LayoutGrid, label: 'Dashboard' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/projects', icon: Folders, label: 'Projects' },
  { to: '/documents', icon: FileText, label: 'Documents' },
  { to: '/tasks', icon: ListChecks, label: 'Tasks' },
  { to: '/activity', icon: CalendarDays, label: 'Activity' },
  { to: '/settings', icon: Settings, label: 'Settings' },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to);

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <div className="min-h-screen bg-background">
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />

      <aside className="fixed left-4 top-4 bottom-4 z-30 hidden w-16 flex-col items-center justify-between rounded-3xl border border-border bg-surface py-5 shadow-[var(--shadow-card)] lg:flex">
        <div className="flex flex-col items-center gap-2">
          <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-lime">
            <Waves className="size-5 text-primary-foreground" />
          </div>
          {RAIL.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              title={label}
              className={cn(
                'flex size-10 items-center justify-center rounded-full transition-colors',
                isActive(to)
                  ? 'bg-surface-dark text-on-dark'
                  : 'text-muted-foreground hover:bg-muted',
              )}
            >
              <Icon className="size-[18px]" />
            </Link>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <button className="flex size-10 items-center justify-center rounded-full hover:bg-muted">
            <CircleHelp className="size-[18px]" />
          </button>
          <button
            onClick={handleLogout}
            title="Log out"
            className="flex size-10 items-center justify-center rounded-full hover:bg-muted"
          >
            <LogOut className="size-[18px]" />
          </button>
        </div>
      </aside>

      <div className="lg:pl-24">
        <header className="sticky top-0 z-20 bg-background/85 px-5 py-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center justify-between gap-4 rounded-full border border-border bg-surface px-3 py-2 shadow-[var(--shadow-card)]">
            <Link to="/" className="flex items-center gap-2.5 pl-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-lime">
                <Gauge className="size-4 text-primary-foreground" />
              </span>
              <span className="text-[15px] font-bold tracking-tight">DevFlow</span>
            </Link>

            <nav className="no-scrollbar hidden items-center gap-1 overflow-x-auto rounded-full bg-muted p-1 md:flex">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    'rounded-full px-4 py-2 text-[13px] font-medium transition-colors',
                    isActive(n.to)
                      ? 'bg-surface-dark text-on-dark'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPaletteOpen(true)}
                title="Search (⌘K)"
                className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <Search className="size-[17px]" />
              </button>
              <button className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted">
                <Bell className="size-[17px]" />
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-danger" />
              </button>
              <div className="ml-1 flex items-center gap-2.5 rounded-full border border-border py-1 pl-1 pr-3.5">
                <span className="flex size-8 items-center justify-center rounded-full bg-surface-dark text-[12px] font-semibold text-on-dark">
                  RM
                </span>
                <div className="hidden leading-tight sm:block">
                  <p className="text-[12px] font-semibold">Rowan Mercer</p>
                  <p className="text-[11px] text-muted-foreground">rowan@devflow.dev</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-5 pb-12 lg:px-8">{children}</main>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-30 flex items-center justify-between rounded-full border border-border bg-surface px-2 py-2 shadow-[var(--shadow-pop)] lg:hidden">
        {RAIL.slice(0, 6).map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            title={label}
            className={cn(
              'flex size-10 items-center justify-center rounded-full',
              isActive(to)
                ? 'bg-surface-dark text-on-dark'
                : 'text-muted-foreground',
            )}
          >
            <Icon className="size-[18px]" />
          </Link>
        ))}
      </nav>
    </div>
  );
}
