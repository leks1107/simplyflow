// This is a TypeScript module
export {}; // This line makes this file a module

import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export interface Route {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  source: 'typeform' | 'tally' | 'paperform';
  target: 'sheets' | 'notion' | 'digest';
  webhook_url: string;
  is_active: boolean;
  status: 'active' | 'inactive';
  enabled: boolean;
  created_at: string;
  updated_at: string;
  filters?: Filter[];
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

export const getRoutes = async (): Promise<Route[]> => {
  try {
    const response = await apiClient.get('/api/routes');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching routes:', error);
    return [];
  }
};

export const createRoute = async (routeData: CreateRoutePayload): Promise<Route> => {
  const response = await apiClient.post('/api/routes', routeData);
  return response.data?.data;
};

export const deleteRoute = async (routeId: string): Promise<void> => {
  await apiClient.delete(`/api/routes/${routeId}`);
};

export const getRouteLogs = async (routeId: string): Promise<RouteLog[]> => {
  try {
    const response = await apiClient.get(`/api/routes/${routeId}/logs`);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching route logs:', error);
    return [];
  }
};

export const testWebhook = async (routeId: string, testData?: any): Promise<any> => {
  const response = await apiClient.post(`/api/trigger/${routeId}`, { data: testData });
  return response.data;
};
