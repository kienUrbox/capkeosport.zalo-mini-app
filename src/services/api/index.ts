import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.capkeosport.com/api/v1';

// Import centralized types
import { ApiResponse } from '@/types/api.types';

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
    // Add auth token if available
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    // config.headers['X-Request-ID'] = generateRequestId();

    // Add client version
    // config.headers['X-Client-Version'] = '1.0.0';

    // Add platform info
    // config.headers['X-Platform'] = 'zalo_mini_app';

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasAuth: !!token,
        requestId: config.headers['X-Request-ID']
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Helper function to generate request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

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
        requestId: response.config.headers['X-Request-ID'],
        duration: Date.now() - parseInt(response.config.headers['X-Request-ID']?.split('_')[1] || '0')
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
        requestId: originalRequest?.headers?.['X-Request-ID'],
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

      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        // No refresh token, logout and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
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
          const newTokens = response.data.data;

          // Save new tokens
          localStorage.setItem('access_token', newTokens.accessToken);
          if (newTokens.refreshToken) {
            localStorage.setItem('refresh_token', newTokens.refreshToken);
          }

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
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
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