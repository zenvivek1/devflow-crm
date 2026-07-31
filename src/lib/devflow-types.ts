export type ProjectStage =
  | 'client_inquiry'
  | 'requirement_discussion'
  | 'proposal'
  | 'contract'
  | 'development'
  | 'testing'
  | 'deployment'
  | 'payment'
  | 'maintenance';

export type ClientSource =
  | 'referral'
  | 'upwork'
  | 'linkedin'
  | 'cold_outreach'
  | 'personal_network'
  | 'other';

export type ProjectType = 'fixed_price' | 'hourly' | 'retainer';
export type Priority = 'low' | 'medium' | 'high';
export type DocumentType = 'proposal' | 'contract' | 'nda' | 'requirement_doc' | 'invoice';
export type DocumentStatus = 'draft' | 'sent' | 'signed' | 'paid' | 'overdue';
export type Currency = 'USD' | 'EUR' | 'INR';

export interface Client {
  id: string;
  name: string;
  companyName: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  country: string;
  timezone: string;
  source: ClientSource;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  techStack: string;
  githubRepoUrl: string;
  stagingUrl: string;
  productionUrl: string;
  apiDocsUrl: string;
  hostingProvider: string;
  stage: ProjectStage;
  budget: number;
  currency: Currency;
  projectType: ProjectType;
  priority: Priority;
  deadline: string;
  nextMeetingAt: string;
  progress: number;
}

export interface Doc {
  id: string;
  projectId: string;
  type: DocumentType;
  status: DocumentStatus;
  url: string;
  fileName: string;
  amount?: number;
  createdAt: string;
}

export interface Task {
  id: string;
  clientId?: string;
  projectId?: string;
  title: string;
  dueDate: string;
  done: boolean;
}

export interface Note {
  id: string;
  clientId?: string;
  projectId?: string;
  content: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  clientId?: string;
  projectId?: string;
  action: string;
  meta: Record<string, string>;
  createdAt: string;
}

export const STAGES: { key: ProjectStage; label: string }[] = [
  { key: 'client_inquiry', label: 'Client Inquiry' },
  { key: 'requirement_discussion', label: 'Requirements' },
  { key: 'proposal', label: 'Proposal' },
  { key: 'contract', label: 'Contract' },
  { key: 'development', label: 'Development' },
  { key: 'testing', label: 'Testing' },
  { key: 'deployment', label: 'Deployment' },
  { key: 'payment', label: 'Payment' },
  { key: 'maintenance', label: 'Maintenance' },
];

export const stageLabel = (s: ProjectStage) => STAGES.find((x) => x.key === s)?.label ?? s;
export const titleize = (s: string) =>
  s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export const CURRENCY_SYMBOL: Record<Currency, string> = { USD: '$', EUR: '\u20AC', INR: '\u20B9' };

