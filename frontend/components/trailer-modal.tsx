'use client'

import { useEffect } from 'react'
import { ExternalLink, Play, X } from 'lucide-react'
import { getDirectVideoUrl, getVideoMimeType, getYouTubeEmbedUrl } from '@/lib/video'

interface TrailerModalProps {
  isOpen: boolean
  onClose: () => void
  trailerUrl: string
  title: string
}

export default function TrailerModal({ isOpen, onClose, trailerUrl, title }: TrailerModalProps) {
  const embedUrl = getYouTubeEmbedUrl(trailerUrl)
  const directVideoUrl = getDirectVideoUrl(trailerUrl)
  const trailerHost = getTrailerHost(trailerUrl)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} trailer`}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/90 p-3 backdrop-blur-xl sm:p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        aria-label="Close trailer"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        className="relative my-8 w-full max-w-5xl overflow-hidden rounded-2xl border border-[#252a32] bg-[#101318] shadow-2xl shadow-black/70"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#252a32] bg-[#14171c] px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e50914]">
              <Play className="h-4 w-4 fill-current text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-white sm:text-lg">{title}</h3>
              <p className="text-xs text-slate-500">Official trailer</p>
            </div>
          </div>
          {trailerUrl && (
            <a
              href={trailerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-[#252a32] px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-[#343a46] hover:text-white"
            >
              Open Link
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        {embedUrl ? (
          <div className="aspect-video bg-black">
            <iframe
              src={embedUrl}
              title={`${title} official trailer`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        ) : directVideoUrl ? (
          <div className="aspect-video bg-black">
            <video
              key={directVideoUrl}
              className="h-full w-full"
              controls
              autoPlay
              playsInline
              preload="metadata"
            >
              <source src={directVideoUrl} type={getVideoMimeType(directVideoUrl)} />
              Your browser does not support this video.
            </video>
          </div>
        ) : (
          <div className="flex min-h-[360px] flex-col items-center justify-center gap-5 bg-black px-6 py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e50914] text-white shadow-lg shadow-[#e50914]/25">
              <Play className="h-7 w-7 fill-current" />
            </div>
            <div className="max-w-md">
              <p className="text-xl font-semibold text-white">Trailer opens on {trailerHost}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                This trailer is hosted on an official studio page, so it will open in a new tab.
              </p>
            </div>
            <a
              href={trailerUrl}
              target="_blank"
              rel="noreferrer"
              className="cinema-button-primary"
            >
              Watch Trailer
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#252a32] bg-[#14171c] px-4 py-3 text-sm text-slate-500 sm:px-6">
          <span className="truncate">{trailerHost}</span>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 font-semibold text-slate-300 transition hover:bg-[#1b1f26] hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function getTrailerHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'official source'
  }
}
