import React, { useState } from 'react';
import {
  Tv,
  Radio,
  Play,
  Volume2,
  VolumeX,
  Maximize2,
  Users,
  Clock,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { LIVE_CHANNELS } from '../data/mockData';
import { LiveChannel } from '../types';
import { useApp } from '../context/AppContext';

export const LiveTvPage: React.FC = () => {
  const { playMedia } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeChannel, setActiveChannel] = useState<LiveChannel>(LIVE_CHANNELS[0]);
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  const categories = ['All', 'Movies', 'Sports', 'News', 'Entertainment', 'Sci-Fi', 'Kids'];

  const filteredChannels = LIVE_CHANNELS.filter(
    (ch) => selectedCategory === 'All' || ch.category === selectedCategory
  );

  return (
    <div className="min-h-screen pb-28 pt-4 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>24/7 Global Satellite Broadcast</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
            Live TV & Guide
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </h1>
        </div>

        {/* Live Status Tag */}
        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl glass-panel border border-rose-500/30 text-rose-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="font-mono font-bold tracking-wider">ON AIR</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl glass-panel border border-white/10 text-slate-300 font-mono">
            {LIVE_CHANNELS.length} Active Feeds
          </div>
        </div>
      </div>

      {/* Featured Live Channel Section with Large Video Player Preview */}
      <div className="relative rounded-3xl overflow-hidden glass-panel-glow border border-white/[0.12] p-4 sm:p-6 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Video Stream Container (col 12 lg:col 8) */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden aspect-video bg-black border border-white/10 group">
            {/* Real Playable HTML5 Video Feed */}
            <video
              key={activeChannel.id}
              src={activeChannel.videoUrl}
              autoPlay
              loop
              muted={isAudioMuted}
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Ambient Overlay Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top Bar inside Stream Preview */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-cyan-300 font-mono text-xs border border-white/10">
                  {activeChannel.resolution}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-slate-300 font-mono text-xs border border-white/10 flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-cyan-400" />
                  {activeChannel.viewers}
                </span>
                <button
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  className="p-2 rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/10 hover:bg-black/80 transition-colors cursor-pointer"
                  title={isAudioMuted ? 'Unmute' : 'Mute'}
                >
                  {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Bottom Bar inside Stream Preview */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-cyan-400 font-bold">CH {activeChannel.channelNumber}</span>
                  <span className="text-white text-xs font-semibold">{activeChannel.name}</span>
                </div>
                <h3 className="text-base sm:text-xl font-bold text-white drop-shadow">
                  {activeChannel.currentProgram.title}
                </h3>
              </div>

              <button
                onClick={() => {
                  // Direct to full player experience
                  playMedia({
                    id: activeChannel.id,
                    title: `${activeChannel.name} - ${activeChannel.currentProgram.title}`,
                    type: 'movie',
                    tagline: `Live Broadcast: ${activeChannel.currentProgram.genre}`,
                    description: activeChannel.currentProgram.description,
                    year: 2026,
                    rating: 9.0,
                    ageRating: 'LIVE',
                    genres: [activeChannel.category, 'Live Broadcast'],
                    backdrop: activeChannel.previewImage,
                    poster: activeChannel.previewImage,
                    cast: [],
                    videoUrl: activeChannel.videoUrl,
                  });
                }}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-medium text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Theater View</span>
              </button>
            </div>
          </div>

          {/* Right Info & Program EPG Column (col 12 lg:col 4) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-extrabold text-white text-sm shadow-lg"
                  style={{ backgroundColor: activeChannel.color }}
                >
                  {activeChannel.logoText}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{activeChannel.name}</h2>
                  <p className="text-xs text-cyan-400 font-mono">{activeChannel.tag}</p>
                </div>
              </div>

              {/* Currently Playing Card */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Now Broadcasting
                  </span>
                  <span className="font-mono text-slate-400">
                    {activeChannel.currentProgram.startTime} - {activeChannel.currentProgram.endTime}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  {activeChannel.currentProgram.title}
                </h4>
                <p className="text-xs text-slate-300/80 leading-relaxed">
                  {activeChannel.currentProgram.description}
                </p>

                {/* Progress bar */}
                <div className="pt-1">
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 via-indigo-500 to-cyan-400 rounded-full"
                      style={{ width: `${activeChannel.currentProgram.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>Elapsed: {activeChannel.currentProgram.progressPercent}%</span>
                    <span>{activeChannel.currentProgram.durationMinutes} mins total</span>
                  </div>
                </div>
              </div>

              {/* Up Next List */}
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Upcoming Next
                </h5>
                {activeChannel.upcomingPrograms.map((up) => (
                  <div
                    key={up.id}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{up.title}</span>
                      <span className="font-mono text-cyan-400 text-[11px]">{up.startTime}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{up.genre} · {up.durationMinutes}m</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/25'
                  : 'glass-panel text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Channel Grid with EPG Information */}
      <div className="space-y-4">
        <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          Channel Grid & Live EPG
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChannels.map((channel) => {
            const isCurrent = activeChannel.id === channel.id;
            return (
              <div
                key={channel.id}
                onClick={() => setActiveChannel(channel)}
                className={`p-4 rounded-2xl glass-panel border transition-all duration-300 cursor-pointer group hover:-translate-y-1 ${
                  isCurrent
                    ? 'border-cyan-500/60 shadow-[0_10px_25px_-5px_rgba(6,182,212,0.25)] bg-white/[0.06]'
                    : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-white text-xs shadow-md"
                      style={{ backgroundColor: channel.color }}
                    >
                      {channel.logoText}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-cyan-400 font-bold">
                          CH {channel.channelNumber}
                        </span>
                        <span className="text-white text-sm font-semibold group-hover:text-cyan-300 transition-colors">
                          {channel.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{channel.category}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-mono font-bold flex items-center gap-1 border border-rose-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    LIVE
                  </span>
                </div>

                {/* Program Schedule Preview */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.05] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-200 font-medium truncate pr-2">
                      {channel.currentProgram.title}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {channel.currentProgram.startTime}
                    </span>
                  </div>

                  {/* Tiny progress bar */}
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${channel.currentProgram.progressPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Next: {channel.upcomingPrograms[0]?.title || 'Encore'}</span>
                    <span className="font-mono">{channel.upcomingPrograms[0]?.startTime}</span>
                  </div>
                </div>

                {/* Card Action Row */}
                <div className="mt-3 flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {channel.viewers} watching
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveChannel(channel);
                    }}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-cyan-500 text-black font-semibold'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isCurrent ? 'Playing' : 'Tune In'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
