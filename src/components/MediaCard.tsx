import React, { useState } from 'react';
import { Play, Plus, Check, Info, Heart, Star, Film } from 'lucide-react';
import { MediaItem } from '../types';
import { useApp } from '../context/AppContext';

interface MediaCardProps {
  media: MediaItem;
  aspectRatio?: 'poster' | 'landscape';
  showProgress?: boolean;
  progressPercent?: number;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  media,
  aspectRatio = 'poster',
  showProgress = false,
  progressPercent = 0,
}) => {
  const { playMedia, openDetails, toggleWatchlist, isInWatchlist, toggleFavorite, isFavorite } = useApp();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const inWatchlist = isInWatchlist(media.id);
  const inFavorites = isFavorite(media.id);

  const imageSrc = aspectRatio === 'landscape' && media.backdrop ? media.backdrop : media.poster;

  return (
    <div
      className="group relative flex-none transition-all duration-300 ease-out cursor-pointer select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: aspectRatio === 'poster' ? '180px' : '280px',
      }}
    >
      {/* Outer Card Container with Glass Border & Glow */}
      <div
        className="relative overflow-hidden rounded-2xl glass-panel-subtle border border-white/[0.08] transition-all duration-300 group-hover:border-indigo-500/40 group-hover:shadow-[0_12px_30px_-5px_rgba(99,102,241,0.25)] group-hover:-translate-y-1.5"
        style={{
          aspectRatio: aspectRatio === 'poster' ? '2/3' : '16/9',
        }}
      >
        {/* Background Image / Fallback */}
        {!imageError ? (
          <img
            src={imageSrc}
            alt={media.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-4 text-center">
            <Film className="w-8 h-8 text-indigo-400 mb-2 opacity-60" />
            <span className="text-xs font-semibold text-slate-300 line-clamp-2">{media.title}</span>
          </div>
        )}

        {/* Ambient Dark Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-black/30 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />

        {/* Top Badges (Resolution / Top Rated) */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-white/90">
          <span className="font-mono px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-md border border-white/10">
            {media.type === 'series' ? `${media.seasonsCount} Seasons` : media.duration || '4K'}
          </span>
          {media.isTopRated && (
            <span className="flex items-center gap-1 font-mono text-amber-300 bg-amber-950/50 backdrop-blur-md px-1.5 py-0.5 rounded border border-amber-500/20">
              <Star className="w-2.5 h-2.5 fill-amber-300" />
              {media.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Continue Watching Progress Bar */}
        {showProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(5, progressPercent))}%` }}
            />
          </div>
        )}

        {/* Hover Action Overlay */}
        <div
          className={`absolute inset-0 p-3 flex flex-col justify-end transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Action Button Row */}
          <div className="flex items-center gap-1.5 mb-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                playMedia(media);
              }}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
              aria-label={`Play ${media.title}`}
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Play</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWatchlist(media.id);
              }}
              className={`p-1.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer active:scale-95 ${
                inWatchlist
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                  : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
              }`}
              title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              aria-label="Toggle Watchlist"
            >
              {inWatchlist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(media.id);
              }}
              className={`p-1.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer active:scale-95 ${
                inFavorites
                  ? 'bg-rose-500/20 text-rose-400 border-rose-400/40'
                  : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
              }`}
              title={inFavorites ? 'Remove Favorite' : 'Favorite'}
              aria-label="Toggle Favorite"
            >
              <Heart className={`w-3.5 h-3.5 ${inFavorites ? 'fill-rose-400' : ''}`} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openDetails(media);
              }}
              className="p-1.5 rounded-xl bg-white/10 text-white border border-white/15 hover:bg-white/20 backdrop-blur-md transition-all cursor-pointer active:scale-95"
              title="More Details"
              aria-label="View Details"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Info Below Poster (Clean unboxed metadata, zero-pill discipline) */}
      <div className="mt-2.5 px-0.5" onClick={() => openDetails(media)}>
        <h4 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
          {media.title}
        </h4>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1 truncate">
          <span>{media.year}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{media.genres[0]}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-0.5 text-amber-300/90 font-mono">
            <Star className="w-2.5 h-2.5 fill-amber-300" />
            {media.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};
