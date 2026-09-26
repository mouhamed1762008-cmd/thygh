import React, { useState, useMemo } from 'react';
import { ALL_MEDIA } from '../data/mockData';
import { MediaCard } from '../components/MediaCard';
import { HeroBanner } from '../components/HeroBanner';
import { Clapperboard, Filter, SlidersHorizontal } from 'lucide-react';

export const SeriesPage: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'seasons' | 'title'>('rating');

  const allSeries = useMemo(() => ALL_MEDIA.filter((m) => m.type === 'series'), []);
  const featuredSeries = useMemo(() => allSeries.filter((m) => m.isFeatured), [allSeries]);

  const genres = ['All', 'Cyberpunk', 'Fantasy', 'Sci-Fi', 'Action', 'Thriller', 'Psychological', 'Drama'];

  const filteredSeries = useMemo(() => {
    return allSeries
      .filter((s) => {
        return selectedGenre === 'All' || s.genres.includes(selectedGenre);
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'seasons') return (b.seasonsCount || 1) - (a.seasonsCount || 1);
        return a.title.localeCompare(b.title);
      });
  }, [allSeries, selectedGenre, sortBy]);

  return (
    <div className="min-h-screen pb-24">
      {/* Featured Series Hero Banner */}
      <HeroBanner featuredItems={featuredSeries} />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Clapperboard className="w-4 h-4" />
              <span>Original Series & Multi-Seasons</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Binge-Worthy TV Series
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Immerse yourself in serialized storytelling, rich character arcs, and multi-season universes.
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl glass-panel border border-white/10 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400 ml-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-200 py-1 px-2.5 rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="rating" className="bg-[#090D1A] text-white">Highest Rated</option>
                <option value="seasons" className="bg-[#090D1A] text-white">Most Seasons</option>
                <option value="title" className="bg-[#090D1A] text-white">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Genre Categories */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-4 my-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-none ml-1 mr-1" />
          {genres.map((genre) => {
            const isSelected = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/20'
                    : 'glass-panel text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>

        {/* Series Poster Grid */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-400">
              Showing <strong className="text-white font-mono">{filteredSeries.length}</strong> series
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {filteredSeries.map((series) => (
              <div key={series.id} className="flex justify-center">
                <MediaCard media={series} aspectRatio="poster" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
