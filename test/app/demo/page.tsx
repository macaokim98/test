'use client'

import { useState } from 'react'

export default function Demo() {
  const [showVideo, setShowVideo] = useState(false)
  
  // 실제 한국 건강 YouTube 영상 ID (임베드 가능한 영상)
  const healthVideoId = 'q-gVHRCOLWM' // 사용자 제공 영상
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">YouTube 건강 영상 스트리밍 테스트</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">테스트 영상: 10분 모닝 요가</h2>
          
          {!showVideo ? (
            <div className="text-center">
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">YouTube 영상을 로드하려면 아래 버튼을 클릭하세요</p>
                </div>
              </div>
              <button
                onClick={() => setShowVideo(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                영상 재생하기
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${healthVideoId}?rel=0&modestbranding=1`}
                  title="건강 요가 영상"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowVideo(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                >
                  영상 숨기기
                </button>
                <a
                  href={`https://www.youtube.com/watch?v=${healthVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors inline-flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136C4.495 20.455 12 20.455 12 20.455s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>YouTube에서 보기</span>
                </a>
              </div>
            </div>
          )}
        </div>
        
        {/* 추가 테스트 영상들 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: 'XF15n5VndTI', title: '건강한 식단 준비법' },
            { id: 'inpok4MKVLM', title: '5분 명상으로 스트레스 해소' },
            { id: 'q-gVHRCOLWM', title: '사용자 추천 건강 영상' }
          ].map((video) => (
            <TestVideoCard key={video.id} videoId={video.id} title={video.title} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TestVideoCard({ videoId, title }: { videoId: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="font-semibold mb-3">{title}</h3>
      
      {!isPlaying ? (
        <div 
          className="aspect-video bg-gray-200 rounded cursor-pointer hover:bg-gray-300 transition-colors flex items-center justify-center"
          onClick={() => setIsPlaying(true)}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">클릭하여 재생</p>
          </div>
        </div>
      ) : (
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={title}
            className="w-full h-full rounded"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
      >
        {isPlaying ? '영상 숨기기' : '영상 재생'}
      </button>
    </div>
  )
}