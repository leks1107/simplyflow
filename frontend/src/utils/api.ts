/**
 * Universal API utilities for SimpFlow Frontend
 * Handles environment-based API URL configuration
 */

// Helper function to get API URL
export const getApiUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.warn('⚠️ NEXT_PUBLIC_API_URL not set, falling back to localhost:3000');
    return 'http://localhost:3000';
  }
  console.log(`🔗 Using API URL: ${apiUrl}`);
  return apiUrl;
};

// Helper function to build full API endpoint
export const buildApiEndpoint = (path: string): string => {
  const baseUrl = getApiUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}/api${cleanPath}`;
};

// Error handling helper
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// API request wrapper with error handling
export const makeApiRequest = async <T>(
  requestFn: () => Promise<T>
): Promise<T> => {
  try {
    return await requestFn();
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error('🔥 API Request failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

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
    credentials: Record<string, any>;
    duplicate_check_field?: string;
    required_fields: string[];
  };
}

export interface Filter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value?: any;
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

// Fetch-based API functions (no external dependencies)
export const api = {
  // Get all routes
  async getRoutes(): Promise<Route[]> {
    return makeApiRequest(async () => {
      const response = await fetch(buildApiEndpoint('/routes'));
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data: ApiResponse<Route[]> = await response.json();
      return data.data || [];
    });
  },

  // Create new route
  async createRoute(payload: CreateRoutePayload): Promise<Route> {
    return makeApiRequest(async () => {
      const response = await fetch(buildApiEndpoint('/routes'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      const data: ApiResponse<Route> = await response.json();
      return data.data!;
    });
  },

  // Delete route
  async deleteRoute(routeId: string): Promise<void> {
    return makeApiRequest(async () => {
      const response = await fetch(buildApiEndpoint(`/routes/${routeId}`), {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    });
  },

  // Get route logs
  async getRouteLogs(routeId: string): Promise<RouteLog[]> {
    return makeApiRequest(async () => {
      const response = await fetch(buildApiEndpoint(`/routes/${routeId}/logs`));
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data: ApiResponse<RouteLog[]> = await response.json();
      return data.data || [];
    });
  },

  // Test webhook
  async testWebhook(routeId: string, payload: any): Promise<any> {
    return makeApiRequest(async () => {
      const response = await fetch(buildApiEndpoint(`/trigger/${routeId}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    });
  },

  // Health check
  async healthCheck(): Promise<{ status: string; service: string; database: string }> {
    return makeApiRequest(async () => {
      const response = await fetch(buildApiEndpoint('/health'));
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    });
  },
};