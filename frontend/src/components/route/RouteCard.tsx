import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Route } from '@/utils/api-simple';
import { formatRelativeTime, getSourceIcon, getTargetIcon, getStatusColor } from '@/utils/helpers';

interface RouteCardProps {
  route: Route;
  onDelete?: (id: string) => void;
}

const RouteCard: React.FC<RouteCardProps> = ({ route, onDelete }) => {
  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this route?')) {
      onDelete(route.id);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Route Header */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {route.name}
              </h3>
              <Badge 
                variant={route.status === 'active' ? 'success' : 'default'}
                size="sm"
              >
                {route.status}
              </Badge>
            </div>

            {/* Source to Target Flow */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-md">
                <span className="text-lg">{getSourceIcon(route.source)}</span>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {route.source}
                </span>
              </div>
              
              <div className="flex-shrink-0">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-md">
                <span className="text-lg">{getTargetIcon(route.target)}</span>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {route.target}
                </span>
              </div>
            </div>

            {/* Configuration Summary */}
            <div className="flex flex-wrap gap-2 mb-3">
              {route.config.filters.length > 0 && (
                <Badge variant="info" size="sm">
                  {route.config.filters.length} filter{route.config.filters.length !== 1 ? 's' : ''}
                </Badge>
              )}
              {route.config.required_fields.length > 0 && (
                <Badge variant="warning" size="sm">
                  {route.config.required_fields.length} required field{route.config.required_fields.length !== 1 ? 's' : ''}
                </Badge>
              )}
              {route.config.duplicate_check_field && (
                <Badge variant="default" size="sm">
                  Duplicate check
                </Badge>
              )}
            </div>

            {/* Metadata */}
            <div className="text-sm text-gray-500">
              <p>Created {formatRelativeTime(route.created_at)}</p>
              <p className="font-mono text-xs mt-1 truncate">
                ID: {route.id}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 ml-4">
            <Link href={`/route/${route.id}`}>
              <Button variant="outline" size="sm" className="w-full">
                View
              </Button>
            </Link>
            {onDelete && (
              <Button 
                variant="danger" 
                size="sm" 
                onClick={handleDelete}
                className="w-full"
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteCard;
