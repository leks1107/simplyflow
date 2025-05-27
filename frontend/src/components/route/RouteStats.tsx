import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { RouteLog } from '@/utils/api-simple';
import { formatDate, getStatusColor } from '@/utils/helpers';

interface RouteStatsProps {
  logs: RouteLog[];
  className?: string;
}

const RouteStats: React.FC<RouteStatsProps> = ({ logs, className }) => {
  // Calculate statistics
  const stats = logs.reduce((acc, log) => {
    acc.total++;
    acc[log.status] = (acc[log.status] || 0) + 1;
    acc.totalTime += log.processing_time_ms;
    return acc;
  }, {
    total: 0,
    success: 0,
    error: 0,
    filtered: 0,
    duplicate: 0,
    rate_limited: 0,
    skipped: 0,
    totalTime: 0,
  } as Record<string, number>);

  const successRate = stats.total > 0 ? ((stats.success / stats.total) * 100).toFixed(1) : '0';
  const avgProcessingTime = stats.total > 0 ? (stats.totalTime / stats.total).toFixed(0) : '0';

  // Recent logs (last 10)
  const recentLogs = logs.slice(0, 10);

  return (
    <div className={className}>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Total Requests</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success-600">{successRate}%</div>
            <div className="text-sm text-gray-500">Success Rate</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary-600">{avgProcessingTime}ms</div>
            <div className="text-sm text-gray-500">Avg Processing</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-error-600">{stats.error || 0}</div>
            <div className="text-sm text-gray-500">Errors</div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats).map(([status, count]) => {
              if (status === 'total' || status === 'totalTime' || count === 0) return null;
              return (
                <Badge 
                  key={status} 
                  variant={
                    status === 'success' ? 'success' :
                    status === 'error' || status === 'rate_limited' ? 'error' :
                    status === 'filtered' || status === 'duplicate' ? 'warning' : 'default'
                  }
                >
                  {status.replace('_', ' ')}: {count}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No activity yet</p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={
                        log.status === 'success' ? 'success' :
                        log.status === 'error' || log.status === 'rate_limited' ? 'error' :
                        log.status === 'filtered' || log.status === 'duplicate' ? 'warning' : 'default'
                      }
                      size="sm"
                    >
                      {log.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-gray-700">
                      {log.error_message || 'Processed successfully'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {formatDate(log.timestamp)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {log.processing_time_ms}ms
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteStats;
