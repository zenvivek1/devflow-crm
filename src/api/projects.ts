import apiClient from './client';
import type { Project, PaginatedResponse } from '@/types';

export const projectsApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<Project>>('/projects', { params }),

  getById: (id: string) => apiClient.get<Project>(`/projects/${id}`),

  create: (data: Partial<Project>) => apiClient.post<Project>('/projects', data),

  update: (id: string, data: Partial<Project>) =>
    apiClient.patch<Project>(`/projects/${id}`, data),

  updateStage: (id: string, stage: string) =>
    apiClient.patch<Project>(`/projects/${id}/stage`, { stage }),

  delete: (id: string) => apiClient.delete(`/projects/${id}`),
};
