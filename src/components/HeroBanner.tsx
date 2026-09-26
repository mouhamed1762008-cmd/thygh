import React, { useState, useEffect } from 'react';
import { Play, Info, Plus, Check, Star, Volume2, VolumeX } from 'lucide-react';
import { MediaItem } from '../types';
import { useApp } from '../context/AppContext';

interface HeroBannerProps {
  featuredItems: MediaItem[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ featuredItems }) => {
  const { playMedia, openDetails, toggleWatchlist, isInWatchlist } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const currentMedia = featuredItems[currentIndex] || featuredItems[0];
  const inWatchlist = currentMedia ? isInWatchlist(currentMedia.id) : false;

  // Auto-rotate every 10s if user doesn't interact
  useEffect(() => {
    if (featuredItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [featuredItems.length]);

  if (!currentMedia) return null;

  return (
    <div className="relative w-full h-[75vh] min-h-[520px] max-h-[780px] overflow-hidden select-none">
      {/* Cinematic Backdrop Image */}
      <div className="absolute inset-0">
        <img
          src={currentMedia.backdrop}
          alt={currentMedia.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-all duration-1000 transform scale-100"
        />
        {/* Multilayer Glass Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-[#06080F]/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080F] via-[#06080F]/80 to-transparent max-w-4xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(99,102,241,0.15),transparent_60%)]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 md:px-8 flex flex-col justify-end pb-14 sm:pb-16">
        <div className="max-w-2xl space-y-4">
          {/* Tagline / Subtitle */}
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-cyan-300 font-medium tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Featured Premiere</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono text-slate-300">{currentMedia.type === 'series' ? 'Original Series' : '4K Ultra Movie'}</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] text-balance drop-shadow-lg">
            {currentMedia.title}
          </h1>

          {/* Metadata Row (Zero-pill discipline) */}
          <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1 font-mono text-amber-300 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              {currentMedia.rating.toFixed(1)} / 10
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{currentMedia.year}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 font-medium font-mono">{currentMedia.matchScore}% Match</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{currentMedia.genres.join(', ')}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="border border-white/20 px-1.5 py-0.5 rounded text-[11px] font-mono">
              {currentMedia.ageRating}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300/90 line-clamp-3 leading-relaxed max-w-xl">
            {currentMedia.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center flex-wrap gap-3 pt-2">
            <button
              onClick={() => playMedia(currentMedia)}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-semibold text-sm flex items-center gap-2.5 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Now</span>
            </button>

            <button
              onClick={() => openDetails(currentMedia)}
              className="py-3 px-5 rounded-xl glass-panel border border-white/15 hover:border-white/30 text-white font-medium text-sm flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
            >
              <Info className="w-4 h-4" />
              <span>More Info</span>
            </button>

            <button
              onClick={() => toggleWatchlist(currentMedia.id)}
              className={`p-3 rounded-xl border backdrop-blur-md transition-all cursor-pointer active:scale-95 ${
                inWatchlist
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                  : 'glass-panel text-white border-white/15 hover:bg-white/10'
              }`}
              title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            >
              {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Ambient Bottom Right Indicators / Switcher */}
        <div className="absolute right-4 md:right-8 bottom-14 flex items-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-full glass-panel border border-white/15 text-slate-300 hover:text-white transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Carousel Slide Dots */}
          {featuredItems.length > 1 && (
            <div className="flex items-center gap-1.5 p-1 rounded-full glass-panel border border-white/10">
              {featuredItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 bg-gradient-to-r from-indigo-500 to-cyan-400'
                      : 'w-1.5 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
