import React from 'react';
import { Filter, X } from 'lucide-react';

interface FeedFiltersProps {
  activeFilters: {
    type?: string;
    author?: string;
    dateRange?: { start: Date; end: Date };
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
}

export function FeedFilters({ activeFilters, onFilterChange, onClearFilters }: FeedFiltersProps) {
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Post Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Post Type
          </label>
          <select
            value={activeFilters.type || ''}
            onChange={(e) => onFilterChange({ type: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="text">Updates</option>
            <option value="media">Media</option>
            <option value="job">Jobs</option>
            <option value="certificate">Achievements</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <select
            onChange={(e) => {
              const value = e.target.value;
              if (!value) {
                onFilterChange({ dateRange: undefined });
                return;
              }

              const now = new Date();
              let start: Date;

              switch (value) {
                case 'today':
                  start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                  break;
                case 'week':
                  start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                  break;
                case 'month':
                  start = new Date(now.getFullYear(), now.getMonth(), 1);
                  break;
                default:
                  return;
              }

              onFilterChange({ dateRange: { start, end: now } });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* Author Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author
          </label>
          <input
            type="text"
            placeholder="Search by author..."
            value={activeFilters.author || ''}
            onChange={(e) => onFilterChange({ author: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {activeFilters.type && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Type: {activeFilters.type}
                <button
                  onClick={() => onFilterChange({ type: undefined })}
                  className="ml-1 text-primary-600 hover:text-primary-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {activeFilters.author && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Author: {activeFilters.author}
                <button
                  onClick={() => onFilterChange({ author: undefined })}
                  className="ml-1 text-primary-600 hover:text-primary-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {activeFilters.dateRange && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Date filtered
                <button
                  onClick={() => onFilterChange({ dateRange: undefined })}
                  className="ml-1 text-primary-600 hover:text-primary-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}