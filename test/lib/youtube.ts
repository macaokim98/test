import axios from 'axios'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

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
  if (!YOUTUBE_API_KEY) {
    console.warn('🚫 YouTube API key is not configured, falling back to demo data')
    throw new Error('YouTube API 키가 구성되지 않았습니다')
  }

  try {
    console.log(`🔍 YouTube 검색: "${query}" (최대 ${maxResults}개)`)
    
    // 한국어 건강 콘텐츠에 최적화된 검색 파라미터
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: YOUTUBE_API_KEY,
        part: 'snippet',
        q: `${query} 건강 튜토리얼 -광고 -홍보`,  // 광고성 콘텐츠 제외
        type: 'video',
        maxResults: maxResults * 2, // 필터링을 위해 더 많이 검색
        order: 'relevance',
        videoDuration: 'medium',  // 중간 길이 영상 (4-20분)
        videoDefinition: 'high',   // HD 영상만
        regionCode: 'KR',
        relevanceLanguage: 'ko',
        videoEmbeddable: 'true',   // 퍼가기 가능한 영상만
        videoSyndicated: 'true',   // 외부 재생 가능한 영상만
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
        key: YOUTUBE_API_KEY,
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
  // 개발 환경에서 데모 데이터 사용 여부 확인
  if (process.env.NEXT_PUBLIC_USE_DEMO_DATA === 'true' || !YOUTUBE_API_KEY) {
    console.log('🔄 Using demo data (API key not configured)')
    return getDemoHealthContent()
  }

  try {
    console.log('🔄 Fetching random health content from YouTube API...')
    
    // 다양한 건강 주제의 키워드들
    const healthQueries = [
      '아침 요가 루틴',
      '건강한 식단 준비',
      '초보자 명상',
      '홈트레이닝 운동',
      '수면 위생 팁',
      '정신 건강 관리',
      '영양 기초 지식',
      '스트레스 해소법',
      '다이어트 동기부여',
      '건강한 생활습관'
    ]
    
    // 랜덤하게 3개의 쿼리 선택
    const selectedQueries = healthQueries
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    
    const videos: YouTubeVideo[] = []
    
    for (const query of selectedQueries) {
      console.log(`🔍 Searching for: "${query}"`)
      const queryVideos = await searchYouTubeVideos(query, 2)
      videos.push(...queryVideos)
    }
    
    console.log(`✅ Found ${videos.length} videos from YouTube API`)
    return videos.slice(0, 5)
  } catch (error) {
    console.warn('Failed to fetch YouTube data, using demo content:', error)
    return getDemoHealthContent()
  }
}

// 카테고리별 콘텐츠 검색 함수
export async function searchHealthContentByCategory(category: HealthCategory, maxResults: number = 10): Promise<YouTubeVideo[]> {
  if (process.env.NEXT_PUBLIC_USE_DEMO_DATA === 'true' || !YOUTUBE_API_KEY) {
    console.log(`🔄 Using demo data for category: ${category.name}`)
    return getDemoHealthContentByCategory(category.id)
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
    console.warn(`Failed to fetch category data for ${category.name}, using demo content:`, error)
    return getDemoHealthContentByCategory(category.id)
  }
}

// 카테고리별 데모 데이터 필터링
function getDemoHealthContentByCategory(categoryId: string): YouTubeVideo[] {
  const allDemoVideos = getDemoHealthContent()
  
  // 카테고리별 키워드 매칭
  const categoryKeywords = healthCategories.find(cat => cat.id === categoryId)?.keywords || []
  
  const filteredVideos = allDemoVideos.filter(video => {
    const videoText = `${video.title} ${video.description} ${video.tags.join(' ')}`.toLowerCase()
    return categoryKeywords.some(keyword => videoText.includes(keyword.toLowerCase()))
  })
  
  // 매칭되는 비디오가 없으면 전체 데모 비디오 반환
  return filteredVideos.length > 0 ? filteredVideos : allDemoVideos.slice(0, 3)
}

