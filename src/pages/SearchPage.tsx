import React, { useState, useMemo } from 'react';
import { Search, X, Filter, SlidersHorizontal, Film, Clapperboard, Sparkles } from 'lucide-react';
import { ALL_MEDIA } from '../data/mockData';
import { MediaCard } from '../components/MediaCard';
import { MediaType } from '../types';

export const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | MediaType>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'newest'>('relevance');

  const genres = ['All', 'Sci-Fi', 'Action', 'Cyberpunk', 'Fantasy', 'Thriller', 'Mystery', 'Adventure', 'Drama', 'Documentary'];

  const searchResults = useMemo(() => {
    return ALL_MEDIA.filter((item) => {
      // Text match against title, description, genres, cast, director
      const query = searchTerm.toLowerCase().trim();
      const matchesText =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.genres.some((g) => g.toLowerCase().includes(query)) ||
        item.director?.toLowerCase().includes(query) ||
        item.cast.some((c) => c.name.toLowerCase().includes(query) || c.role.toLowerCase().includes(query));

      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesGenre = selectedGenre === 'All' || item.genres.includes(selectedGenre);
      const matchesRating = item.rating >= minRating;
      const matchesYear = selectedYear === 'All' || item.year.toString() === selectedYear;

      return matchesText && matchesType && matchesGenre && matchesRating && matchesYear;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.year - a.year;
      return 0; // relevance preserves original curated order
    });
  }, [searchTerm, selectedType, selectedGenre, minRating, selectedYear, sortBy]);

  const moviesCount = searchResults.filter((m) => m.type === 'movie').length;
  const seriesCount = searchResults.filter((m) => m.type === 'series').length;

  return (
    <div className="min-h-screen pb-28 pt-4 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Glass Search Hero Input */}
      <div className="relative max-w-3xl mx-auto pt-6 sm:pt-10">
        <div className="relative rounded-2xl glass-panel-glow border border-white/[0.15] p-2 shadow-2xl flex items-center gap-3">
          <div className="p-3 text-cyan-400">
            <Search className="w-6 h-6" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, director, actor, genre or keyword (e.g. Chronos, Tokyo, Sci-Fi)..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base font-medium focus:outline-none"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer mr-1"
              title="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        {!searchTerm && (
          <div className="flex items-center justify-center flex-wrap gap-2 mt-4 text-xs text-slate-400">
            <span className="font-semibold text-slate-500">Popular searches:</span>
            {['Chronos', 'Cyberpulse', 'Sci-Fi', 'Astral', 'Tokyo', 'Mariana Abyss'].map((term) => (
              <button
                key={term}
                onClick={() => setSearchTerm(term)}
                className="px-3 py-1 rounded-full glass-panel text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all cursor-pointer text-[11px]"
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter and Control Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/[0.08] space-y-4">
        {/* Type Toggle & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Segmented Type Toggle */}
          <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Types ({searchResults.length})
            </button>
            <button
              onClick={() => setSelectedType('movie')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                selectedType === 'movie'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Movies ({moviesCount})</span>
            </button>
            <button
              onClick={() => setSelectedType('series')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                selectedType === 'series'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clapperboard className="w-3.5 h-3.5" />
              <span>Series ({seriesCount})</span>
            </button>
          </div>

          {/* Right Filters: Rating & Sort */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Rating Filter */}
            <div className="flex items-center gap-1 p-1 rounded-xl glass-panel border border-white/10">
              <span className="text-slate-400 px-2 font-medium">Min Rating:</span>
              {[
                { label: 'Any', val: 0 },
                { label: '8.5+', val: 8.5 },
                { label: '9.0+', val: 9.0 },
              ].map((r) => (
                <button
                  key={r.val}
                  onClick={() => setMinRating(r.val)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    minRating === r.val ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 p-1 rounded-xl glass-panel border border-white/10">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400 ml-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-200 py-1 px-2.5 rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="relevance" className="bg-[#090D1A] text-white">Best Match</option>
                <option value="rating" className="bg-[#090D1A] text-white">Highest Rated</option>
                <option value="newest" className="bg-[#090D1A] text-white">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Genre Filter Scroll Strip */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-white/[0.06]">
          <span className="text-xs text-slate-500 flex items-center gap-1 pl-1">
            <Filter className="w-3 h-3" /> Genre:
          </span>
          {genres.map((g) => {
            const active = selectedGenre === g;
            return (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-cyan-500/20 text-cyan-300 font-medium border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300">
          Search Results{' '}
          <span className="text-cyan-400 font-mono">({searchResults.length})</span>
        </h3>
        {(searchTerm || selectedGenre !== 'All' || selectedType !== 'all' || minRating > 0) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setSelectedGenre('All');
              setMinRating(0);
              setSelectedYear('All');
            }}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Grid of Results */}
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {searchResults.map((item) => (
            <div key={item.id} className="flex justify-center">
              <MediaCard media={item} aspectRatio="poster" />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 rounded-3xl glass-panel border border-white/10 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto border border-white/10 text-slate-400">
            <Search className="w-8 h-8 opacity-50" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white">No titles match your query</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              We couldn’t find anything matching &quot;{searchTerm}&quot; with current filters. Try searching for popular genres or clear your criteria.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('All');
                setSelectedType('all');
                setMinRating(0);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
