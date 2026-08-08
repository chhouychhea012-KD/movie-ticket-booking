export function getYouTubeVideoId(url?: string | null): string | null {
  if (!url) return null

  try {
    const parsedUrl = new URL(url)
    const hostname = parsedUrl.hostname.replace(/^www\./, '')
    const pathnameParts = parsedUrl.pathname.split('/').filter(Boolean)

    if (hostname === 'youtu.be') {
      return pathnameParts[0] || null
    }

    if (hostname.endsWith('youtube.com') || hostname.endsWith('youtube-nocookie.com')) {
      const queryId = parsedUrl.searchParams.get('v')
      if (queryId) return queryId

      const videoPathIndex = pathnameParts.findIndex((part) =>
        ['embed', 'shorts', 'live'].includes(part)
      )

      if (videoPathIndex >= 0) {
        return pathnameParts[videoPathIndex + 1] || null
      }
    }

    if (hostname.endsWith('universalstudios.com') || hostname.endsWith('universalpictures.com')) {
      const videoPathIndex = pathnameParts.findIndex((part) => part === 'videos')
      const videoId = pathnameParts[videoPathIndex + 1]
      if (videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId)) return videoId
    }
  } catch {
    // Fall through to regex matching for values pasted without a full URL.
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([^&\n?#/]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#/]+)/,
    /(?:universalstudios\.com|universalpictures\.com)\/videos\/([A-Za-z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1]
  }

  return null
}

export function getYouTubeEmbedUrl(url?: string | null): string | null {
  const videoId = getYouTubeVideoId(url)
  if (!videoId) return null

  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
}

export function getYouTubeThumbnailUrl(url?: string | null): string | null {
  const videoId = getYouTubeVideoId(url)
  if (!videoId) return null

  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}
