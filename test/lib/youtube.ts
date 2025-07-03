import axios from 'axios'

// Next.js 환경 변수 접근 (서버사이드와 클라이언트사이드 모두 지원)
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

// 디버깅용 로그 (개발 환경에서만)
if (typeof window !== 'undefined') {
  console.log('🔑 Client-side API Key:', YOUTUBE_API_KEY ? '✅ 로드됨' : '❌ 없음')
} else {
  console.log('🔑 Server-side API Key:', YOUTUBE_API_KEY ? '✅ 로드됨' : '❌ 없음')
}

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnails: {
    default: { url: string }
    medium: { url: string }
    high: { url: string }
  }
  channelTitle: string
  publishedAt: string
  viewCount: string
  duration: string
  tags: string[]
}

export interface HealthCategory {
  id: string
  name: string
  icon: string
  color: string
  keywords: string[]
  trending: boolean
}

export const healthCategories: HealthCategory[] = [
  {
    id: 'fitness',
    name: 'Fitness & Exercise',
    icon: '💪',
    color: 'bg-gradient-to-r from-red-500 to-pink-500',
    keywords: ['운동', '헬스', '피트니스', '홈트', '트레이닝', 'HIIT', '요가'],
    trending: true
  },
  {
    id: 'nutrition',
    name: 'Nutrition & Diet',
    icon: '🥗',
    color: 'bg-gradient-to-r from-green-500 to-teal-500',
    keywords: ['영양', '건강식', '다이어트', '식단', '레시피', '체중감량'],
    trending: false
  },
  {
    id: 'mental-health',
    name: 'Mental Health',
    icon: '🧠',
    color: 'bg-gradient-to-r from-blue-500 to-purple-500',
    keywords: ['명상', '마음챙김', '불안', '스트레스', '정신건강', '심리치료'],
    trending: true
  },
  {
    id: 'sleep',
    name: 'Sleep & Recovery',
    icon: '😴',
    color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    keywords: ['수면', '회복', '휴식', '불면증', '수면위생', '이완'],
    trending: false
  },
  {
    id: 'lifestyle',
    name: 'Healthy Lifestyle',
    icon: '🌱',
    color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    keywords: ['라이프스타일', '웰니스', '건강팁', '모닝루틴', '습관'],
    trending: true
  }
]

export async function searchYouTubeVideos(query: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
  const apiKey = YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
  
  if (!apiKey || apiKey.trim() === '') {
    console.error('🚫 YouTube API key not found. Checked:', {
      YOUTUBE_API_KEY: !!process.env.YOUTUBE_API_KEY,
      NEXT_PUBLIC_YOUTUBE_API_KEY: !!process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
      combined: !!apiKey
    })
    throw new Error('YouTube API 키가 구성되지 않았습니다')
  }

  try {
    console.log(`🔍 YouTube 검색: "${query}" (최대 ${maxResults}개) - 스트리밍 가능한 영상만`)
    
    // 한국어 건강 콘텐츠에 최적화된 검색 파라미터 (스트리밍 보장)
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: apiKey,
        part: 'snippet',
        q: `${query} -광고 -홍보 -쇼핑`,  // 광고성 콘텐츠 제외
        type: 'video',
        maxResults: maxResults * 3, // 스트리밍 필터링을 위해 더 많이 검색
        order: 'relevance',
        videoDuration: 'medium',  // 중간 길이 영상 (4-20분)
        videoDefinition: 'high',   // HD 영상만
        regionCode: 'KR',
        relevanceLanguage: 'ko',
        videoEmbeddable: 'true',   // 퍼가기 가능한 영상만 (스트리밍 보장)
        videoSyndicated: 'true',   // 외부 재생 가능한 영상만 (스트리밍 보장)
        safeSearch: 'strict'       // 안전 검색
      },
      timeout: 15000 // 15초 타임아웃
    })

    if (!response.data.items || response.data.items.length === 0) {
      console.warn(`No videos found for query: "${query}"`)
      return []
    }

    console.log(`✅ Found ${response.data.items.length} videos for "${query}"`)

    // Get video details for duration and view count
    const videoIds = response.data.items.map((item: any) => item.id.videoId).join(',')
    
    const detailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        key: apiKey,
        part: 'statistics,contentDetails,snippet,status', // status 추가로 퍼가기 정보 확인
        id: videoIds
      },
      timeout: 10000
    })

    const videos = detailsResponse.data.items
      .filter((item: any) => {
        // 유효한 비디오 데이터 확인
        if (!item.id || !item.snippet || !item.snippet.title) {
          console.warn('Invalid video data:', item.id)
          return false
        }
        
        // 퍼가기 가능 여부 확인
        if (item.status && item.status.embeddable === false) {
          console.warn('Video not embeddable:', item.id, item.snippet.title)
          return false
        }
        
        return true
      })
      .map((item: any) => {
        console.log(`✅ Valid video: ${item.id} - ${item.snippet.title}`)
        return {
          id: item.id,
          title: item.snippet.title || 'Unknown Title',
          description: item.snippet.description || '',
          thumbnails: item.snippet.thumbnails || {},
          channelTitle: item.snippet.channelTitle || 'Unknown Channel',
          publishedAt: item.snippet.publishedAt,
          viewCount: item.statistics?.viewCount || '0',
          duration: item.contentDetails?.duration || 'PT0S',
          tags: item.snippet.tags || []
        }
      })

    console.log(`📊 Processed ${videos.length} video details`)
    return videos

  } catch (error: any) {
    console.error('❌ Error fetching YouTube videos:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    })
    
    if (error.response?.status === 403) {
      throw new Error('YouTube API quota exceeded or invalid API key')
    } else if (error.response?.status === 400) {
      throw new Error('Invalid YouTube API request parameters')
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('YouTube API request timeout')
    }
    
    throw new Error(`YouTube API error: ${error.message}`)
  }
}

