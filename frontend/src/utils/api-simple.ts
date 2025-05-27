// This is a TypeScript module
export {}; // This line makes this file a module

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
  name: string;
  description?: string;
  source: string;
  target: string;
  webhook_url: string;
  enabled: boolean;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  config: {
    filters: Filter[];
    required_fields: string[];
    duplicate_check_field?: string;
    credentials?: Record<string, any>; // Added this line
    source_config?: Record<string, any>; // Added for source configuration
    target_config?: Record<string, any>; // Added for target configuration
  };
}

export interface Filter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value?: string;
}

export interface RouteLog {
  id: string;
  route_id: string;
  timestamp: string;
  status: 'success' | 'error' | 'filtered' | 'duplicate' | 'rate_limited';
  processing_time_ms: number;
  request: any;
  response?: any;
  error?: string;
  error_message?: string;
  raw_request?: any;
  processed_data?: any;
}

export interface CreateRoutePayload {
  name: string;
  description?: string;
  source: {
    type: string;
    config: any;
  };
  target: {
    type: string;
    config: any;
  };
  filters: Filter[];
  enabled: boolean;
}

// API Functions
export async function getRoutes(): Promise<Route[]> {
  try {
    const response = await api.get('/api/routes');
    return response.data.routes || [];
  } catch (error) {
    console.error('Failed to fetch routes:', error);
    throw new Error('Failed to fetch routes');
  }
}

export async function createRoute(data: CreateRoutePayload): Promise<Route> {
  try {
    const response = await api.post('/api/routes', data);
    return response.data.route;
  } catch (error: any) {
    console.error('Failed to create route:', error);
    throw new Error(error.response?.data?.error || 'Failed to create route');
  }
}

export async function deleteRoute(routeId: string): Promise<void> {
  try {
    await api.delete(`/api/routes/${routeId}`);
  } catch (error: any) {
    console.error('Failed to delete route:', error);
    throw new Error(error.response?.data?.error || 'Failed to delete route');
  }
}

export async function getRouteLogs(routeId: string): Promise<RouteLog[]> {
  try {
    const response = await api.get(`/api/routes/${routeId}/logs`);
    return response.data.logs || [];
  } catch (error) {
    console.error('Failed to fetch route logs:', error);
    throw new Error('Failed to fetch route logs');
  }
}

export async function testWebhook(routeId: string, payload: any): Promise<any> {
  try {
    const response = await api.post(`/api/trigger/${routeId}`, payload);
    return response.data;
  } catch (error: any) {
    console.error('Failed to test webhook:', error);
    throw new Error(error.response?.data?.error || 'Failed to test webhook');
  }
}
