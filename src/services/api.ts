// API Client Layer configured for Django REST Framework or Mock fallback

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface ApiResponse<T> {
  data: T | null;
  error?: string;
  status: number;
}

class ApiService {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem('mamanest_auth_token');
  }

  private getHeaders(customHeaders: Record<string, string> = {}): HeadersInit {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...customHeaders,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    // When no backend server is reachable, services gracefully use local/mock storage
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (err: any) {
      return { data: null, error: err?.message || 'Network request failed', status: 0 };
    }
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (err: any) {
      return { data: null, error: err?.message || 'Network request failed', status: 0 };
    }
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (err: any) {
      return { data: null, error: err?.message || 'Network request failed', status: 0 };
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      const data = response.status === 204 ? null : await response.json();
      return { data, status: response.status };
    } catch (err: any) {
      return { data: null, error: err?.message || 'Network request failed', status: 0 };
    }
  }
}

export const apiService = new ApiService();
