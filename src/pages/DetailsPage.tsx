import React, { useState } from 'react';
import {
  Play,
  Plus,
  Check,
  Share2,
  Clapperboard,
  Star,
  Clock,
  ArrowLeft,
  Sparkles,
  Heart,
  Volume2,
  Film,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_MEDIA } from '../data/mockData';
import { MediaCard } from '../components/MediaCard';
import { Episode } from '../types';

export const DetailsPage: React.FC = () => {
  const {
    selectedMedia,
    playMedia,
    navigateTo,
    toggleWatchlist,
    isInWatchlist,
    toggleFavorite,
    isFavorite,
  } = useApp();

  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [shareCopied, setShareCopied] = useState(false);

  // If no media is selected, fallback to first
  const media = selectedMedia || ALL_MEDIA[0];
  const inWatchlist = isInWatchlist(media.id);
  const inFavorites = isFavorite(media.id);

  // Find related titles with overlapping genres
  const relatedTitles = ALL_MEDIA.filter(
    (item) => item.id !== media.id && item.genres.some((g) => media.genres.includes(g))
  ).slice(0, 6);

  const currentSeasonData = media.seasons?.find((s) => s.seasonNumber === selectedSeason) || media.seasons?.[0];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  return (
    <div className="relative min-h-screen pb-28 select-none">
      {/* Back Button */}
      <button
        onClick={() => navigateTo('home')}
        className="fixed top-20 left-4 md:left-8 z-30 p-2.5 rounded-full glass-panel-glow border border-white/20 text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xl flex items-center gap-2 text-xs font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back</span>
      </button>

      {/* Cinematic Hero Backdrop */}
      <div className="relative w-full h-[65vh] min-h-[480px] max-h-[700px] overflow-hidden">
        <img
          src={media.backdrop}
          alt={media.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        {/* Multilayer Dark Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-[#06080F]/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080F] via-[#06080F]/80 to-transparent max-w-4xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(99,102,241,0.2),transparent_70%)]" />
      </div>

      {/* Main Details Body */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-44 relative z-10 space-y-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Large Vertical Poster Card */}
          <div className="w-48 sm:w-60 md:w-64 flex-none rounded-2xl overflow-hidden glass-panel-glow border border-white/20 shadow-2xl">
            <img
              src={media.poster}
              alt={media.title}
              referrerPolicy="no-referrer"
              className="w-full aspect-[2/3] object-cover"
            />
          </div>

          {/* Title & Metadata Column */}
          <div className="flex-1 space-y-5">
            {/* Tagline / Kicker */}
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{media.type === 'series' ? 'Original Television Series' : 'Cinematic Release'}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400">{media.matchScore}% Match for you</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              {media.title}
            </h1>

            {/* Unboxed Metadata Strip (Zero-pill discipline) */}
            <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1 font-mono text-amber-300 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                {media.rating.toFixed(1)} / 10
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{media.year}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{media.type === 'series' ? `${media.seasonsCount} Seasons` : media.duration}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{media.genres.join(', ')}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="border border-white/20 px-1.5 py-0.5 rounded text-[11px] font-mono">
                {media.ageRating}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-cyan-400 font-mono text-xs">Dolby Vision · 4K HDR</span>
            </div>

            {/* Tagline */}
            {media.tagline && (
              <p className="text-sm italic font-serif text-slate-300">
                &ldquo;{media.tagline}&rdquo;
              </p>
            )}

            {/* Synopsis Description */}
            <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-3xl">
              {media.description}
            </p>

            {/* Director & Creator */}
            {media.director && (
              <div className="text-xs text-slate-400">
                <span className="text-slate-500">Directed by:</span>{' '}
                <strong className="text-white font-medium">{media.director}</strong>
              </div>
            )}

            {/* Interactive Primary Action Buttons */}
            <div className="flex items-center flex-wrap gap-3 pt-3">
              <button
                onClick={() => playMedia(media)}
                className="py-3.5 px-7 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-semibold text-sm flex items-center gap-2.5 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Now</span>
              </button>

              {media.trailerUrl && (
                <button
                  onClick={() => playMedia({ ...media, videoUrl: media.trailerUrl || media.videoUrl })}
                  className="py-3.5 px-5 rounded-xl glass-panel border border-white/15 hover:border-white/30 text-white font-medium text-sm flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
                >
                  <Clapperboard className="w-4 h-4 text-cyan-400" />
                  <span>Official Trailer</span>
                </button>
              )}

              <button
                onClick={() => toggleWatchlist(media.id)}
                className={`p-3.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer active:scale-95 ${
                  inWatchlist
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                    : 'glass-panel text-white border-white/15 hover:bg-white/10'
                }`}
                title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>

              <button
                onClick={() => toggleFavorite(media.id)}
                className={`p-3.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer active:scale-95 ${
                  inFavorites
                    ? 'bg-rose-500/20 text-rose-400 border-rose-400/40'
                    : 'glass-panel text-white border-white/15 hover:bg-white/10'
                }`}
                title="Favorite"
              >
                <Heart className={`w-4 h-4 ${inFavorites ? 'fill-rose-400' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="relative p-3.5 rounded-xl glass-panel text-white border-white/15 hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
                {shareCopied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-cyan-500 text-black text-[10px] font-bold whitespace-nowrap animate-in fade-in">
                    Link Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Cast & Crew Section */}
        {media.cast && media.cast.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-white/[0.08]">
            <h3 className="font-display text-lg sm:text-xl font-bold text-white">
              Starring Cast
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {media.cast.map((actor, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl glass-panel border border-white/[0.06] flex items-center gap-3"
                >
                  <img
                    src={actor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={actor.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/15"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate">{actor.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{actor.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* For TV Series: Seasons and Episode List */}
        {media.type === 'series' && media.seasons && (
          <div className="space-y-6 pt-6 border-t border-white/[0.08]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-violet-400" />
                Episodes & Chapters
              </h3>

              {/* Season Selector Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-xl glass-panel border border-white/10 text-xs">
                {media.seasons.map((season) => (
                  <button
                    key={season.seasonNumber}
                    onClick={() => setSelectedSeason(season.seasonNumber)}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      selectedSeason === season.seasonNumber
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Season {season.seasonNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Episodes List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSeasonData?.episodes.map((ep: Episode) => (
                <div
                  key={ep.id}
                  onClick={() => playMedia(media, ep)}
                  className="p-3.5 rounded-2xl glass-panel border border-white/[0.08] hover:border-violet-500/40 transition-all cursor-pointer group flex gap-3.5 hover:-translate-y-0.5"
                >
                  <div className="relative w-32 sm:w-36 aspect-video rounded-xl overflow-hidden flex-none bg-black">
                    <img
                      src={ep.thumbnail}
                      alt={ep.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                    </div>
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-200">
                      {ep.duration}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-mono">
                        <span>Episode {ep.episodeNumber}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {ep.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {ep.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Titles Section */}
        {relatedTitles.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-white/[0.08]">
            <h3 className="font-display text-xl font-bold text-white">
              More Titles Like This
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedTitles.map((item) => (
                <MediaCard key={item.id} media={item} aspectRatio="poster" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
