import React, { useState, useMemo } from 'react';
import { ALL_MEDIA } from '../data/mockData';
import { MediaCard } from '../components/MediaCard';
import { HeroBanner } from '../components/HeroBanner';
import { Filter, SlidersHorizontal, Film } from 'lucide-react';

export const MoviesPage: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'title'>('rating');

  const allMovies = useMemo(() => ALL_MEDIA.filter((m) => m.type === 'movie'), []);
  const featuredMovies = useMemo(() => allMovies.filter((m) => m.isFeatured || m.isTopRated).slice(0, 3), [allMovies]);

  const genres = ['All', 'Sci-Fi', 'Action', 'Thriller', 'Mystery', 'Adventure', 'Drama', 'Documentary'];
  const years = ['All', '2025', '2024'];

  const filteredMovies = useMemo(() => {
    return allMovies
      .filter((movie) => {
        const matchesGenre = selectedGenre === 'All' || movie.genres.includes(selectedGenre);
        const matchesYear = selectedYear === 'All' || movie.year.toString() === selectedYear;
        return matchesGenre && matchesYear;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return b.year - a.year;
        return a.title.localeCompare(b.title);
      });
  }, [allMovies, selectedGenre, selectedYear, sortBy]);

  return (
    <div className="min-h-screen pb-24">
      {/* Featured Movie Hero Banner */}
      <HeroBanner featuredItems={featuredMovies} />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        {/* Page Title & Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Film className="w-4 h-4" />
              <span>Cinema Vault</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Feature Films & Premieres
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Browse cinematic masterworks in pristine 4K HDR and spatial Dolby Atmos.
            </p>
          </div>

          {/* Controls: Genre, Year, Sort */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Year Selector */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl glass-panel border border-white/10 text-xs">
              <span className="text-slate-400 px-2 font-medium">Year:</span>
              {years.map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    selectedYear === yr
                      ? 'bg-indigo-600 text-white font-medium shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1 p-1 rounded-xl glass-panel border border-white/10 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400 ml-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-200 py-1 px-2.5 rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="rating" className="bg-[#090D1A] text-white">Highest Rated</option>
                <option value="newest" className="bg-[#090D1A] text-white">Newest First</option>
                <option value="title" className="bg-[#090D1A] text-white">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Genre Filter Bar (Interactive segmented controls - zero-pill anti-slop compliant) */}
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
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/20'
                    : 'glass-panel text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>

        {/* Movies Grid */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-400">
              Showing <strong className="text-white font-mono">{filteredMovies.length}</strong> movies
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {filteredMovies.map((movie) => (
              <div key={movie.id} className="flex justify-center">
                <MediaCard media={movie} aspectRatio="poster" />
              </div>
            ))}
          </div>

          {filteredMovies.length === 0 && (
            <div className="text-center py-20 rounded-3xl glass-panel border border-white/10 mt-8">
              <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">No movies found</h3>
              <p className="text-xs text-slate-400 mt-1">Try resetting the genre or year filter</p>
              <button
                onClick={() => {
                  setSelectedGenre('All');
                  setSelectedYear('All');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
