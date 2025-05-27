import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('🔥 API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
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

// API Functions
export const routesApi = {
  // Get all routes
  async getRoutes(userId?: string, page = 1, limit = 50): Promise<{ success: boolean; data: Route[] }> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await api.get(`/api/routes?${params}`);
    return response.data;
  },

  // Get single route
  async getRoute(id: string): Promise<{ success: boolean; data: Route }> {
    const response = await api.get(`/api/routes/${id}`);
    return response.data;
  },

  // Create route
  async createRoute(payload: CreateRoutePayload): Promise<{ success: boolean; data: Route; message: string }> {
    const response = await api.post('/api/routes', payload);
    return response.data;
  },

  // Delete route
  async deleteRoute(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/api/routes/${id}`);
    return response.data;
  },

  // Get route logs
  async getRouteLogs(id: string, page = 1, limit = 100): Promise<{ success: boolean; data: RouteLog[] }> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await api.get(`/api/routes/${id}/logs?${params}`);
    return response.data;
  },

  // Test webhook endpoint
  async testWebhook(routeId: string, payload: any): Promise<any> {
    const response = await api.post(`/api/trigger/${routeId}`, payload);
    return response.data;
  },

  // Health check
  async healthCheck(): Promise<{ status: string; service: string; database: string }> {
    const response = await api.get('/api/health');
    return response.data;
  },
};

export default api;