export async function getRandomHealthContent(): Promise<YouTubeVideo[]> {
  const apiKey = YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
  
  // YouTube API 키가 없으면 에러 발생
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('YouTube API 키가 구성되지 않았습니다')
  }

  try {
    console.log('🔄 Fetching random health content from YouTube API...')
    
    // 대폭 확장된 건강 주제 키워드들 (30개 이상)
    const healthQueries = [
      // 운동 관련
      '아침 요가 루틴', '필라테스 기초', '스트레칭 방법', '홈트레이닝', 'HIIT 운동',
      '유산소 운동', '근력 운동', '코어 운동', '맨몸 운동', '초보자 운동',
      
      // 영양 관련  
      '건강한 식단', '다이어트 식단', '영양 균형', '비타민 정보', '단백질 섭취',
      '해독 주스', '건강 간식', '체중 감량', '식사 준비', '영양소 흡수',
      
      // 정신건강 관련
      '명상 기초', '마음챙김', '스트레스 해소', '불안 극복', '우울 극복',
      '정신건강 관리', '심호흡 방법', '이완 기법', '감정 조절', '자기계발',
      
      // 수면/회복 관련
      '수면 개선', '불면증 해결', '숙면 방법', '회복 운동', '휴식 기법',
      '저녁 루틴', '아침 루틴', '건강 습관', '에너지 증진', '피로 회복'
    ]
    
    // 타임스탬프를 이용한 더 강한 랜덤성
    const currentTime = Date.now()
    const randomSeed = currentTime % healthQueries.length
    
    // 랜덤하게 4개의 쿼리 선택 (더 많은 결과)
    const selectedQueries = healthQueries
      .slice(randomSeed)
      .concat(healthQueries.slice(0, randomSeed)) // 배열 회전
      .sort(() => Math.random() - 0.5)
      .sort(() => Math.random() - 0.5) // 두 번 섞기
      .slice(0, 4)
    
    const videos: YouTubeVideo[] = []
    
    for (const query of selectedQueries) {
      console.log(`🔍 Searching for: "${query}" (${currentTime})`)
      const queryVideos = await searchYouTubeVideos(query, 3)
      videos.push(...queryVideos)
    }
    
    // 최종 결과도 더 강하게 랜덤 섞기
    const finalVideos = videos
      .sort(() => Math.random() - 0.5)
      .sort(() => Math.random() - 0.5) // 두 번 섞기
      .slice(0, 5)
    
    console.log(`✅ Found ${finalVideos.length} videos from YouTube API`)
    return finalVideos
  } catch (error) {
    console.error('Failed to fetch YouTube data:', error)
    throw error // 에러를 다시 던져서 상위에서 처리하도록
  }
}

// 카테고리별 콘텐츠 검색 함수
export async function searchHealthContentByCategory(category: HealthCategory, maxResults: number = 10): Promise<YouTubeVideo[]> {
  const apiKey = YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
  
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('YouTube API 키가 구성되지 않았습니다')
  }

  try {
    console.log(`🔍 Searching YouTube for category: ${category.name}`)
    
    // 카테고리별 키워드를 조합해서 검색
    const searchQueries = category.keywords.slice(0, 3).map(keyword => `${keyword} 건강 팁`)
    const allVideos: YouTubeVideo[] = []
    
    for (const query of searchQueries) {
      console.log(`🔍 Category search: "${query}"`)
      const videos = await searchYouTubeVideos(query, Math.ceil(maxResults / searchQueries.length))
      allVideos.push(...videos)
    }
    
    // 중복 제거 및 결과 제한
    const uniqueVideos = allVideos.filter((video, index, self) => 
      index === self.findIndex(v => v.id === video.id)
    )
    
    console.log(`✅ Found ${uniqueVideos.length} unique videos for category: ${category.name}`)
    return uniqueVideos.slice(0, maxResults)
  } catch (error) {
    console.error(`Failed to fetch category data for ${category.name}:`, error)
    throw error // 에러를 다시 던져서 상위에서 처리하도록
  }
}

