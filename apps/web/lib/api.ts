const API_BASE = '/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    const token = getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    if (!path || typeof path !== 'string') {
      throw new Error('Invalid request path');
    }

    const cleanPath = String(path).replace(/undefined|\[object Object\]/g, '');
    if (!cleanPath || !cleanPath.startsWith('/')) {
      throw new Error('Invalid request path');
    }

    const url = `${API_BASE}${cleanPath}`;
    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    const text = await res.text();
    let body;
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      body = { message: text || `HTTP ${res.status}` };
    }

    if (!res.ok) {
      throw new Error(body.message || body.error || `HTTP ${res.status}`);
    }

    return body as T;
  } catch (e: any) {
    if (e.message.includes('Invalid request') || e.message.includes('HTTP')) {
      throw e;
    }
    console.error('Request error:', e);
    throw new Error(e.message || 'Request failed');
  }
}

export const api = {
  auth: {
    login: (data: { username: string; password: string }) =>
      request<{ accessToken: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    me: () => request<any>('/auth/me'),
  },

  users: {
    list: (params?: { page?: number; limit?: number; role?: string }) => {
      const qs = new URLSearchParams();
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      if (params?.role) qs.set('role', params.role);
      return request<{ data: any[]; meta: any }>(`/users?${qs}`);
    },
    get: (id: string) => request<any>(`/users/${id}`),
    create: (data: any) => request<any>('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: string) => request<void>(`/users/${id}`, { method: 'DELETE' }),
    getStats: () => request<any>('/users/stats'),
    updateProfile: (data: any) => request<any>('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
    updatePassword: (data: any) => request<any>('/users/password', { method: 'PUT', body: JSON.stringify(data) }),
  },

  roles: {
    list: () => request<any[]>('/roles'),
    get: (id: string) => request<any>(`/roles/${id}`),
    create: (data: any) => request<any>('/roles', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: string) => request<void>(`/roles/${id}`, { method: 'DELETE' }),
  },

  partners: {
    list: (params?: { page?: number; limit?: number; status?: string }) => {
      const qs = new URLSearchParams();
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      if (params?.status) qs.set('status', params.status);
      return request<{ data: any[]; meta: any }>(`/partners?${qs}`);
    },
    get: (id: string) => request<any>(`/partners/${id}`),
    create: (data: any) => request<any>('/partners', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/partners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: string) => request<void>(`/partners/${id}`, { method: 'DELETE' }),
    softDelete: (id: string) => request<void>(`/partners/${id}/soft-delete`, { method: 'POST' }),
    getStats: () => request<any>('/partners/stats'),
    updateStatus: (id: string, status: string) => request<any>(`/partners/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },

  developers: {
    list: (params?: { page?: number; limit?: number; search?: string; partnerId?: string; status?: string }) => {
      const qs = new URLSearchParams();
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('pageSize', String(params.limit));
      if (params?.search) qs.set('search', params.search);
      if (params?.partnerId) qs.set('partnerId', params.partnerId);
      if (params?.status) qs.set('status', params.status);
      return request<{ data: any[]; meta: any }>(`/developers?${qs}`);
    },
    get: (id: string) => request<any>(`/developers/${id}`),
    create: (data: any) => request<any>('/developers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/developers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: string) => request<void>(`/developers/${id}`, { method: 'DELETE' }),
    softDelete: (id: string) => request<void>(`/developers/${id}/soft-delete`, { method: 'POST' }),
    getStats: () => request<any>('/developers/stats'),
    getAllSkills: () => request<any[]>('/developers/skills'),
    addSkill: (id: string, data: any) => request<any>(`/developers/${id}/skills`, { method: 'POST', body: JSON.stringify(data) }),
    removeSkill: (id: string, skillId: string) => request<void>(`/developers/${id}/skills/${skillId}`, { method: 'DELETE' }),
    addExperience: (id: string, data: any) => request<any>(`/developers/${id}/experiences`, { method: 'POST', body: JSON.stringify(data) }),
    addCertificate: (id: string, data: any) => request<any>(`/developers/${id}/certificates`, { method: 'POST', body: JSON.stringify(data) }),
  },

  tasks: {
    list: (params?: { page?: number; limit?: number; partnerId?: string; status?: string }) => {
      const qs = new URLSearchParams();
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      if (params?.partnerId) qs.set('partnerId', params.partnerId);
      if (params?.status) qs.set('status', params.status);
      return request<{ data: any[]; meta: any }>(`/tasks?${qs}`);
    },
    get: (id: string) => request<any>(`/tasks/${id}`),
    create: (data: any) => request<any>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: string) => request<void>(`/tasks/${id}`, { method: 'DELETE' }),
    softDelete: (id: string) => request<void>(`/tasks/${id}/soft-delete`, { method: 'POST' }),
    getStats: () => request<any>('/tasks/stats'),
    assignDeveloper: (id: string, data: any) => request<any>(`/tasks/${id}/assignments`, { method: 'POST', body: JSON.stringify(data) }),
    updateProgress: (id: string, data: any) => request<any>(`/tasks/${id}/progress`, { method: 'POST', body: JSON.stringify(data) }),
    submitDeliverable: (id: string, data: any) => request<any>(`/tasks/${id}/deliverables`, { method: 'POST', body: JSON.stringify(data) }),
    submitForApproval: (id: string) => request<any>(`/tasks/${id}/submit`, { method: 'POST' }),
    getProgress: (id: string) => request<any[]>(`/tasks/${id}/progress`),
    getDeliverables: (id: string) => request<any[]>(`/tasks/${id}/deliverables`),
    getDelayRequests: (id: string) => request<any[]>(`/tasks/${id}/delay-requests`),
    createDelayRequest: (id: string, data: any) => request<any>(`/tasks/${id}/delay-requests`, { method: 'POST', body: JSON.stringify(data) }),
  },

  assessments: {
    listPlans: (params?: { page?: number; limit?: number; status?: string }) => {
      const qs = new URLSearchParams();
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      if (params?.status) qs.set('status', params.status);
      return request<{ data: any[]; meta: any }>(`/assessment/plans?${qs}`);
    },
    listAssessments: (params?: { page?: number; limit?: number; planId?: string; partnerId?: string; status?: string }) => {
      const qs = new URLSearchParams();
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      if (params?.planId) qs.set('planId', params.planId);
      if (params?.partnerId) qs.set('partnerId', params.partnerId);
      if (params?.status) qs.set('status', params.status);
      return request<{ data: any[]; meta: any }>(`/assessment/assessments?${qs}`);
    },
    getPlan: (id: string) => request<any>(`/assessment/plans/${id}`),
    createPlan: (data: any) => request<any>('/assessment/plans', { method: 'POST', body: JSON.stringify(data) }),
    updatePlan: (id: string, data: any) => request<any>(`/assessment/plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    removePlan: (id: string) => request<void>(`/assessment/plans/${id}`, { method: 'DELETE' }),
    listIndicators: (parentId?: string) => {
      const qs = parentId ? `?parentId=${parentId}` : '';
      return request<any[]>(`/assessment/indicators${qs}`);
    },
    createIndicator: (data: any) => request<any>('/assessment/indicators', { method: 'POST', body: JSON.stringify(data) }),
    updateIndicator: (id: string, data: any) => request<any>(`/assessment/indicators/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    removeIndicator: (id: string) => request<void>(`/assessment/indicators/${id}`, { method: 'DELETE' }),
    getAssessment: (id: string) => request<any>(`/assessment/assessments/${id}`),
    createAssessment: (data: any) => request<any>('/assessment/assessments', { method: 'POST', body: JSON.stringify(data) }),
    scoreIndicator: (id: string, data: any) => request<any>(`/assessment/assessments/${id}/score`, { method: 'POST', body: JSON.stringify(data) }),
    completeAssessment: (id: string) => request<any>(`/assessment/assessments/${id}/complete`, { method: 'POST' }),
    generateReport: (id: string) => request<any>(`/assessment/assessments/${id}/report`, { method: 'POST' }),
    getStats: () => request<any>('/assessment/stats'),
  },

  improvements: {
    listRequirements: (params?: { page?: number; limit?: number; status?: string }) => {
      const qs = new URLSearchParams();
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      if (params?.status) qs.set('status', params.status);
      return request<{ data: any[]; meta: any }>(`/improvements/requirements?${qs}`);
    },
    getRequirement: (id: string) => request<any>(`/improvements/requirements/${id}`),
    createRequirement: (data: any) => request<any>('/improvements/requirements', { method: 'POST', body: JSON.stringify(data) }),
    updateRequirement: (id: string, data: any) => request<any>(`/improvements/requirements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    removeRequirement: (id: string) => request<void>(`/improvements/requirements/${id}`, { method: 'DELETE' }),
    softDeleteRequirement: (id: string) => request<void>(`/improvements/requirements/${id}/soft-delete`, { method: 'POST' }),
    getPlan: (id: string) => request<any>(`/improvements/plans/${id}`),
    createPlan: (data: any) => request<any>('/improvements/plans', { method: 'POST', body: JSON.stringify(data) }),
    updatePlan: (id: string, data: any) => request<any>(`/improvements/plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updateProgress: (id: string, data: any) => request<any>(`/improvements/plans/${id}/progress`, { method: 'POST', body: JSON.stringify(data) }),
    acceptPlan: (id: string, data: any) => request<any>(`/improvements/plans/${id}/accept`, { method: 'POST', body: JSON.stringify(data) }),
    submitForApproval: (id: string) => request<any>(`/improvements/plans/${id}/submit`, { method: 'POST' }),
    getProgress: (id: string) => request<any[]>(`/improvements/plans/${id}/progress`),
    getApprovals: (id: string) => request<any[]>(`/improvements/plans/${id}/approvals`),
    approve: (approvalId: string, data?: any) => request<any>(`/improvements/plans/approvals/${approvalId}/approve`, { method: 'POST', body: JSON.stringify(data || {}) }),
    reject: (approvalId: string, data: any) => request<any>(`/improvements/plans/approvals/${approvalId}/reject`, { method: 'POST', body: JSON.stringify(data) }),
    getStats: () => request<any>('/improvements/stats'),
  },

  risks: {
    listTypes: () => request<any[]>('/risks/types'),
    createType: (data: any) => request<any>('/risks/types', { method: 'POST', body: JSON.stringify(data) }),
    updateType: (id: string, data: any) => request<any>(`/risks/types/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    removeType: (id: string) => request<void>(`/risks/types/${id}`, { method: 'DELETE' }),
    list: (params?: { page?: number; limit?: number; typeId?: string; level?: string }) => {
      const qs = new URLSearchParams();
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      if (params?.typeId) qs.set('typeId', params.typeId);
      if (params?.level) qs.set('level', params.level);
      return request<{ data: any[]; meta: any }>(`/risks?${qs}`);
    },
    get: (id: string) => request<any>(`/risks/${id}`),
    create: (data: any) => request<any>('/risks', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/risks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: string) => request<void>(`/risks/${id}`, { method: 'DELETE' }),
    getStats: () => request<any>('/risks/stats'),
  },

  attachments: {
    upload: async (file: File) => {
      const token = getToken();
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/attachments/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    },
    download: (id: string) => `${API_BASE}/attachments/${id}/download`,
  },

  importExport: {
    export: (resource: string, format: 'excel' | 'csv' = 'excel') => {
      const token = getToken();
      return `${API_BASE}/import-export/export?resource=${resource}&format=${format}${token ? `&token=${token}` : ''}`;
    },
    import: async (resource: string, file: File) => {
      const token = getToken();
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/import-export/import?resource=${resource}`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error('Import failed');
      return res.json();
    },
  },
};

export default api;
