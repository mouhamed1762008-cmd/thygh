/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { SeriesPage } from './pages/SeriesPage';
import { LiveTvPage } from './pages/LiveTvPage';
import { SearchPage } from './pages/SearchPage';
import { ProfilePage } from './pages/ProfilePage';
import { DetailsPage } from './pages/DetailsPage';
import { VideoPlayerPage } from './pages/VideoPlayerPage';
import { Play, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentPage, navigateTo, hasCompletedOnboarding } = useApp();

  // If onboarding is active, display it exclusively
  if (currentPage === 'onboarding' || !hasCompletedOnboarding) {
    return <OnboardingPage />;
  }

  // If video player is active, render full-screen theater mode
  if (currentPage === 'player') {
    return <VideoPlayerPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#05070D] text-slate-100 relative selection:bg-indigo-500/30 selection:text-white">
      {/* Background Ambient Glow & Cinematic Vignette */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute top-[35%] -right-40 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[150px]" />
        <div className="absolute -bottom-40 left-[20%] w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[140px]" />
      </div>

      {/* Top Glass Navigation Bar */}
      <Navbar />

      {/* Page View Body */}
      <main className="flex-1 relative z-10">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'movies' && <MoviesPage />}
        {currentPage === 'series' && <SeriesPage />}
        {currentPage === 'livetv' && <LiveTvPage />}
        {currentPage === 'search' && <SearchPage />}
        {currentPage === 'profile' && <ProfilePage />}
        {currentPage === 'details' && <DetailsPage />}
      </main>

      {/* Editorial Streaming Footer */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#04060B] py-12 px-4 md:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-[#080C19] rounded-[7px] flex items-center justify-center">
                  <Play className="w-3 h-3 text-cyan-300 fill-cyan-300 ml-0.5" />
                </div>
              </div>
              <span className="font-display text-base font-bold text-white tracking-wider">
                AETHER STREAM
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Next-generation video on demand platform with dark cinematic glassmorphism visual architecture, 4K HDR playback, and live satellite broadcasts.
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-3 uppercase tracking-wider text-[11px]">
              Browse Categories
            </h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigateTo('movies')} className="hover:text-cyan-300 transition-colors cursor-pointer">
                  4K Feature Films
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('series')} className="hover:text-cyan-300 transition-colors cursor-pointer">
                  Original Series & TV
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('livetv')} className="hover:text-cyan-300 transition-colors cursor-pointer">
                  Live TV & EPG Guide
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('movies')} className="hover:text-cyan-300 transition-colors cursor-pointer">
                  IMAX Enhanced Premieres
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-3 uppercase tracking-wider text-[11px]">
              Audio & Video Tech
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Dolby Vision HDR10+</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Dolby Atmos 7.1.4 Spatial</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-violet-400" />
                <span>HEVC Zero-Buffer Engine</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-pink-400" />
                <span>Ultra-Low Latency Broadcast</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-3 uppercase tracking-wider text-[11px]">
              Account & Help
            </h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigateTo('profile')} className="hover:text-cyan-300 transition-colors cursor-pointer">
                  User Profile & Preferences
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('profile')} className="hover:text-cyan-300 transition-colors cursor-pointer">
                  Watchlist & Saved History
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('search')} className="hover:text-cyan-300 transition-colors cursor-pointer">
                  Smart Search & Discover
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('onboarding')} className="hover:text-cyan-300 transition-colors cursor-pointer">
                  Switch Profile / Persona
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} Aether Stream Inc. All rights reserved. Cinematic Glassmorphism Experience.</p>
          <div className="flex items-center gap-4">
            <span>Terms of Service</span>
            <span>·</span>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Cookie Settings</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
