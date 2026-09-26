import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MediaItem,
  LiveChannel,
  UserProfile,
  PageView,
  WatchProgress,
  Episode,
} from '../types';
import {
  ALL_MEDIA,
  LIVE_CHANNELS,
  INITIAL_USER,
  INITIAL_CONTINUE_WATCHING,
} from '../data/mockData';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  mediaId?: string;
}

interface AppContextType {
  currentPage: PageView;
  user: UserProfile;
  hasCompletedOnboarding: boolean;
  selectedMedia: MediaItem | null;
  activePlayerMedia: MediaItem | null;
  activeEpisode: Episode | null;
  activeLiveChannel: LiveChannel | null;
  watchlist: string[];
  favorites: string[];
  continueWatching: WatchProgress[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  searchQuery: string;
  genreFilter: string;
  setSearchQuery: (query: string) => void;
  setGenreFilter: (genre: string) => void;
  navigateTo: (page: PageView, media?: MediaItem, episode?: Episode, channel?: LiveChannel) => void;
  playMedia: (media: MediaItem, episode?: Episode) => void;
  openDetails: (media: MediaItem) => void;
  openLiveChannel: (channel: LiveChannel) => void;
  toggleWatchlist: (mediaId: string) => void;
  isInWatchlist: (mediaId: string) => boolean;
  toggleFavorite: (mediaId: string) => void;
  isFavorite: (mediaId: string) => boolean;
  updateProgress: (mediaId: string, currentTime: number, duration: number, episodeId?: string) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  completeOnboarding: (userName: string, avatarUrl?: string) => void;
  markNotificationsAsRead: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_USER = 'aether_user_v1';
const LOCAL_STORAGE_KEY_WATCHLIST = 'aether_watchlist_v1';
const LOCAL_STORAGE_KEY_FAVORITES = 'aether_favorites_v1';
const LOCAL_STORAGE_KEY_PROGRESS = 'aether_progress_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('aether_onboarded_v1');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [currentPage, setCurrentPage] = useState<PageView>(() => {
    try {
      const saved = localStorage.getItem('aether_onboarded_v1');
      return saved === 'true' ? 'home' : 'onboarding';
    } catch {
      return 'onboarding';
    }
  });

  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(ALL_MEDIA[0]);
  const [activePlayerMedia, setActivePlayerMedia] = useState<MediaItem | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [activeLiveChannel, setActiveLiveChannel] = useState<LiveChannel | null>(LIVE_CHANNELS[0]);

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_WATCHLIST);
      return saved ? JSON.parse(saved) : ['m-chronos', 's-cyberpulse', 'm-aurora-borealis'];
    } catch {
      return ['m-chronos', 's-cyberpulse'];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_FAVORITES);
      return saved ? JSON.parse(saved) : ['m-chronos', 's-astral-forge'];
    } catch {
      return ['m-chronos'];
    }
  });

  const [continueWatching, setContinueWatching] = useState<WatchProgress[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PROGRESS);
      return saved ? JSON.parse(saved) : INITIAL_CONTINUE_WATCHING;
    } catch {
      return INITIAL_CONTINUE_WATCHING;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'New 4K Release Available',
      message: 'Aether: Chronos Odyssey is now streaming in IMAX Enhanced format.',
      time: '10m ago',
      unread: true,
      mediaId: 'm-chronos',
    },
    {
      id: 'notif-2',
      title: 'Live Grand Prix Tonight',
      message: 'Hyperion Grand Prix final round is starting on Pulse Sports Ultra.',
      time: '1h ago',
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'Season 2 Premiere',
      message: 'New episodes of Cyberpulse: Tokyo 2099 are now available in your queue.',
      time: '3h ago',
      unread: false,
      mediaId: 's-cyberpulse',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_WATCHLIST, JSON.stringify(watchlist));
    } catch {
      // ignore
    }
  }, [watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROGRESS, JSON.stringify(continueWatching));
    } catch {
      // ignore
    }
  }, [continueWatching]);

  const navigateTo = (
    page: PageView,
    media?: MediaItem,
    episode?: Episode,
    channel?: LiveChannel
  ) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (media) setSelectedMedia(media);
    if (episode) setActiveEpisode(episode);
    if (channel) setActiveLiveChannel(channel);
    setCurrentPage(page);
  };

  const playMedia = (media: MediaItem, episode?: Episode) => {
    setActivePlayerMedia(media);
    setActiveEpisode(episode || null);
    setCurrentPage('player');
  };

  const openDetails = (media: MediaItem) => {
    setSelectedMedia(media);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLiveChannel = (channel: LiveChannel) => {
    setActiveLiveChannel(channel);
    setCurrentPage('livetv');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleWatchlist = (mediaId: string) => {
    setWatchlist((prev) =>
      prev.includes(mediaId) ? prev.filter((id) => id !== mediaId) : [...prev, mediaId]
    );
  };

  const isInWatchlist = (mediaId: string) => watchlist.includes(mediaId);

  const toggleFavorite = (mediaId: string) => {
    setFavorites((prev) =>
      prev.includes(mediaId) ? prev.filter((id) => id !== mediaId) : [...prev, mediaId]
    );
  };

  const isFavorite = (mediaId: string) => favorites.includes(mediaId);

  const updateProgress = (
    mediaId: string,
    currentTime: number,
    duration: number,
    episodeId?: string
  ) => {
    if (!duration || duration <= 0) return;
    const percentage = Math.round((currentTime / duration) * 100);
    setContinueWatching((prev) => {
      const filtered = prev.filter((p) => p.mediaId !== mediaId);
      return [
        {
          mediaId,
          currentTime,
          duration,
          percentage,
          lastWatched: 'Just now',
          episodeId,
        },
        ...filtered,
      ].slice(0, 10);
    });
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const completeOnboarding = (userName: string, avatarUrl?: string) => {
    const finalName = userName.trim() || 'Cosmic Traveler';
    setUser((prev) => ({
      ...prev,
      name: finalName,
      avatar: avatarUrl || prev.avatar,
    }));
    setHasCompletedOnboarding(true);
    try {
      localStorage.setItem('aether_onboarded_v1', 'true');
    } catch {
      // ignore
    }
    setCurrentPage('home');
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const logout = () => {
    setHasCompletedOnboarding(false);
    try {
      localStorage.removeItem('aether_onboarded_v1');
    } catch {
      // ignore
    }
    setCurrentPage('onboarding');
  };

  const unreadNotificationCount = notifications.filter((n) => n.unread).length;

  return (
    <AppContext.Provider
      value={{
        currentPage,
        user,
        hasCompletedOnboarding,
        selectedMedia,
        activePlayerMedia,
        activeEpisode,
        activeLiveChannel,
        watchlist,
        favorites,
        continueWatching,
        notifications,
        unreadNotificationCount,
        searchQuery,
        genreFilter,
        setSearchQuery,
        setGenreFilter,
        navigateTo,
        playMedia,
        openDetails,
        openLiveChannel,
        toggleWatchlist,
        isInWatchlist,
        toggleFavorite,
        isFavorite,
        updateProgress,
        updateUser,
        completeOnboarding,
        markNotificationsAsRead,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
