import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ArrowLeft,
  SkipForward,
  FastForward,
  Settings,
  Subtitles,
  PictureInPicture2,
  Layers,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_MEDIA } from '../data/mockData';
import { Episode } from '../types';

export const VideoPlayerPage: React.FC = () => {
  const {
    activePlayerMedia,
    activeEpisode,
    navigateTo,
    updateProgress,
    playMedia,
  } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fallback to Chronos if accessed directly
  const media = activePlayerMedia || ALL_MEDIA[0];
  const episode = activeEpisode || (media.seasons?.[0]?.episodes?.[0] as Episode | undefined);

  const videoSrc = episode?.videoUrl || media.videoUrl;

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState('4K HDR');
  const [selectedAudio, setSelectedAudio] = useState('English [Dolby Atmos]');
  const [selectedSubtitle, setSelectedSubtitle] = useState('English [CC]');
  const [activeSettingsMenu, setActiveSettingsMenu] = useState<'none' | 'speed' | 'quality' | 'audio' | 'subs'>('none');
  const [showSkipIntro, setShowSkipIntro] = useState(true);
  const [showUpNext, setShowUpNext] = useState(false);

  const controlsTimeoutRef = useRef<any>(null);

  // Next episode resolution for TV series
  const nextEpisode = React.useMemo(() => {
    if (media.type !== 'series' || !media.seasons) return null;
    for (const season of media.seasons) {
      const idx = season.episodes.findIndex((e) => e.id === episode?.id);
      if (idx !== -1 && idx < season.episodes.length - 1) {
        return season.episodes[idx + 1];
      }
    }
    return null;
  }, [media, episode]);

  // Mouse activity auto-hides controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setActiveSettingsMenu('none');
      }
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // Update progress in context
  useEffect(() => {
    if (currentTime > 5 && duration > 0) {
      updateProgress(media.id, currentTime, duration, episode?.id);
    }
  }, [currentTime, duration, media.id, episode?.id, updateProgress]);

  // Video event handlers
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
      // Show skip intro during the first 60 seconds
      setShowSkipIntro(videoRef.current.currentTime < 60);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skipSeconds = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 0.5;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setActiveSettingsMenu('none');
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch {
      // ignore
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center select-none"
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setShowUpNext(true)}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Subtitles Overlay Simulation */}
      {selectedSubtitle !== 'Off' && isPlaying && currentTime > 4 && (
        <div className="absolute bottom-28 inset-x-0 flex justify-center pointer-events-none px-6">
          <div className="px-4 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-white font-mono text-sm sm:text-base border border-white/10 shadow-2xl">
            [Audio]: Dialog synchronized in {selectedAudio} · Aether Stream 4K
          </div>
        </div>
      )}

      {/* Skip Intro Overlay Button */}
      {showSkipIntro && (
        <button
          onClick={() => {
            skipSeconds(85);
            setShowSkipIntro(false);
          }}
          className="absolute bottom-28 right-8 z-30 py-2.5 px-5 rounded-xl glass-panel-glow border border-white/20 text-white font-semibold text-xs flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xl"
        >
          <FastForward className="w-4 h-4 text-cyan-400" />
          <span>Skip Intro</span>
        </button>
      )}

      {/* Up Next Drawer / Card (appears on ended or toggle) */}
      {showUpNext && nextEpisode && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
          <div className="max-w-md w-full rounded-3xl glass-panel-glow border border-white/20 p-6 space-y-4 text-center">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Up Next In Series</span>
            <h3 className="text-xl font-bold text-white">{nextEpisode.title}</h3>
            <p className="text-xs text-slate-300">{nextEpisode.description}</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowUpNext(false);
                  playMedia(media, nextEpisode);
                }}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Next Episode</span>
              </button>
              <button
                onClick={() => setShowUpNext(false)}
                className="py-3 px-4 rounded-xl glass-panel text-slate-300 hover:text-white text-xs cursor-pointer"
              >
                Replay Current
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HUD Controls (Fades smoothly when inactive) */}
      <div
        className={`absolute inset-0 flex flex-col justify-between p-4 sm:p-8 pointer-events-none transition-opacity duration-300 ${
          showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('details', media)}
              className="p-3 rounded-2xl glass-panel border border-white/15 text-white hover:bg-white/20 transition-all cursor-pointer"
              title="Return to Details"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                {media.title}
                {episode && (
                  <span className="text-xs font-mono text-cyan-400">
                    S{episode.seasonNumber}:E{episode.episodeNumber} &ldquo;{episode.title}&rdquo;
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono text-indigo-300">{selectedQuality}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedAudio}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md text-[11px] font-mono text-cyan-300 border border-white/10">
              Dolby Atmos Vision
            </span>
          </div>
        </div>

        {/* Center Quick Scrub / Big Play Toggle */}
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={() => skipSeconds(-10)}
            className="p-3 sm:p-4 rounded-full glass-panel border border-white/15 text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="Rewind 10s"
          >
            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={togglePlay}
            className="p-5 sm:p-6 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-2xl shadow-indigo-600/50"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-white" />
            ) : (
              <Play className="w-8 h-8 fill-white ml-1" />
            )}
          </button>

          <button
            onClick={() => skipSeconds(10)}
            className="p-3 sm:p-4 rounded-full glass-panel border border-white/15 text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="Fast Forward 10s"
          >
            <RotateCw className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Bottom Bar: Timeline Progress + Controls */}
        <div className="space-y-3 p-4 sm:p-5 rounded-3xl glass-panel-glow border border-white/15 shadow-2xl">
          {/* Progress Timeline Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-300 w-12 text-right">
              {formatTime(currentTime)}
            </span>
            <div className="relative flex-1 group/slider py-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              />
            </div>
            <span className="text-xs font-mono text-slate-400 w-12">
              {formatTime(duration)}
            </span>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between">
            {/* Left Controls: Play, Volume */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
              </button>

              {nextEpisode && (
                <button
                  onClick={() => playMedia(media, nextEpisode)}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Next Episode"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              )}

              {/* Volume Slider */}
              <div className="flex items-center gap-2 group/vol">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5 text-rose-400" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-20 h-1 bg-white/20 rounded appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

            {/* Right Controls: Subtitles, Audio, Speed, Quality, PiP, Fullscreen */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Subtitles Button */}
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveSettingsMenu(activeSettingsMenu === 'subs' ? 'none' : 'subs')
                  }
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    selectedSubtitle !== 'Off'
                      ? 'text-cyan-400 bg-white/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                  title="Subtitles"
                >
                  <Subtitles className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                {activeSettingsMenu === 'subs' && (
                  <div className="absolute bottom-12 right-0 w-44 rounded-2xl glass-panel-glow border border-white/20 p-2 shadow-2xl z-50 text-xs">
                    <p className="px-2 py-1 font-semibold text-slate-400">Subtitles</p>
                    {['Off', 'English [CC]', 'Spanish', 'French'].map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          setSelectedSubtitle(sub);
                          setActiveSettingsMenu('none');
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-200 hover:bg-white/10 text-left cursor-pointer"
                      >
                        <span>{sub}</span>
                        {selectedSubtitle === sub && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Playback Speed */}
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveSettingsMenu(activeSettingsMenu === 'speed' ? 'none' : 'speed')
                  }
                  className="px-2 py-1 rounded-xl text-xs font-mono font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Playback Speed"
                >
                  {playbackSpeed}x
                </button>
                {activeSettingsMenu === 'speed' && (
                  <div className="absolute bottom-12 right-0 w-36 rounded-2xl glass-panel-glow border border-white/20 p-2 shadow-2xl z-50 text-xs">
                    <p className="px-2 py-1 font-semibold text-slate-400">Speed</p>
                    {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSpeedChange(s)}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-200 hover:bg-white/10 text-left cursor-pointer"
                      >
                        <span>{s}x</span>
                        {playbackSpeed === s && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quality & Audio Settings Gear */}
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveSettingsMenu(activeSettingsMenu === 'quality' ? 'none' : 'quality')
                  }
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Stream Quality"
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                {activeSettingsMenu === 'quality' && (
                  <div className="absolute bottom-12 right-0 w-48 rounded-2xl glass-panel-glow border border-white/20 p-2 shadow-2xl z-50 text-xs space-y-1">
                    <p className="px-2 py-1 font-semibold text-slate-400">Quality Stream</p>
                    {['4K HDR Ultra', '1080p Full HD', '720p HD', 'Auto Bitrate'].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setSelectedQuality(q);
                          setActiveSettingsMenu('none');
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-200 hover:bg-white/10 text-left cursor-pointer"
                      >
                        <span>{q}</span>
                        {selectedQuality === q && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* PiP Button */}
              <button
                onClick={togglePiP}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer hidden sm:block"
                title="Picture in Picture"
              >
                <PictureInPicture2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
