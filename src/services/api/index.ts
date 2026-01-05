import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.capkeosport.com/api/v1';

// Import centralized types
import { ApiResponse, User, AuthTokens } from '@/types/api.types';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get token from zustand storage
const getAccessToken = (): string | null => {
  // Read from zustand persist storage
  try {
    const zustandStorage = localStorage.getItem('auth-storage');
    console.log({zustandStorage});
    
    if (zustandStorage) {
      const parsed = JSON.parse(zustandStorage);
      const token = parsed?.state?.tokens?.accessToken;
      if (token) return token;
    }
  } catch (e) {
    console.warn('Failed to read token from zustand storage:', e);
  }

  return null;
};

// Helper to get refresh token from zustand storage
const getRefreshToken = (): string | null => {
  try {
    const zustandStorage = localStorage.getItem('auth-storage');
    if (zustandStorage) {
      const parsed = JSON.parse(zustandStorage);
      const token = parsed?.state?.tokens?.refreshToken;
      if (token) return token;
    }
  } catch (e) {
    console.warn('Failed to read refresh token from zustand storage:', e);
  }

  return null;
};

// Helper to update tokens and user in zustand storage
const updateTokens = (newTokens: AuthTokens, newUser?: User): void => {
  try {
    const zustandStorage = localStorage.getItem('auth-storage');
    if (zustandStorage) {
      const parsed = JSON.parse(zustandStorage);
      parsed.state.tokens = newTokens;
      if (newUser) {
        parsed.state.user = newUser;
      }
      localStorage.setItem('auth-storage', JSON.stringify(parsed));
    }
  } catch (e) {
    console.warn('Failed to update zustand storage:', e);
  }
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token from zustand persist storage
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasAuth: !!token,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: any[] = [];

// Process failed queue
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        method: response.config.method?.toUpperCase(),
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: originalRequest?.url,
        method: originalRequest?.method?.toUpperCase(),
        message: error.response?.data?.message || error.message
      });
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error);
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - Token expired
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, add request to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Get refresh token from zustand storage
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        // No refresh token, logout and redirect to login
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh token
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.success && response.data.data) {
          // Response structure: { success: true, data: { user, tokens } }
          const { user, tokens: newTokens } = response.data.data;

          // Update zustand storage with both user and tokens
          updateTokens(newTokens);

          // Update original request with new token
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;

          // Process queued requests
          processQueue(null, newTokens.accessToken);

          // Retry original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout and redirect
        processQueue(refreshError, null);
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 403 Forbidden
    if (error.response.status === 403) {
      console.error('Access forbidden:', error);
      // Could show a toast or notification here
      return Promise.reject(error);
    }

    // Handle 429 Too Many Requests
    if (error.response.status === 429) {
      console.warn('Rate limit exceeded:', error);
      // Could implement retry logic here
      return Promise.reject(error);
    }

    // Handle 5xx Server Errors
    if (error.response.status >= 500) {
      console.error('Server error:', error);
      // Could implement retry logic or show server error message
      return Promise.reject(error);
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