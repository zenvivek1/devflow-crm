import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  seedActivity,
  seedClients,
  seedDocs,
  seedNotes,
  seedProjects,
  seedTasks,
  type Activity,
  type Client,
  type Doc,
  type Note,
  type Project,
  type ProjectStage,
  type Task,
} from './devflow-types';

const uid = () => Math.random().toString(36).slice(2, 10);

interface StoreValue {
  clients: Client[];
  projects: Project[];
  docs: Doc[];
  tasks: Task[];
  notes: Note[];
  activity: Activity[];
  addClient: (c: Omit<Client, 'id'>) => void;
  addProject: (p: Omit<Project, 'id' | 'progress'>) => void;
  addDoc: (d: Omit<Doc, 'id' | 'createdAt'>) => void;
  addTask: (t: Omit<Task, 'id' | 'done'>) => void;
  addNote: (n: Omit<Note, 'id' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  setStage: (projectId: string, stage: ProjectStage) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function DevFlowProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(seedClients);
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [docs, setDocs] = useState<Doc[]>(seedDocs);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [notes, setNotes] = useState<Note[]>(seedNotes);
  const [activity, setActivity] = useState<Activity[]>(seedActivity);

  const log = useCallback(
    (action: string, meta: Record<string, string>, ids: Partial<Activity> = {}) => {
      setActivity((prev) => [
        { id: uid(), action, meta, createdAt: new Date().toISOString(), ...ids },
        ...prev,
      ]);
    },
    [],
  );

  const value = useMemo<StoreValue>(
    () => ({
      clients,
      projects,
      docs,
      tasks,
      notes,
      activity,
      addClient: (c) => {
        const id = uid();
        setClients((prev) => [{ ...c, id }, ...prev]);
        log('client.created', { client: c.companyName }, { clientId: id });
      },
      addProject: (p) => {
        const id = uid();
        setProjects((prev) => [{ ...p, id, progress: 5 }, ...prev]);
        log('project.created', { project: p.name }, { projectId: id, clientId: p.clientId });
      },
      addDoc: (d) => {
        setDocs((prev) => [{ ...d, id: uid(), createdAt: new Date().toISOString() }, ...prev]);
        log('document.created', { doc: d.fileName }, { projectId: d.projectId });
      },
      addTask: (t) => {
        setTasks((prev) => [{ ...t, id: uid(), done: false }, ...prev]);
        log('task.created', { task: t.title }, { projectId: t.projectId, clientId: t.clientId });
      },
      addNote: (n) => {
        setNotes((prev) => [
          { ...n, id: uid(), createdAt: new Date().toISOString() },
          ...prev,
        ]);
        log('note.added', { note: n.content.slice(0, 40) }, { clientId: n.clientId, projectId: n.projectId });
      },
      toggleTask: (id) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
        const t = tasks.find((x) => x.id === id);
        if (t && !t.done) log('task.completed', { task: t.title }, { projectId: t.projectId });
      },
      setStage: (projectId, stage) => {
        const p = projects.find((x) => x.id === projectId);
        setProjects((prev) =>
          prev.map((x) => (x.id === projectId ? { ...x, stage } : x)),
        );
        if (p) log('project.stage_changed', { from: p.stage, to: stage }, { projectId, clientId: p.clientId });
      },
    }),
    [clients, projects, docs, tasks, notes, activity, log],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useDevFlow() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useDevFlow must be used inside DevFlowProvider');
  return ctx;
}
