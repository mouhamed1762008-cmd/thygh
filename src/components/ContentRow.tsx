import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../types';
import { MediaCard } from './MediaCard';

interface ContentRowProps {
  title: string;
  items: MediaItem[];
  aspectRatio?: 'poster' | 'landscape';
  showProgressMap?: Record<string, number>;
  onSeeAll?: () => void;
}

export const ContentRow: React.FC<ContentRowProps> = ({
  title,
  items,
  aspectRatio = 'poster',
  showProgressMap,
  onSeeAll,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative my-8 sm:my-10 group/row">
      {/* Row Header */}
      <div className="flex items-baseline justify-between mb-3 px-4 md:px-8">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white">
            {title}
          </h3>
          <span className="text-xs text-slate-500 font-mono">({items.length})</span>
        </div>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            Explore all →
          </button>
        )}
      </div>

      {/* Relative wrapper for scroll arrows */}
      <div className="relative px-4 md:px-8">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-2 top-[40%] -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-panel-glow border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer shadow-xl hidden sm:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-2 top-[40%] -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-panel-glow border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer shadow-xl hidden sm:flex"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Content Container */}
        <div
          ref={rowRef}
          className="flex items-start gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 pr-8"
        >
          {items.map((item) => {
            const progress = showProgressMap ? showProgressMap[item.id] : undefined;
            return (
              <MediaCard
                key={item.id}
                media={item}
                aspectRatio={aspectRatio}
                showProgress={progress !== undefined}
                progressPercent={progress}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
