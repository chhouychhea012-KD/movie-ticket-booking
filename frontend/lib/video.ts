const directVideoExtensions = ['.mp4', '.webm', '.ogg', '.ogv', '.mov', '.m4v']

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

  } catch {
    // Fall through to regex matching for values pasted without a full URL.
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([^&\n?#/]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#/]+)/,
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

  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
}

export function getYouTubeThumbnailUrl(url?: string | null): string | null {
  const videoId = getYouTubeVideoId(url)
  if (!videoId) return null

  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

export function getDirectVideoUrl(url?: string | null): string | null {
  if (!url) return null

  try {
    const parsedUrl = new URL(url)
    const pathname = parsedUrl.pathname.toLowerCase()

    if (directVideoExtensions.some((extension) => pathname.endsWith(extension))) {
      return url
    }
  } catch {
    const cleanUrl = url.split('?')[0].split('#')[0].toLowerCase()
    if (directVideoExtensions.some((extension) => cleanUrl.endsWith(extension))) {
      return url
    }
  }

  return null
}

export function getVideoMimeType(url: string): string {
  const cleanUrl = url.split('?')[0].split('#')[0].toLowerCase()

  if (cleanUrl.endsWith('.webm')) return 'video/webm'
  if (cleanUrl.endsWith('.ogg') || cleanUrl.endsWith('.ogv')) return 'video/ogg'
  if (cleanUrl.endsWith('.mov')) return 'video/quicktime'
  if (cleanUrl.endsWith('.m4v')) return 'video/x-m4v'

  return 'video/mp4'
}
