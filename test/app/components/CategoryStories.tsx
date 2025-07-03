'use client'

import { healthCategories, HealthCategory } from '@/lib/youtube'
import { useState } from 'react'

interface CategoryStoriesProps {
  onCategorySelect: (category: HealthCategory) => void
  selectedCategoryId?: string | null
  loading?: boolean
}

export default function CategoryStories({ onCategorySelect, selectedCategoryId, loading = false }: CategoryStoriesProps) {
  const [localSelected, setLocalSelected] = useState<string | null>(null)
  
  // 외부에서 전달된 selectedCategoryId를 우선 사용
  const selectedCategory = selectedCategoryId || localSelected

  const handleCategoryClick = (category: HealthCategory) => {
    setLocalSelected(category.id)
    onCategorySelect(category)
  }

  return (
    <div className="px-4 py-3">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {/* All Categories */}
        <div className="flex-shrink-0 text-center">
          <button
            onClick={() => {
              setLocalSelected(null)
              onCategorySelect({
                id: 'all',
                name: 'All',
                icon: '✨',
                color: 'bg-gradient-to-r from-purple-500 to-pink-500',
                keywords: [],
                trending: false
              })
            }}
            className="relative group"
            disabled={loading}
          >
            {loading && selectedCategory === null && (
              <div className="absolute -top-1 -right-1 w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin z-10"></div>
            )}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-110 shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 hover:scale-105'
            } ${loading ? 'opacity-75' : ''}`}>
              ✨
            </div>
            <p className="text-xs font-medium mt-2 text-gray-600 dark:text-gray-300">All</p>
          </button>
        </div>

        {/* Health Categories */}
        {healthCategories.map((category) => (
          <div key={category.id} className="flex-shrink-0 text-center">
            <button
              onClick={() => handleCategoryClick(category)}
              className="relative group"
              disabled={loading}
            >
              {/* Loading indicator */}
              {loading && selectedCategory === category.id && (
                <div className="absolute -top-1 -right-1 w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin z-10"></div>
              )}
              
              {/* Trending indicator */}
              {category.trending && selectedCategory !== category.id && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center z-10">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
              
              {/* Category circle */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
                selectedCategory === category.id
                  ? `${category.color} scale-110 shadow-lg`
                  : 'bg-gray-100 dark:bg-gray-700 hover:scale-105'
              } ${loading ? 'opacity-75' : ''}`}>
                {category.icon}
              </div>
              
              {/* Category name */}
              <p className="text-xs font-medium mt-2 text-gray-600 dark:text-gray-300 max-w-[4rem] truncate">
                {category.name.split(' ')[0]}
              </p>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}