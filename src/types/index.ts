export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type ProjectStage =
  | 'lead'
  | 'discovery'
  | 'proposal'
  | 'negotiation'
  | 'development'
  | 'review'
  | 'deployment'
  | 'handover'
  | 'archived';

export interface TechStack {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  hosting?: string;
  other?: string[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  stage: ProjectStage;
  clientId: string;
  client?: Client;
  techStack?: TechStack;
  githubRepo?: string;
  deploymentUrl?: string;
  apiDocsUrl?: string;
  hostingProvider?: string;
  budget?: number;
  currency?: string;
  startDate?: string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineColumn {
  id: ProjectStage;
  title: string;
  projects: Project[];
}

export const PIPELINE_STAGES: { id: ProjectStage; title: string }[] = [
  { id: 'lead', title: 'Lead' },
  { id: 'discovery', title: 'Discovery' },
  { id: 'proposal', title: 'Proposal' },
  { id: 'negotiation', title: 'Negotiation' },
  { id: 'development', title: 'Development' },
  { id: 'review', title: 'Review' },
  { id: 'deployment', title: 'Deployment' },
  { id: 'handover', title: 'Handover' },
  { id: 'archived', title: 'Archived' },
];

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
