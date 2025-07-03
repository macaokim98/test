'use client'

import { useState, useEffect } from 'react'
import { searchYouTubeVideos, YouTubeVideo } from '@/lib/youtube'

export default function YogaDemo() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  useEffect(() => {
    loadYogaVideos()
  }, [])

  const loadYogaVideos = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('🧘‍♀️ 요가 영상 검색 시작...')
      
      // 요가 관련 한국어 키워드로 검색
      console.log('🔍 API 키 확인:', process.env.YOUTUBE_API_KEY ? '설정됨' : '없음')
      const yogaVideos = await searchYouTubeVideos('요가 초보자', 10)
      
      if (yogaVideos.length === 0) {
        throw new Error('요가 영상을 찾을 수 없습니다')
      }
      
      // 랜덤하게 5개 선택
      const randomVideos = yogaVideos
        .sort(() => 0.5 - Math.random())
        .slice(0, 5)
      
      setVideos(randomVideos)
      console.log(`✅ ${randomVideos.length}개 요가 영상 로드됨`)
      
    } catch (error: any) {
      console.error('❌ 요가 영상 로드 실패:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId)
  }

  const handleCloseVideo = () => {
    setSelectedVideo(null)
  }

  const handleRefresh = () => {
    loadYogaVideos()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🧘‍♀️ 요가 동영상 데모
          </h1>
          <p className="text-gray-600">
            YouTube API로 실시간 요가 영상 검색 및 임베딩 테스트
          </p>
          <button
            onClick={handleRefresh}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-colors"
            disabled={loading}
          >
            {loading ? '로딩 중...' : '새로운 영상 불러오기'}
          </button>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">YouTube에서 요가 영상을 검색 중...</p>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-red-800">에러 발생</h3>
            </div>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        )}

        {/* 영상 그리드 */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                index={index + 1}
                onClick={() => handleVideoClick(video.id)}
              />
            ))}
          </div>
        )}

        {/* 영상이 없을 때 */}
        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">검색된 요가 영상이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 풀스크린 비디오 플레이어 */}
      {selectedVideo && (
        <VideoModal
          videoId={selectedVideo}
          onClose={handleCloseVideo}
        />
      )}
    </div>
  )
}

// 비디오 카드 컴포넌트
function VideoCard({ 
  video, 
  index, 
  onClick 
}: { 
  video: YouTubeVideo
  index: number
  onClick: () => void 
}) {
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

  const formatViewCount = (count: string) => {
    const num = parseInt(count)
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return count
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      {/* 썸네일 */}
      <div 
        className="relative aspect-video bg-gray-200 cursor-pointer group"
        onClick={onClick}
      >
        <img
          src={video.thumbnails.high?.url || video.thumbnails.medium?.url || video.thumbnails.default?.url}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
            <svg className="w-8 h-8 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        
        {/* 번호 뱃지 */}
        <div className="absolute top-3 left-3 bg-purple-600 text-white px-2 py-1 rounded-full text-sm font-bold">
          #{index}
        </div>
        
        {/* 길이 뱃지 */}
        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </div>
      </div>
      
      {/* 내용 */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2 leading-tight">
          {video.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="truncate">{video.channelTitle}</span>
          <span>{formatViewCount(video.viewCount)} views</span>
        </div>
        
        <button
          onClick={onClick}
          className="w-full mt-3 bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 rounded-lg transition-colors font-medium"
        >
          영상 재생
        </button>
      </div>
    </div>
  )
}

// 풀스크린 비디오 모달
function VideoModal({ 
  videoId, 
  onClose 
}: { 
  videoId: string
  onClose: () => void 
}) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">요가 영상 재생</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 비디오 */}
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title="Yoga Video"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        {/* 푸터 */}
        <div className="p-4 bg-gray-50 flex justify-between items-center">
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            YouTube에서 보기 →
          </a>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}