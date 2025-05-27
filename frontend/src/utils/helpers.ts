import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date helpers
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatDate(dateString);
}

// Source and target display helpers
export function getSourceIcon(source: string): string {
  switch (source.toLowerCase()) {
    case 'typeform': return '📝';
    case 'tally': return '📊';
    case 'paperform': return '📋';
    default: return '📄';
  }
}

export function getTargetIcon(target: string): string {
  switch (target.toLowerCase()) {
    case 'sheets': return '📈';
    case 'notion': return '📚';
    case 'digest': return '✉️';
    default: return '🎯';
  }
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'success': return 'text-success-600 bg-success-50';
    case 'error': return 'text-error-600 bg-error-50';
    case 'filtered': return 'text-warning-600 bg-warning-50';
    case 'duplicate': return 'text-warning-600 bg-warning-50';
    case 'rate_limited': return 'text-error-600 bg-error-50';
    case 'skipped': return 'text-gray-600 bg-gray-50';
    case 'active': return 'text-success-600 bg-success-50';
    case 'inactive': return 'text-gray-600 bg-gray-50';
    default: return 'text-gray-600 bg-gray-50';
  }
}

// Copy to clipboard helper
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

// Validation helpers
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Filter operators
export const FILTER_OPERATORS = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Not Contains' },
  { value: 'starts_with', label: 'Starts With' },
  { value: 'ends_with', label: 'Ends With' },
  { value: 'regex', label: 'Regex Match' },
  { value: 'not_regex', label: 'Regex Not Match' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'greater_than_or_equal', label: 'Greater Than or Equal' },
  { value: 'less_than_or_equal', label: 'Less Than or Equal' },
  { value: 'is_empty', label: 'Is Empty' },
  { value: 'is_not_empty', label: 'Is Not Empty' },
];

// Source types
export const SOURCE_TYPES = [
  { value: 'typeform', label: 'Typeform', icon: '📝' },
  { value: 'tally', label: 'Tally', icon: '📊' },
  { value: 'paperform', label: 'Paperform', icon: '📋' },
];

// Target types
export const TARGET_TYPES = [
  { value: 'sheets', label: 'Google Sheets', icon: '📈' },
  { value: 'notion', label: 'Notion', icon: '📚' },
  { value: 'digest', label: 'Email Digest', icon: '✉️' },
];
