'use client'

import { useState } from 'react'

interface HealthStats {
  videosWatched: number
  timeSpent: number
  streak: number
  favoriteCategory: string
}

interface HealthDashboardProps {
  stats: HealthStats
}

export default function HealthDashboard({ stats }: HealthDashboardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const weeklyGoal = 10 // videos per week
  const progress = (stats.videosWatched / weeklyGoal) * 100

  return (
    <div className="mx-4 mb-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Your Health Journey</h2>
            <p className="text-white/80 text-sm">Keep up the great work!</p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <svg 
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Weekly Goal</span>
            <span>{stats.videosWatched}/{weeklyGoal} videos</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.streak}</div>
            <div className="text-white/80 text-xs">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.round(stats.timeSpent / 60)}h</div>
            <div className="text-white/80 text-xs">Time Spent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.videosWatched}</div>
            <div className="text-white/80 text-xs">Videos</div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-white/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Favorite Category</span>
              <span className="text-sm font-medium">{stats.favoriteCategory}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">This Week's Focus</span>
              <span className="text-sm font-medium">Mental Health</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Achievement</span>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium">Health Explorer</span>
                <span className="text-yellow-300">🏆</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}