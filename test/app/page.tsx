'use client'

import { useState, useEffect } from 'react'
import { YouTubeVideo, getRandomHealthContent } from '@/lib/youtube'
import { useDarkMode } from './hooks/useDarkMode'
import HealthCard from './components/HealthCard'

export default function Home() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isDarkMode, toggleDarkMode, mounted } = useDarkMode()

  useEffect(() => {
    loadHealthContent()
  }, [])

  const loadHealthContent = async () => {
    setLoading(true)
    setError(null)
    try {
      const healthVideos = await getRandomHealthContent()
      setVideos(healthVideos)
    } catch (error: any) {
      console.error('Error loading health content:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadHealthContent()
  }

  const handleVideoSave = (video: YouTubeVideo) => {
    console.log('Saving video:', video.title)
  }

  const handleVideoShare = (video: YouTubeVideo) => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: `Check out this health video: ${video.title}`,
        url: `https://youtube.com/watch?v=${video.id}`
      })
    } else {
      navigator.clipboard.writeText(`https://youtube.com/watch?v=${video.id}`)
    }
  }

  // 마운트되기 전에는 로딩 화면 표시
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading HealthTube...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`shadow-sm sticky top-0 z-50 transition-colors ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className={`text-xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>HealthTube</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              disabled={loading}
            >
              <svg className={`w-6 h-6 transition-colors ${loading ? 'animate-spin' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className={`text-2xl font-semibold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Popular health topics
          </h2>
          <p className={`transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Discover trending health content from YouTube
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className={`mb-6 p-4 rounded-lg border transition-colors ${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-red-400' : 'text-red-800'}`}>Error loading content</h3>
                <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="space-y-4">
          {loading ? (
            // Loading State (shimmer effect like health-app.html)
            <>
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`rounded-xl p-4 shadow-sm transition-colors ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className={`h-40 rounded-lg mb-4 animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-4 rounded mb-2 animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-3 rounded w-2/3 animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                </div>
              ))}
            </>
          ) : (
            // Video Cards
            videos.map((video) => (
              <HealthCard
                key={video.id}
                video={video}
                onSave={handleVideoSave}
                onShare={handleVideoShare}
              />
            ))
          )}
        </div>

        {/* Empty State */}
        {!loading && videos.length === 0 && !error && (
          <div className="text-center py-12">
            <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <svg className={`w-12 h-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM9 6v10h6V6H9z" />
              </svg>
            </div>
            <h3 className={`text-lg font-semibold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No videos found</h3>
            <p className={`mb-4 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Try refreshing or check your internet connection</p>
            <button
              onClick={handleRefresh}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-full hover:from-green-600 hover:to-blue-600 transition-colors"
            >
              Refresh Content
            </button>
          </div>
        )}
      </main>

      {/* Bottom Navigation (like health-app.html) */}
      <nav className={`fixed bottom-0 left-0 right-0 border-t transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-around">
            <button className="flex flex-col items-center space-y-1 text-green-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium">Home</span>
            </button>
            <button className={`flex flex-col items-center space-y-1 transition-colors ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="text-xs font-medium">Saved</span>
            </button>
            <button className={`flex flex-col items-center space-y-1 transition-colors ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}