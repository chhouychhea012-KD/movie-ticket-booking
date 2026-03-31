// Legacy types for backwards compatibility - use types/index.ts for new code
import { Movie as NewMovie } from './index'

// This is a simplified version that maps to the new types
export type Movie = NewMovie
export type MovieFilter = {
  genre?: string[]
  language?: string
  rating?: number
  status?: 'now_showing' | 'coming_soon' | 'ended'
  date?: string
}
