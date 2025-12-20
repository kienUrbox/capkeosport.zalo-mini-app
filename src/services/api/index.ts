import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
export const API_BASE_URL = 'https://capkeosportnestjs-production.up.railway.app/api/v1';

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string[];
  };
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Redirect to login or trigger re-authentication
      window.location.href = '/login';
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error);
    }

    return Promise.reject(error);
  }
);

// Generic API request wrapper
export const apiRequest = async <T = any>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.request<ApiResponse<T>>(config);
    return response.data;
  } catch (error: any) {
    // Return standardized error response
    const errorResponse: ApiResponse<T> = {
      success: false,
      error: {
        code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
        message: error.response?.data?.error?.message || error.message || 'An unknown error occurred',
        details: error.response?.data?.error?.details || [],
      },
      timestamp: new Date().toISOString(),
    };

    throw errorResponse;
  }
};

// HTTP Methods helpers
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ method: 'GET', url, ...config }),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>({ method: 'POST', url, data, ...config }),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>({ method: 'PUT', url, data, ...config }),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>({ method: 'PATCH', url, data, ...config }),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ method: 'DELETE', url, ...config }),
};

// File upload helper
export const uploadFile = async (
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post<ApiResponse>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ApiResponse = {
      success: false,
      error: {
        code: error.response?.data?.error?.code || 'UPLOAD_ERROR',
        message: error.response?.data?.error?.message || error.message || 'Upload failed',
        details: error.response?.data?.error?.details || [],
      },
      timestamp: new Date().toISOString(),
    };

    throw errorResponse;
  }
};

export default apiClient;