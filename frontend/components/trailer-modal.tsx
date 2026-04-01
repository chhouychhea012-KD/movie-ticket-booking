'use client'

import { useState, useEffect } from 'react'
import { X, Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCcw, SkipForward, SkipBack } from 'lucide-react'

interface TrailerModalProps {
  isOpen: boolean
  onClose: () => void
  trailerUrl: string
  title: string
}

export default function TrailerModal({ isOpen, onClose, trailerUrl, title }: TrailerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  
  // Extract YouTube video ID from various URL formats
  const getYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) return match[1]
    }
    return null
  }

  const videoId = getYouTubeId(trailerUrl)
  
  // Simulated progress for demo
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && isOpen) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false)
            return 100
          }
          return prev + 0.5
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying, isOpen])

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false)
      setProgress(0)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!isOpen || !videoId) return null

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-current" />
            </div>
            <h3 className="text-white font-semibold text-lg">{title}</h3>
          </div>
          <span className="text-slate-400 text-sm">Official Trailer</span>
        </div>

        {/* Video Container */}
        <div className="relative aspect-video bg-black group">
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-6 py-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Progress Bar */}
            <div className="relative mb-3 h-1 bg-slate-700 rounded-full cursor-pointer">
              <div 
                className="absolute h-full bg-orange-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
              <div 
                className="absolute h-3 w-3 bg-white rounded-full -top-1 shadow-lg"
                style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <button className="text-white/80 hover:text-white transition-colors">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button className="text-white/80 hover:text-white transition-colors">
                  <SkipForward className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <span className="text-white/80 text-sm">0:00 / 2:30</span>
              </div>
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-white/80 hover:text-white transition-colors"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/30 border-t border-slate-700/50">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-all text-sm">
              <RotateCcw className="w-4 h-4" />
              Replay
            </button>
          </div>
          <div className="text-slate-400 text-sm">
            Watch on YouTube
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        div[role="dialog"] {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}