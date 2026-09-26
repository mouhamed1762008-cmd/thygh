export type MediaType = 'movie' | 'series';

export interface CastMember {
  name: string;
  role: string;
  avatar?: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  duration: string;
  durationSeconds: number;
  description: string;
  thumbnail: string;
  videoUrl: string;
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  tagline: string;
  description: string;
  year: number;
  rating: number; // e.g. 8.8
  ageRating: string; // 'PG-13', 'TV-MA', 'R', etc.
  duration?: string; // e.g. "2h 28m" for movies
  seasonsCount?: number; // for series
  genres: string[];
  backdrop: string;
  poster: string;
  director?: string;
  cast: CastMember[];
  videoUrl: string; // playable direct MP4 or video source
  trailerUrl?: string;
  isTrending?: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isTopRated?: boolean;
  matchScore?: number; // e.g. 98%
  seasons?: Season[];
  featuredColor?: string;
}

export interface WatchProgress {
  mediaId: string;
  currentTime: number;
  duration: number;
  percentage: number;
  lastWatched: string;
  seasonNumber?: number;
  episodeId?: string;
}

export interface LiveProgram {
  id: string;
  title: string;
  startTime: string; // e.g. "19:00"
  endTime: string; // e.g. "20:30"
  durationMinutes: number;
  progressPercent: number; // 0 - 100
  genre: string;
  description: string;
}

export interface LiveChannel {
  id: string;
  channelNumber: number;
  name: string;
  tag: string;
  category: 'Sports' | 'News' | 'Entertainment' | 'Movies' | 'Kids' | 'Sci-Fi';
  logoText: string;
  color: string;
  previewImage: string;
  videoUrl: string;
  viewers: string;
  resolution: string; // "4K 60FPS" | "1080P"
  currentProgram: LiveProgram;
  upcomingPrograms: LiveProgram[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  plan: string;
  joinedDate: string;
  audioLanguage: string;
  subtitleLanguage: string;
  streamQuality: 'Auto 4K HDR' | '1080p Ultra' | '720p HD' | 'Data Saver';
  autoplayNext: boolean;
  soundEffects: boolean;
  notificationsEnabled: boolean;
}

export type PageView =
  | 'onboarding'
  | 'home'
  | 'movies'
  | 'series'
  | 'livetv'
  | 'search'
  | 'profile'
  | 'details'
  | 'player';
