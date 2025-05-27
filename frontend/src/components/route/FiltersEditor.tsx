import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export interface Filter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value?: string;
}

interface FiltersEditorProps {
  filters: Filter[];
  onChange: (filters: Filter[]) => void;
  className?: string;
}

export const FiltersEditor: React.FC<FiltersEditorProps> = ({ 
  filters, 
  onChange, 
  className 
}) => {
  const [newFilter, setNewFilter] = useState<Partial<Filter>>({
    field: '',
    operator: 'equals',
    value: ''
  });

  const addFilter = () => {
    if (newFilter.field && newFilter.operator) {
      const filter: Filter = {
        field: newFilter.field,
        operator: newFilter.operator,
        value: needsValue(newFilter.operator) ? (newFilter.value || '') : undefined
      };
      onChange([...filters, filter]);
      setNewFilter({ field: '', operator: 'equals', value: '' });
    }
  };

  const removeFilter = (index: number) => {
    onChange(filters.filter((_, i) => i !== index));
  };

  const needsValue = (operator: string) => {
    return !['is_empty', 'is_not_empty'].includes(operator);
  };

  const getOperatorLabel = (operator: string) => {
    const labels = {
      equals: 'equals',
      not_equals: 'does not equal',
      contains: 'contains',
      not_contains: 'does not contain',
      starts_with: 'starts with',
      ends_with: 'ends with',
      greater_than: 'greater than',
      less_than: 'less than',
      is_empty: 'is empty',
      is_not_empty: 'is not empty'
    };
    return labels[operator as keyof typeof labels] || operator;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Data Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Filters */}
        {filters.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Active Filters</h4>
            {filters.map((filter, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{filter.field}</span>
                  <span className="mx-2 text-gray-500">{getOperatorLabel(filter.operator)}</span>
                  {filter.value && (
                    <span className="font-medium text-gray-900">&quot;{filter.value}&quot;</span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFilter(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Filter */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Add Filter</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Field */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Field Path
              </label>
              <input
                type="text"
                value={newFilter.field || ''}
                onChange={(e) => setNewFilter({ ...newFilter, field: e.target.value })}
                placeholder="e.g., data.email, event_type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Operator */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Condition
              </label>
              <select
                value={newFilter.operator || 'equals'}
                onChange={(e) => setNewFilter({ ...newFilter, operator: e.target.value as Filter['operator'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="equals">equals</option>
                <option value="not_equals">does not equal</option>
                <option value="contains">contains</option>
                <option value="not_contains">does not contain</option>
                <option value="starts_with">starts with</option>
                <option value="ends_with">ends with &quot;text&quot;</option>
                <option value="greater_than">greater than (number)</option>
                <option value="less_than">less than (number)</option>
                <option value="is_empty">is empty</option>
                <option value="is_not_empty">is not empty</option>
              </select>
            </div>

            {/* Value */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Value
              </label>
              <input
                type="text"
                value={newFilter.value || ''}
                onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                placeholder={needsValue(newFilter.operator || 'equals') ? 'Filter value' : 'Not needed'}
                disabled={!needsValue(newFilter.operator || 'equals')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>
          </div>

          <Button
            onClick={addFilter}
            disabled={!newFilter.field || !newFilter.operator}
            className="w-full md:w-auto"
          >
            Add Filter
          </Button>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <h5 className="text-sm font-medium text-blue-900 mb-1">Filter Examples</h5>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• <code>event_type equals &quot;form_response&quot;</code> - Only process form responses</p>
            <p>• <code>data.email contains &quot;@company.com&quot;</code> - Only company emails</p>
            <p>• <code>data.amount greater_than &quot;100&quot;</code> - Only high-value transactions</p>
            <p>• <code>data.status is_not_empty</code> - Must have a status field</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltersEditor;
