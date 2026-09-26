import React, { useState, useMemo } from 'react';
import {
  User,
  Settings,
  Shield,
  Film,
  Clapperboard,
  Heart,
  Bookmark,
  Clock,
  Sparkles,
  LogOut,
  Edit3,
  Check,
  Globe,
  Sliders,
  Bell,
  Trash2,
  Play,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_MEDIA, AVATAR_OPTIONS } from '../data/mockData';
import { MediaCard } from '../components/MediaCard';

export const ProfilePage: React.FC = () => {
  const {
    user,
    updateUser,
    watchlist,
    toggleWatchlist,
    favorites,
    continueWatching,
    playMedia,
    logout,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'watchlist' | 'favorites' | 'history' | 'settings'>('overview');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  // Resolved media items
  const watchlistItems = useMemo(
    () => ALL_MEDIA.filter((m) => watchlist.includes(m.id)),
    [watchlist]
  );

  const favoriteMovies = useMemo(
    () => ALL_MEDIA.filter((m) => favorites.includes(m.id) && m.type === 'movie'),
    [favorites]
  );

  const favoriteSeries = useMemo(
    () => ALL_MEDIA.filter((m) => favorites.includes(m.id) && m.type === 'series'),
    [favorites]
  );

  const continueWatchingItems = useMemo(
    () =>
      continueWatching
        .map((cw) => {
          const item = ALL_MEDIA.find((m) => m.id === cw.mediaId);
          return item ? { ...item, progress: cw.percentage, lastWatched: cw.lastWatched } : null;
        })
        .filter(Boolean) as (typeof ALL_MEDIA[0] & { progress: number; lastWatched: string })[],
    [continueWatching]
  );

  const handleSaveName = () => {
    if (newName.trim()) {
      updateUser({ name: newName.trim() });
    }
    setIsEditingName(false);
  };

  return (
    <div className="min-h-screen pb-28 pt-4 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Profile Header Hero Card */}
      <div className="relative rounded-3xl overflow-hidden glass-panel-glow border border-white/[0.12] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {/* Avatar with Edit Overlay */}
            <div className="relative group">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-indigo-500/40 shadow-2xl"
              />
              <button
                onClick={() => setIsAvatarPickerOpen(true)}
                className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-white text-[11px] font-medium"
              >
                <Edit3 className="w-5 h-5 mb-1 text-cyan-300" />
                <span>Change</span>
              </button>
            </div>

            {/* Name, Moniker, Subscription info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="px-3 py-1.5 rounded-xl glass-input text-white text-lg font-bold focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                      {user.name}
                    </h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Edit Name"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center flex-wrap gap-2 text-xs text-slate-300 justify-center sm:justify-start">
                <span className="text-cyan-400 font-mono font-medium">{user.plan}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400">Member since {user.joinedDate}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-emerald-400 font-mono">Active VIP</span>
              </div>

              {/* Badges strip (unboxed text) */}
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-1 justify-center sm:justify-start">
                <span className="flex items-center gap-1 text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5" /> 4K HDR Atmos
                </span>
                <span aria-hidden="true" className="text-slate-700">|</span>
                <span className="flex items-center gap-1 text-cyan-300">
                  <Zap className="w-3.5 h-3.5" /> High-Bitrate Direct
                </span>
                <span aria-hidden="true" className="text-slate-700">|</span>
                <span className="flex items-center gap-1 text-violet-300">
                  <Shield className="w-3.5 h-3.5" /> Unlimited Streams
                </span>
              </div>
            </div>
          </div>

          {/* Quick Sign Out Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="py-2.5 px-4 rounded-xl glass-panel border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/50 transition-all text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Switch Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      {isAvatarPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl glass-panel-glow border border-white/20 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Choose Profile Persona</h3>
              <button
                onClick={() => setIsAvatarPickerOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => {
                    updateUser({ avatar: av.url });
                    setIsAvatarPickerOpen(false);
                  }}
                  className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                    user.avatar === av.url ? 'border-cyan-400 scale-105' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img src={av.url} alt={av.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1 text-[10px] text-center text-slate-200 truncate">
                    {av.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1 overflow-x-auto no-scrollbar">
        {[
          { key: 'overview', label: 'Dashboard Overview', icon: <User className="w-4 h-4" /> },
          { key: 'watchlist', label: `My Watchlist (${watchlistItems.length})`, icon: <Bookmark className="w-4 h-4" /> },
          { key: 'favorites', label: `Favorites (${favoriteMovies.length + favoriteSeries.length})`, icon: <Heart className="w-4 h-4" /> },
          { key: 'history', label: `History (${continueWatchingItems.length})`, icon: <Clock className="w-4 h-4" /> },
          { key: 'settings', label: 'Preferences & Audio', icon: <Settings className="w-4 h-4" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold whitespace-nowrap rounded-t-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-white border-b-2 border-cyan-400 bg-white/[0.04]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Subscription & Device Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl glass-panel border border-white/[0.08] space-y-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Subscription Tier</span>
              <h4 className="text-base font-bold text-white">{user.plan}</h4>
              <p className="text-xs text-slate-400">Next billing on October 28, 2026 · $19.99/mo</p>
              <div className="pt-2">
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  4K HDR + Dolby Atmos Enabled
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-white/[0.08] space-y-2">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Streaming Bitrate</span>
              <h4 className="text-base font-bold text-white">{user.streamQuality}</h4>
              <p className="text-xs text-slate-400">Adaptive HEVC 10-bit color depth with spatial audio</p>
              <div className="pt-2">
                <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  Zero Buffering Engine
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-white/[0.08] space-y-2">
              <span className="text-xs font-mono text-violet-400 uppercase tracking-wider">Language Defaults</span>
              <h4 className="text-base font-bold text-white truncate">{user.audioLanguage}</h4>
              <p className="text-xs text-slate-400">Subtitles: {user.subtitleLanguage}</p>
              <div className="pt-2">
                <span className="text-[11px] font-mono text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                  Multi-Channel Audio Sync
                </span>
              </div>
            </div>
          </div>

          {/* Continue Watching Section */}
          {continueWatchingItems.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Continue Watching
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {continueWatchingItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => playMedia(item)}
                    className="p-3 rounded-2xl glass-panel border border-white/[0.08] hover:border-indigo-500/40 transition-all cursor-pointer group flex gap-3"
                  >
                    <div className="w-24 h-16 rounded-xl overflow-hidden flex-none relative bg-black">
                      <img
                        src={item.backdrop || item.poster}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-5 h-5 text-white fill-white opacity-80 group-hover:opacity-100" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 truncate">
                          {item.title}
                        </h4>
                        <span className="text-[11px] text-slate-400">{item.lastWatched}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                          <span>{item.progress}% watched</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Watchlist Quick Strip */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-cyan-400" />
                Saved to Watchlist ({watchlistItems.length})
              </h3>
              <button
                onClick={() => setActiveTab('watchlist')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
              >
                View all →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {watchlistItems.slice(0, 6).map((item) => (
                <MediaCard key={item.id} media={item} aspectRatio="poster" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Watchlist */}
      {activeTab === 'watchlist' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Your Curated Watchlist</h3>
            <span className="text-xs text-slate-400 font-mono">{watchlistItems.length} titles</span>
          </div>

          {watchlistItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {watchlistItems.map((item) => (
                <div key={item.id} className="relative group">
                  <MediaCard media={item} aspectRatio="poster" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-3xl glass-panel border border-white/10 space-y-3">
              <Bookmark className="w-10 h-10 text-slate-500 mx-auto" />
              <h4 className="text-base font-semibold text-white">Your Watchlist is empty</h4>
              <p className="text-xs text-slate-400">Click &quot;+ Add to Watchlist&quot; on any movie or series to save for later.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-8">
          {/* Favorite Movies */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-indigo-400" />
              Favorite Movies ({favoriteMovies.length})
            </h3>
            {favoriteMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {favoriteMovies.map((item) => (
                  <MediaCard key={item.id} media={item} aspectRatio="poster" />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 glass-panel rounded-2xl p-4">No favorite movies marked yet.</p>
            )}
          </div>

          {/* Favorite Series */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Clapperboard className="w-4 h-4 text-violet-400" />
              Favorite Series ({favoriteSeries.length})
            </h3>
            {favoriteSeries.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {favoriteSeries.map((item) => (
                  <MediaCard key={item.id} media={item} aspectRatio="poster" />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 glass-panel rounded-2xl p-4">No favorite series marked yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Recently Watched Activity</h3>
          <div className="space-y-3">
            {continueWatchingItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl glass-panel border border-white/[0.08] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.poster}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-16 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.genres.join(', ')} · {item.year}</p>
                    <span className="text-[11px] font-mono text-cyan-400">{item.progress}% completed · {item.lastWatched}</span>
                  </div>
                </div>

                <button
                  onClick={() => playMedia(item)}
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Resume</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-3xl">
          {/* Playback Settings Card */}
          <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Streaming & Video Quality
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-200">Default Playback Quality</p>
                  <p className="text-slate-400 text-xs">Automatically scales according to network throughput.</p>
                </div>
                <select
                  value={user.streamQuality}
                  onChange={(e) => updateUser({ streamQuality: e.target.value as any })}
                  className="py-2 px-3 rounded-xl bg-[#090D1A] border border-white/10 text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="Auto 4K HDR">Auto 4K HDR (Recommended)</option>
                  <option value="1080p Ultra">1080p Ultra HD</option>
                  <option value="720p HD">720p HD</option>
                  <option value="Data Saver">Data Saver (Mobile Friendly)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                <div>
                  <p className="text-sm font-semibold text-slate-200">Autoplay Next Episode</p>
                  <p className="text-slate-400 text-xs">Immediately start the next chapter when series finishes.</p>
                </div>
                <button
                  onClick={() => updateUser({ autoplayNext: !user.autoplayNext })}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    user.autoplayNext ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                      user.autoplayNext ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Audio & Subtitle Language Card */}
          <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              Language & Spatial Audio
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Preferred Audio Track</label>
                <select
                  value={user.audioLanguage}
                  onChange={(e) => updateUser({ audioLanguage: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#090D1A] border border-white/10 text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="English [Dolby Atmos 7.1]">English [Dolby Atmos 7.1]</option>
                  <option value="English [Stereo Lossless]">English [Stereo Lossless]</option>
                  <option value="French [Dolby Audio]">French [Dolby Audio]</option>
                  <option value="Spanish [5.1 Surround]">Spanish [5.1 Surround]</option>
                  <option value="Japanese [Original + CC]">Japanese [Original + CC]</option>
                  <option value="Director's Commentary">Director&apos;s Commentary Track</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-2">Default Subtitles</label>
                <select
                  value={user.subtitleLanguage}
                  onChange={(e) => updateUser({ subtitleLanguage: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#090D1A] border border-white/10 text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="English [CC]">English [Closed Captions]</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Off">Subtitles Off</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-violet-400" />
              Notification Alerts
            </h3>
            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="text-sm font-semibold text-slate-200">New Releases & Watchlist Updates</p>
                <p className="text-slate-400 text-xs">Receive alerts when saved titles premiere or air live.</p>
              </div>
              <button
                onClick={() => updateUser({ notificationsEnabled: !user.notificationsEnabled })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  user.notificationsEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                    user.notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
