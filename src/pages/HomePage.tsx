import React, { useMemo } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { ContentRow } from '../components/ContentRow';
import { ALL_MEDIA } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const HomePage: React.FC = () => {
  const { continueWatching, navigateTo } = useApp();

  const featuredItems = useMemo(
    () => ALL_MEDIA.filter((m) => m.isFeatured),
    []
  );

  const continueWatchingItems = useMemo(() => {
    return continueWatching
      .map((entry) => {
        const item = ALL_MEDIA.find((m) => m.id === entry.mediaId);
        return item ? { ...item, progress: entry.percentage } : null;
      })
      .filter(Boolean) as (typeof ALL_MEDIA[0] & { progress: number })[];
  }, [continueWatching]);

  const continueWatchingProgressMap = useMemo(() => {
    const map: Record<string, number> = {};
    continueWatching.forEach((c) => {
      map[c.mediaId] = c.percentage;
    });
    return map;
  }, [continueWatching]);

  const trendingItems = useMemo(
    () => ALL_MEDIA.filter((m) => m.isTrending),
    []
  );

  const popularMovies = useMemo(
    () => ALL_MEDIA.filter((m) => m.type === 'movie' && m.isPopular),
    []
  );

  const popularSeries = useMemo(
    () => ALL_MEDIA.filter((m) => m.type === 'series'),
    []
  );

  const recommendedItems = useMemo(
    () => ALL_MEDIA.filter((m) => m.rating >= 8.8),
    []
  );

  const recentlyAdded = useMemo(
    () => ALL_MEDIA.filter((m) => m.isNew || m.year === 2025),
    []
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Cinematic Hero Banner */}
      <HeroBanner featuredItems={featuredItems} />

      {/* Main Content Rows */}
      <div className="max-w-7xl mx-auto space-y-4 -mt-10 relative z-20">
        {/* Continue Watching (Landscape aspect ratio with progress bar) */}
        {continueWatchingItems.length > 0 && (
          <ContentRow
            title="Continue Watching"
            items={continueWatchingItems}
            aspectRatio="landscape"
            showProgressMap={continueWatchingProgressMap}
          />
        )}

        {/* Trending Now */}
        <ContentRow
          title="Trending Now"
          items={trendingItems}
          aspectRatio="poster"
          onSeeAll={() => navigateTo('movies')}
        />

        {/* Popular Movies */}
        <ContentRow
          title="Popular Movies"
          items={popularMovies}
          aspectRatio="poster"
          onSeeAll={() => navigateTo('movies')}
        />

        {/* Popular Series */}
        <ContentRow
          title="Binge-Worthy Series"
          items={popularSeries}
          aspectRatio="poster"
          onSeeAll={() => navigateTo('series')}
        />

        {/* Recommended For You */}
        <ContentRow
          title="Recommended For You"
          items={recommendedItems}
          aspectRatio="landscape"
        />

        {/* Recently Added */}
        <ContentRow
          title="Recently Added to Aether"
          items={recentlyAdded}
          aspectRatio="poster"
        />
      </div>
    </div>
  );
};