export function money(amount: number, currency: Currency = 'USD') {
  return `${CURRENCY_SYMBOL[currency]}${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

const now = new Date('2026-07-30T12:00:00Z');
const day = (n: number) => new Date(now.getTime() + n * 86400000).toISOString();

export const seedClients: Client[] = [
  {
    id: 'c1',
    name: 'Amara Osei',
    companyName: 'Northlane Labs',
    website: 'northlane.io',
    contactEmail: 'amara@northlane.io',
    contactPhone: '+1 415 555 0132',
    country: 'United States',
    timezone: 'PST (UTC-8)',
    source: 'referral',
  },
  {
    id: 'c2',
    name: 'Lukas Brenner',
    companyName: 'Kiosk Systems GmbH',
    website: 'kiosksystems.de',
    contactEmail: 'lukas@kiosksystems.de',
    contactPhone: '+49 30 5550 118',
    country: 'Germany',
    timezone: 'CET (UTC+1)',
    source: 'linkedin',
  },
  {
    id: 'c3',
    name: 'Priya Raghunathan',
    companyName: 'Tessellate Analytics',
    website: 'tessellate.in',
    contactEmail: 'priya@tessellate.in',
    contactPhone: '+91 80 4455 9021',
    country: 'India',
    timezone: 'IST (UTC+5:30)',
    source: 'upwork',
  },
  {
    id: 'c4',
    name: 'Marco Ferreira',
    companyName: 'Vela Freight',
    website: 'velafreight.com',
    contactEmail: 'marco@velafreight.com',
    contactPhone: '+351 21 555 3390',
    country: 'Portugal',
    timezone: 'WET (UTC+0)',
    source: 'cold_outreach',
  },
  {
    id: 'c5',
    name: 'Hanna Lindqvist',
    companyName: 'Fjord Health',
    website: 'fjordhealth.se',
    contactEmail: 'hanna@fjordhealth.se',
    contactPhone: '+46 8 555 2277',
    country: 'Sweden',
    timezone: 'CET (UTC+1)',
    source: 'personal_network',
  },
  {
    id: 'c6',
    name: 'Diego Salcedo',
    companyName: 'Andina Retail',
    website: 'andinaretail.co',
    contactEmail: 'diego@andinaretail.co',
    contactPhone: '+57 1 555 8890',
    country: 'Colombia',
    timezone: 'COT (UTC-5)',
    source: 'other',
  },
];

export const seedProjects: Project[] = [
  {
    id: 'p1',
    name: 'Northlane Billing Portal',
    clientId: 'c1',
    techStack: 'React, NestJS, Postgres',
    githubRepoUrl: 'github.com/northlane/billing-portal',
    stagingUrl: 'staging.northlane.io',
    productionUrl: 'billing.northlane.io',
    apiDocsUrl: 'api.northlane.io/docs',
    hostingProvider: 'Vercel',
    stage: 'development',
    budget: 48000,
    currency: 'USD',
    projectType: 'fixed_price',
    priority: 'high',
    deadline: day(24),
    nextMeetingAt: day(2),
    progress: 62,
  },
  {
    id: 'p2',
    name: 'Kiosk Fleet Dashboard',
    clientId: 'c2',
    techStack: 'Next.js, tRPC, Prisma',
    githubRepoUrl: 'github.com/kiosksys/fleet-dash',
    stagingUrl: 'dev.kiosksystems.de',
    productionUrl: 'fleet.kiosksystems.de',
    apiDocsUrl: 'fleet.kiosksystems.de/openapi',
    hostingProvider: 'AWS',
    stage: 'testing',
    budget: 31500,
    currency: 'EUR',
    projectType: 'fixed_price',
    priority: 'medium',
    deadline: day(11),
    nextMeetingAt: day(1),
    progress: 78,
  },
  {
    id: 'p3',
    name: 'Tessellate Data Pipeline',
    clientId: 'c3',
    techStack: 'Python, FastAPI, ClickHouse',
    githubRepoUrl: 'github.com/tessellate/pipeline',
    stagingUrl: 'stg.tessellate.in',
    productionUrl: 'app.tessellate.in',
    apiDocsUrl: 'docs.tessellate.in',
    hostingProvider: 'GCP',
    stage: 'deployment',
    budget: 1850000,
    currency: 'INR',
    projectType: 'retainer',
    priority: 'high',
    deadline: day(5),
    nextMeetingAt: day(3),
    progress: 88,
  },
  {
    id: 'p4',
    name: 'Vela Freight Tracker',
    clientId: 'c4',
    techStack: 'Vue, Go, Redis',
    githubRepoUrl: 'github.com/velafreight/tracker',
    stagingUrl: 'staging.velafreight.com',
    productionUrl: 'track.velafreight.com',
    apiDocsUrl: 'track.velafreight.com/api',
    hostingProvider: 'Fly.io',
    stage: 'proposal',
    budget: 22000,
    currency: 'EUR',
    projectType: 'hourly',
    priority: 'low',
    deadline: day(46),
    nextMeetingAt: day(6),
    progress: 12,
  },
  {
    id: 'p5',
    name: 'Fjord Patient Intake',
    clientId: 'c5',
    techStack: 'React Native, Supabase',
    githubRepoUrl: 'github.com/fjordhealth/intake',
    stagingUrl: 'intake-staging.fjordhealth.se',
    productionUrl: 'intake.fjordhealth.se',
    apiDocsUrl: 'intake.fjordhealth.se/docs',
    hostingProvider: 'Supabase',
    stage: 'contract',
    budget: 39000,
    currency: 'EUR',
    projectType: 'fixed_price',
    priority: 'medium',
    deadline: day(60),
    nextMeetingAt: day(4),
    progress: 22,
  },
  {
    id: 'p6',
    name: 'Andina Storefront Revamp',
    clientId: 'c6',
    techStack: 'Astro, Shopify, Tailwind',
    githubRepoUrl: 'github.com/andina/storefront',
    stagingUrl: 'preview.andinaretail.co',
    productionUrl: 'andinaretail.co',
    apiDocsUrl: 'andinaretail.co/api-docs',
    hostingProvider: 'Netlify',
    stage: 'client_inquiry',
    budget: 14500,
    currency: 'USD',
    projectType: 'hourly',
    priority: 'low',
    deadline: day(72),
    nextMeetingAt: day(8),
    progress: 4,
  },
  {
    id: 'p7',
    name: 'Northlane Mobile SDK',
    clientId: 'c1',
    techStack: 'Swift, Kotlin, GraphQL',
    githubRepoUrl: 'github.com/northlane/mobile-sdk',
    stagingUrl: 'sdk-staging.northlane.io',
    productionUrl: 'sdk.northlane.io',
    apiDocsUrl: 'sdk.northlane.io/reference',
    hostingProvider: 'Cloudflare',
    stage: 'requirement_discussion',
    budget: 27000,
    currency: 'USD',
    projectType: 'retainer',
    priority: 'medium',
    deadline: day(38),
    nextMeetingAt: day(5),
    progress: 9,
  },
  {
    id: 'p8',
    name: 'Kiosk Payments Service',
    clientId: 'c2',
    techStack: 'NestJS, Stripe, Postgres',
    githubRepoUrl: 'github.com/kiosksys/payments',
    stagingUrl: 'pay-stg.kiosksystems.de',
    productionUrl: 'pay.kiosksystems.de',
    apiDocsUrl: 'pay.kiosksystems.de/docs',
    hostingProvider: 'AWS',
    stage: 'payment',
    budget: 18800,
    currency: 'EUR',
    projectType: 'fixed_price',
    priority: 'high',
    deadline: day(-3),
    nextMeetingAt: day(2),
    progress: 96,
  },
  {
    id: 'p9',
    name: 'Tessellate Admin Console',
    clientId: 'c3',
    techStack: 'React, Django, Postgres',
    githubRepoUrl: 'github.com/tessellate/admin',
    stagingUrl: 'admin-stg.tessellate.in',
    productionUrl: 'admin.tessellate.in',
    apiDocsUrl: 'admin.tessellate.in/docs',
    hostingProvider: 'GCP',
    stage: 'maintenance',
    budget: 640000,
    currency: 'INR',
    projectType: 'retainer',
    priority: 'low',
    deadline: day(120),
    nextMeetingAt: day(12),
    progress: 100,
  },
];

export const seedDocs: Doc[] = [
  { id: 'd1', projectId: 'p1', type: 'contract', status: 'signed', url: 'https://docs.google.com/document/d/northlane-msa', fileName: 'Northlane_MSA_v3.pdf', createdAt: day(-40) },
  { id: 'd2', projectId: 'p1', type: 'invoice', status: 'paid', url: 'https://invoice.stripe.com/i/nl-0012', fileName: 'INV-0012.pdf', amount: 16000, createdAt: day(-18) },
  { id: 'd3', projectId: 'p1', type: 'invoice', status: 'overdue', url: 'https://invoice.stripe.com/i/nl-0019', fileName: 'INV-0019.pdf', amount: 16000, createdAt: day(-9) },
  { id: 'd4', projectId: 'p2', type: 'requirement_doc', status: 'sent', url: 'https://www.notion.so/kiosk-requirements', fileName: 'Fleet_Requirements.md', createdAt: day(-30) },
  { id: 'd5', projectId: 'p3', type: 'invoice', status: 'sent', url: 'https://invoice.stripe.com/i/ts-0044', fileName: 'INV-0044.pdf', amount: 620000, createdAt: day(-4) },
  { id: 'd6', projectId: 'p4', type: 'proposal', status: 'draft', url: 'https://www.figma.com/deck/vela-proposal', fileName: 'Vela_Proposal.fig', createdAt: day(-2) },
  { id: 'd7', projectId: 'p5', type: 'nda', status: 'signed', url: 'https://app.docusign.com/fjord-nda', fileName: 'Fjord_NDA.pdf', createdAt: day(-14) },
  { id: 'd8', projectId: 'p8', type: 'invoice', status: 'overdue', url: 'https://invoice.stripe.com/i/ks-0031', fileName: 'INV-0031.pdf', amount: 9400, createdAt: day(-21) },
  { id: 'd9', projectId: 'p2', type: 'invoice', status: 'sent', url: 'https://invoice.stripe.com/i/ks-0038', fileName: 'INV-0038.pdf', amount: 12500, createdAt: day(-6) },
  { id: 'd10', projectId: 'p6', type: 'proposal', status: 'sent', url: 'https://docs.google.com/document/d/andina-proposal', fileName: 'Andina_Proposal.pdf', createdAt: day(-1) },
];

export const seedTasks: Task[] = [
  { id: 't1', title: 'Chase overdue invoice INV-0019', projectId: 'p1', clientId: 'c1', dueDate: day(-2), done: false },
  { id: 't2', title: 'Review Kiosk QA regression report', projectId: 'p2', clientId: 'c2', dueDate: day(-1), done: false },
  { id: 't3', title: 'Ship ClickHouse migration to prod', projectId: 'p3', clientId: 'c3', dueDate: day(0), done: false },
  { id: 't4', title: 'Send Vela proposal for review', projectId: 'p4', clientId: 'c4', dueDate: day(0), done: false },
  { id: 't5', title: 'Prep SDK architecture doc', projectId: 'p7', clientId: 'c1', dueDate: day(2), done: false },
  { id: 't6', title: 'Countersign Fjord contract', projectId: 'p5', clientId: 'c5', dueDate: day(3), done: false },
  { id: 't7', title: 'Scope Andina storefront audit', projectId: 'p6', clientId: 'c6', dueDate: day(5), done: false },
  { id: 't8', title: 'Rotate Stripe webhook secret', projectId: 'p8', clientId: 'c2', dueDate: day(-4), done: true },
  { id: 't9', title: 'Archive Q2 retainer reports', projectId: 'p9', clientId: 'c3', dueDate: day(-6), done: true },
];

export const seedNotes: Note[] = [
  { id: 'n1', clientId: 'c1', projectId: 'p1', content: 'Amara wants SSO via Okta before launch. Needs scoping as change order.', createdAt: day(-3) },
  { id: 'n2', clientId: 'c2', projectId: 'p2', content: 'QA team runs regression Tuesdays — schedule releases Wednesday.', createdAt: day(-7) },
  { id: 'n3', clientId: 'c3', projectId: 'p3', content: 'Retainer renews quarterly; Priya handles PO approvals.', createdAt: day(-11) },
];

export const seedActivity: Activity[] = [
  { id: 'a1', projectId: 'p3', clientId: 'c3', action: 'project.stage_changed', meta: { from: 'Testing', to: 'Deployment' }, createdAt: day(-0.1) },
  { id: 'a2', projectId: 'p1', clientId: 'c1', action: 'document.status_updated', meta: { doc: 'INV-0019', to: 'Overdue' }, createdAt: day(-0.3) },
  { id: 'a3', projectId: 'p5', clientId: 'c5', action: 'document.status_updated', meta: { doc: 'Fjord_NDA', to: 'Signed' }, createdAt: day(-1) },
  { id: 'a4', projectId: 'p6', clientId: 'c6', action: 'client.created', meta: { client: 'Andina Retail' }, createdAt: day(-1.4) },
  { id: 'a5', projectId: 'p2', clientId: 'c2', action: 'task.completed', meta: { task: 'Rotate Stripe webhook secret' }, createdAt: day(-2) },
  { id: 'a6', projectId: 'p8', clientId: 'c2', action: 'project.stage_changed', meta: { from: 'Deployment', to: 'Payment' }, createdAt: day(-2.5) },
  { id: 'a7', projectId: 'p4', clientId: 'c4', action: 'document.created', meta: { doc: 'Vela_Proposal.fig' }, createdAt: day(-3) },
  { id: 'a8', projectId: 'p7', clientId: 'c1', action: 'project.created', meta: { project: 'Northlane Mobile SDK' }, createdAt: day(-4) },
  { id: 'a9', projectId: 'p1', clientId: 'c1', action: 'note.added', meta: { note: 'Okta SSO change order' }, createdAt: day(-5) },
];

export const throughput = [
  { month: 'Jan', paid: 22, pending: 9 },
  { month: 'Feb', paid: 31, pending: 12 },
  { month: 'Mar', paid: 26, pending: 18 },
  { month: 'Apr', paid: 38, pending: 14 },
  { month: 'May', paid: 44, pending: 21 },
  { month: 'Jun', paid: 35, pending: 11 },
  { month: 'Jul', paid: 48, pending: 16 },
  { month: 'Aug', paid: 29, pending: 8 },
];
