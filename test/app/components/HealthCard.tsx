'use client'

import { YouTubeVideo } from '@/lib/youtube'
import { useState } from 'react'
import Image from 'next/image'
import VideoPlayer from './VideoPlayer'

interface HealthCardProps {
  video: YouTubeVideo
  onSave?: (video: YouTubeVideo) => void
  onShare?: (video: YouTubeVideo) => void
}

export default function HealthCard({ video, onSave, onShare }: HealthCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)

  const formatViewCount = (count: string) => {
    const num = parseInt(count)
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return count
  }

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    if (!match) return '0:00'
    
    const hours = (match[1] || '').replace('H', '')
    const minutes = (match[2] || '').replace('M', '')
    const seconds = (match[3] || '').replace('S', '')
    
    if (hours) {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
    }
    return `${minutes || '0'}:${seconds.padStart(2, '0')}`
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    if (onSave) onSave(video)
  }

  const handleShare = () => {
    if (onShare) onShare(video)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handlePlayVideo = () => {
    // 원하는 옵션을 선택하세요:
    
    // 옵션 1: 앱 내에서 바로 재생 (현재 활성화)
    setShowPlayer(true)
    
    // 옵션 2: YouTube 새 탭에서 열기 (주석 해제 시 사용)
    // window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')
    
    // 옵션 3: 같은 탭에서 YouTube로 이동
    // window.location.href = `https://www.youtube.com/watch?v=${video.id}`
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // 버튼 클릭이 아닌 경우에만 비디오 재생
    if (!(e.target as HTMLElement).closest('button')) {
      handlePlayVideo()
    }
  }

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
    >
      {/* Thumbnail with overlay */}
      <div className="relative aspect-video overflow-hidden">
        {!imageError ? (
          <Image
            src={video.thumbnails.high?.url || video.thumbnails.medium?.url || video.thumbnails.default?.url}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-gray-500">Health Video</p>
            </div>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-full font-medium">
          {formatDuration(video.duration)}
        </div>
        
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePlayVideo()
            }}
            className="rounded-full p-4 transition-all duration-200 shadow-lg"
            style={{ backgroundColor: 'var(--primary-blue)' }}
            aria-label="Play video"
          >
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
        
        {/* Save button */}
        <button
          onClick={handleSave}
          className="absolute top-3 right-3 p-2 bg-black/20 backdrop-blur-sm rounded-full hover:bg-black/40 transition-colors"
        >
          <svg 
            className={`w-5 h-5 ${isSaved ? 'text-yellow-400 fill-current' : 'text-white'}`}
            fill={isSaved ? 'currentColor' : 'none'}
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight">
          {video.title}
        </h3>
        
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {video.channelTitle.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white text-sm">
              {video.channelTitle}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              {formatViewCount(video.viewCount)} views
            </p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors ${
              isLiked 
                ? 'bg-red-50 text-red-600 dark:bg-red-900/20' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            <svg className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm font-medium">Like</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>
      
      {/* Video Player Modal */}
      {showPlayer && (
        <VideoPlayer
          videoId={video.id}
          title={video.title}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </div>
  )
}