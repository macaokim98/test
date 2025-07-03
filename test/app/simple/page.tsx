export default function Simple() {
  const videoId = 'q-gVHRCOLWM'
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">YouTube 영상 테스트</h1>
      
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg mb-4">테스트 영상</h2>
        
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title="Test Video"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        <p className="mt-4 text-sm text-gray-600">
          Video ID: {videoId}
        </p>
        
        <a 
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          className="inline-block mt-2 text-blue-600 hover:underline"
        >
          YouTube에서 보기
        </a>
      </div>
    </div>
  )
}