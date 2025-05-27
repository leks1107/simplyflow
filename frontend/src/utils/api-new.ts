import axios, { AxiosResponse, AxiosError } from 'axios';

// Helper function to get API URL
export const getApiUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.warn('⚠️ NEXT_PUBLIC_API_URL not set, falling back to localhost:3000');
    return 'http://localhost:3000';
  }
  return apiUrl;
};

const BASE_URL = getApiUrl();

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error('🔥 API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('🔥 API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Types
export interface Route {
  id: string;
  user_id: string;
  name: string;
  source: 'typeform' | 'tally' | 'paperform';
  target: 'sheets' | 'notion' | 'digest';
  webhook_url: string;
  is_active: boolean;
  status: 'active' | 'inactive';
  enabled: boolean;
  created_at: string;
  updated_at: string;
  config: {
    filters: Filter[];
    credentials: Record<string, any>;
    duplicate_check_field?: string;
    required_fields: string[];
  };
}

export interface Filter {
  field: string;
  op: string;
  value?: any;
}

export interface RouteLog {
  id: string;
  route_id: string;
  raw_request: any;
  processed_data: any;
  status: 'success' | 'error' | 'filtered' | 'duplicate' | 'rate_limited' | 'skipped';
  error_message?: string;
  processing_time_ms: number;
  timestamp: string;
}

export interface CreateRoutePayload {
  name: string;
  source: string;
  target: string;
  filters?: Filter[];
  credentials: Record<string, any>;
  duplicateCheckField?: string;
  requiredFields?: string[];
}

// Individual API Functions (for easier importing)
export const getRoutes = async (userId?: string, page = 1, limit = 50): Promise<Route[]> => {
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  const response = await apiClient.get(`/api/routes?${params.toString()}`);
  return response.data?.data || [];
};

export const createRoute = async (routeData: CreateRoutePayload): Promise<Route> => {
  const response = await apiClient.post('/api/routes', routeData);
  return response.data?.data;
};

export const deleteRoute = async (routeId: string): Promise<void> => {
  await apiClient.delete(`/api/routes/${routeId}`);
};

export const getRouteLogs = async (routeId: string, page = 1, limit = 50): Promise<RouteLog[]> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  const response = await apiClient.get(`/api/routes/${routeId}/logs?${params.toString()}`);
  return response.data?.data || [];
};

export const testWebhook = async (routeId: string, testData?: any): Promise<any> => {
  const response = await apiClient.post(`/api/trigger/${routeId}`, { data: testData });
  return response.data;
};

// Grouped API object (for backward compatibility)
export const routesApi = {
  getRoutes,
  createRoute,
  deleteRoute,
  getRouteLogs,
  testWebhook,
  
  // Get single route
  async getRoute(id: string): Promise<Route> {
    const response = await apiClient.get(`/api/routes/${id}`);
    return response.data?.data;
  },

  // Health check
  async healthCheck(): Promise<{ status: string; service: string; database: string }> {
    const response = await apiClient.get('/api/health');
    return response.data;
  },
};

export default apiClient;
