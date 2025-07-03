'use client'

import { useState, useEffect } from 'react'

interface VideoPlayerProps {
  videoId: string
  title: string
  onClose: () => void
}

export default function VideoPlayer({ videoId, title, onClose }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [embedUrl, setEmbedUrl] = useState('')

  useEffect(() => {
    // 유효한 videoId 확인 및 URL 생성
    if (!videoId || videoId === 'demo1' || videoId === 'demo2' || videoId === 'demo3') {
      console.error('Invalid video ID:', videoId)
      setHasError(true)
      return
    }
    
    // YouTube 임베드 URL 생성 (단순화)
    const url = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
    setEmbedUrl(url)
    console.log('🎬 Loading video:', videoId, url)
  }, [videoId])

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mr-4">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black">
          {hasError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20">
              <div className="text-center">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Video Not Available</h3>
                <p className="text-red-600 dark:text-red-300 mb-4">This video cannot be played in embedded mode.</p>
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Watch on YouTube
                </a>
              </div>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading video...</p>
                    <p className="text-xs text-gray-500 mt-2">Video ID: {videoId}</p>
                  </div>
                </div>
              )}
              
              {embedUrl && (
                <iframe
                  src={embedUrl}
                  title={title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => {
                    console.log('✅ Video loaded successfully:', videoId)
                    setIsLoading(false)
                  }}
                  onError={() => {
                    console.error('❌ Video failed to load:', videoId)
                    setHasError(true)
                    setIsLoading(false)
                  }}
                />
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-between">
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136C4.495 20.455 12 20.455 12 20.455s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="text-sm font-medium">Watch on YouTube</span>
          </a>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}