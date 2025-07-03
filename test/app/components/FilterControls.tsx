'use client'

import { HealthCategory } from '@/lib/youtube'

interface FilterControlsProps {
  selectedCategory: HealthCategory | null
  searchQuery: string
  onClearFilters: () => void
  videoCount: number
}

export default function FilterControls({ 
  selectedCategory, 
  searchQuery, 
  onClearFilters, 
  videoCount 
}: FilterControlsProps) {
  const hasActiveFilters = selectedCategory?.id !== 'all' && selectedCategory !== null || searchQuery

  if (!hasActiveFilters) return null

  return (
    <div className="mx-4 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
          </svg>
          <div className="text-sm">
            <span className="font-medium text-blue-800 dark:text-blue-200">Active filters:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedCategory && selectedCategory.id !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                  {selectedCategory.icon} {selectedCategory.name}
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded-full">
                  🔍 "{searchQuery}"
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            {videoCount} videos
          </span>
          <button
            onClick={onClearFilters}
            className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  )
}