// 데모 데이터 생성 함수 (실제 임베드 가능한 건강 영상들)
function getDemoHealthContent(): YouTubeVideo[] {
  const demoVideos: YouTubeVideo[] = [
    {
      id: 'v7AYKMP6rOE', // 실제 재생 가능한 요가 영상
      title: '10 Minute Morning Yoga Flow for Beginners',
      description: 'Start your day with this energizing yoga routine that will wake up your body and mind.',
      thumbnails: {
        default: { url: 'https://i.ytimg.com/vi/v7AYKMP6rOE/default.jpg' },
        medium: { url: 'https://i.ytimg.com/vi/v7AYKMP6rOE/mqdefault.jpg' },
        high: { url: 'https://i.ytimg.com/vi/v7AYKMP6rOE/hqdefault.jpg' }
      },
      channelTitle: 'Yoga with Adriene',
      publishedAt: new Date().toISOString(),
      viewCount: '2400000',
      duration: 'PT10M32S',
      tags: ['yoga', 'morning', 'beginner']
    },
    {
      id: 'XF15n5VndTI', // 실제 재생 가능한 건강 영상
      title: 'Healthy Meal Prep Ideas for Busy Weekdays',
      description: 'Simple and nutritious meal prep recipes that will save you time and keep you healthy.',
      thumbnails: {
        default: { url: 'https://i.ytimg.com/vi/XF15n5VndTI/default.jpg' },
        medium: { url: 'https://i.ytimg.com/vi/XF15n5VndTI/mqdefault.jpg' },
        high: { url: 'https://i.ytimg.com/vi/XF15n5VndTI/hqdefault.jpg' }
      },
      channelTitle: 'Pick Up Limes',
      publishedAt: new Date().toISOString(),
      viewCount: '1500000',
      duration: 'PT15M18S',
      tags: ['meal prep', 'healthy', 'nutrition']
    },
    {
      id: 'inpok4MKVLM', // 실제 재생 가능한 명상 영상
      title: '5 Minute Meditation for Anxiety Relief',
      description: 'Quick meditation to reduce stress and anxiety, perfect for busy schedules.',
      thumbnails: {
        default: { url: 'https://i.ytimg.com/vi/inpok4MKVLM/default.jpg' },
        medium: { url: 'https://i.ytimg.com/vi/inpok4MKVLM/mqdefault.jpg' },
        high: { url: 'https://i.ytimg.com/vi/inpok4MKVLM/hqdefault.jpg' }
      },
      channelTitle: 'Headspace',
      publishedAt: new Date().toISOString(),
      viewCount: '890000',
      duration: 'PT5M45S',
      tags: ['meditation', 'anxiety', 'mindfulness']
    },
    {
      id: '2pLT-olgUJs',
      title: 'HIIT Workout - 20 Minutes Full Body Burn',
      description: 'High-intensity interval training workout that targets your entire body.',
      thumbnails: {
        default: { url: 'https://i.ytimg.com/vi/2pLT-olgUJs/default.jpg' },
        medium: { url: 'https://i.ytimg.com/vi/2pLT-olgUJs/mqdefault.jpg' },
        high: { url: 'https://i.ytimg.com/vi/2pLT-olgUJs/hqdefault.jpg' }
      },
      channelTitle: 'Fitness Blender',
      publishedAt: new Date().toISOString(),
      viewCount: '3200000',
      duration: 'PT20M15S',
      tags: ['HIIT', 'workout', 'fitness']
    },
    {
      id: 'YQampHWGOLE',
      title: 'Sleep Better Tonight: Evening Routine Tips',
      description: 'Evidence-based tips for creating the perfect evening routine for better sleep.',
      thumbnails: {
        default: { url: 'https://i.ytimg.com/vi/YQampHWGOLE/default.jpg' },
        medium: { url: 'https://i.ytimg.com/vi/YQampHWGOLE/mqdefault.jpg' },
        high: { url: 'https://i.ytimg.com/vi/YQampHWGOLE/hqdefault.jpg' }
      },
      channelTitle: 'Matthew Walker',
      publishedAt: new Date().toISOString(),
      viewCount: '1800000',
      duration: 'PT18M42S',
      tags: ['sleep', 'routine', 'health']
    },
    {
      id: 'q-gVHRCOLWM',
      title: 'Building Mental Resilience: Daily Habits',
      description: 'Develop stronger mental health through consistent daily practices.',
      thumbnails: {
        default: { url: 'https://i.ytimg.com/vi/q-gVHRCOLWM/default.jpg' },
        medium: { url: 'https://i.ytimg.com/vi/q-gVHRCOLWM/mqdefault.jpg' },
        high: { url: 'https://i.ytimg.com/vi/q-gVHRCOLWM/hqdefault.jpg' }
      },
      channelTitle: 'BetterHelp',
      publishedAt: new Date().toISOString(),
      viewCount: '1200000',
      duration: 'PT12M30S',
      tags: ['mental health', 'resilience', 'wellness']
    }
  ]
  
  // 랜덤하게 5개 선택
  return demoVideos.sort(() => 0.5 - Math.random()).slice(0, 5)
}