'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Route, RouteLog, getRoutes, getRouteLogs, deleteRoute } from '@/utils/api'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { RouteStats } from '@/components/route/RouteStats'
import { WebhookPreview } from '@/components/route/WebhookPreview'
import { formatDate, getSourceIcon, getTargetIcon } from '@/utils/helpers'

export default function RouteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const routeId = params.id as string

  const [route, setRoute] = useState<Route | null>(null)
  const [logs, setLogs] = useState<RouteLog[]>([])
  const [loading, setLoading] = useState(true)
  const [logsLoading, setLogsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'webhook'>('overview')

  useEffect(() => {
    loadRoute()
    loadLogs()
  }, [routeId])

  const loadRoute = async () => {
    try {
      setLoading(true)
      const routes = await getRoutes()
      const foundRoute = routes.find(r => r.id === routeId)
      if (!foundRoute) {
        setError('Route not found')
        return
      }
      setRoute(foundRoute)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load route')
    } finally {
      setLoading(false)
    }
  }

  const loadLogs = async () => {
    try {
      setLogsLoading(true)
      const logsData = await getRouteLogs(routeId)
      setLogs(logsData)
    } catch (err) {
      console.error('Failed to load logs:', err)
    } finally {
      setLogsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!route || !confirm(`Are you sure you want to delete "${route.name}"?`)) {
      return
    }

    try {
      await deleteRoute(route.id)
      router.push('/')
    } catch (err) {
      alert('Failed to delete route')
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }

  if (error || !route) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-red-400">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Route not found</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <Link href="/">
              <Button variant="primary">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'chart' },
    { id: 'logs', name: 'Logs', icon: 'list' },
    { id: 'webhook', name: 'Webhook', icon: 'code' },
  ]

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 truncate">{route.name}</h1>
            <Badge variant={route.enabled ? 'success' : 'secondary'}>
              {route.enabled ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          {route.description && (
            <p className="mt-2 text-lg text-gray-600">{route.description}</p>
          )}
          <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              {getSourceIcon(route.source.type)}
              <span className="capitalize">{route.source.type}</span>
            </div>
            <span>→</span>
            <div className="flex items-center space-x-2">
              {getTargetIcon(route.target.type)}
              <span className="capitalize">{route.target.type}</span>
            </div>
            <span>•</span>
            <span>Created {formatDate(route.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <RouteStats routeId={route.id} />
          
          {/* Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Source Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="text-sm text-gray-900 capitalize">{route.source.type}</dd>
                  </div>
                  {Object.entries(route.source.config || {}).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm font-medium text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {key.toLowerCase().includes('secret') ? '••••••••' : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Target Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="text-sm text-gray-900 capitalize">{route.target.type}</dd>
                  </div>
                  {Object.entries(route.target.config || {}).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm font-medium text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </dt>
                      <dd className="text-sm text-gray-900 break-all">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          {route.filters && route.filters.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {route.filters.map((filter, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <code className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                        {filter.field}
                      </code>
                      <span className="text-gray-500">{filter.operator}</span>
                      <code className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                        {filter.value}
                      </code>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'logs' && (
        <div>
          {logsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="loading-spinner"></div>
            </div>
          ) : logs.length === 0 ? (
            <div className="empty-state">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3-7.5H21m-3.75 0a3.75 3.75 0 00-3.75-3.75h-7.5a3.75 3.75 0 00-3.75 3.75 M15.75 10.5a3.75 3.75 0 00-3.75-3.75M21 10.5v7.5a3.75 3.75 0 01-3.75 3.75H9.75a3.75 3.75 0 01-3.75-3.75V10.5m12 0V9a3.75 3.75 0 00-3.75-3.75H9.75A3.75 3.75 0 006 9v1.5" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No logs yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Logs will appear here once your webhook starts receiving events.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <Card key={log.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant={log.status === 'success' ? 'success' : 'danger'}>
                          {log.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatDate(log.timestamp)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {log.processingTime}ms
                        </span>
                      </div>
                    </div>
                    
                    {log.error && (
                      <div className="mt-3 p-3 bg-red-50 rounded-md">
                        <p className="text-sm text-red-700">{log.error}</p>
                      </div>
                    )}
                    
                    <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Request</h4>
                        <pre className="text-xs bg-gray-50 p-3 rounded-md overflow-x-auto">
                          {JSON.stringify(log.request, null, 2)}
                        </pre>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Response</h4>
                        <pre className="text-xs bg-gray-50 p-3 rounded-md overflow-x-auto">
                          {JSON.stringify(log.response, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'webhook' && (
        <WebhookPreview route={route} />
      )}
    </div>
  )
}
