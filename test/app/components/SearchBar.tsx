'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  loading?: boolean
}

export default function SearchBar({ onSearch, placeholder = "Search health videos...", loading = false }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  const handleClear = () => {
    setQuery('')
    setIsExpanded(false)
    onSearch('') // Trigger reset
  }

  return (
    <div className="relative">
      {!isExpanded ? (
        // Collapsed search icon
        <button
          onClick={() => setIsExpanded(true)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      ) : (
        // Expanded search form
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-2 pl-10 pr-10 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
              autoFocus
            />
            
            {/* Search icon */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Loading or Clear button */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {loading ? (
                <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              ) : query ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>
          
          {/* Collapse button */}
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </form>
      )}
    </div>
  )
}