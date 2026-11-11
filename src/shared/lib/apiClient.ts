/**
 * AssessIQ Enterprise API Client
 * Unified HTTP client supporting JWT auth headers, server-side pagination,
 * sorting, filtering, searching, and error status code handling.
 */

export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: Record<string, any>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    try {
      const storage = localStorage.getItem('examifypro_auth_storage');
      if (storage) {
        const parsed = JSON.parse(storage);
        const token = parsed?.state?.accessToken;
        if (token) {
          return { Authorization: `Bearer ${token}` };
        }
      }
    } catch {
      // Ignore storage parse errors
    }
    return {};
  }

  public async get<T>(endpoint: string, params?: QueryParams): Promise<T> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.pageSize) query.append('pageSize', String(params.pageSize));
    if (params?.search) query.append('search', params.search);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder);
    if (params?.filter) {
      Object.entries(params.filter).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          query.append(`filter_${k}`, String(v));
        }
      });
    }

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const url = `${API_BASE_URL}${endpoint}${queryString}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      const error: ApiError = {
        status: res.status,
        message: errorJson.message || `API Error (${res.status})`,
        details: errorJson,
      };
      throw error;
    }

    return await res.json();
  }

  public async post<T>(endpoint: string, body?: any): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(body || {}),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      const error: ApiError = {
        status: res.status,
        message: errorJson.message || `API Error (${res.status})`,
        details: errorJson,
      };
      throw error;
    }

    return await res.json();
  }

  public async put<T>(endpoint: string, body?: any): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(body || {}),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      const error: ApiError = {
        status: res.status,
        message: errorJson.message || `API Error (${res.status})`,
        details: errorJson,
      };
      throw error;
    }

    return await res.json();
  }

  public async delete<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      const error: ApiError = {
        status: res.status,
        message: errorJson.message || `API Error (${res.status})`,
        details: errorJson,
      };
      throw error;
    }

    return await res.json();
  }
}

export const apiClient = new ApiClient();
