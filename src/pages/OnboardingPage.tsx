import React, { useState } from 'react';
import { Play, Sparkles, Check, ArrowRight, ShieldCheck, Film, Tv, Radio } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AVATAR_OPTIONS, GENERATED_IMAGES } from '../data/mockData';

export const OnboardingPage: React.FC = () => {
  const { user, completeOnboarding } = useApp();
  const [name, setName] = useState(user.name === 'Alex Sterling' ? '' : user.name);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || AVATAR_OPTIONS[0].url);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your name or a moniker to personalize your cinema experience.');
      return;
    }
    completeOnboarding(name.trim(), selectedAvatar);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none bg-[#05070D]">
      {/* Background Image with Dark Cinematic Vignette */}
      <div className="absolute inset-0">
        <img
          src={GENERATED_IMAGES.ONBOARDING}
          alt="Cinematic Backdrop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35 filter blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-[#05070D]/80 to-[#05070D]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.18),transparent_65%)]" />
      </div>

      {/* Floating Ambient Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-600/20 blur-[100px] pointer-events-none" />

      {/* Central Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl glass-panel-glow border border-white/[0.14] p-6 sm:p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        {/* Platform Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1.5px] shadow-2xl shadow-indigo-500/40 mb-4 hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#080C19] rounded-[14px] flex items-center justify-center">
              <Play className="w-7 h-7 text-cyan-300 fill-cyan-300 ml-1" />
            </div>
          </div>
          <span className="font-display text-2xl sm:text-3xl font-bold tracking-wider text-white">
            AETHER STREAM
          </span>
          <p className="text-xs text-cyan-400 font-mono tracking-widest uppercase mt-1">
            Ultra 4K HDR · Cinematic Glassmorphism
          </p>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Welcome to Next-Gen Streaming
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5">
            What should we call you on your cinematic journey?
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Your Name / Handle
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Elena Rostova, Marcus, or Maverick"
              className="w-full px-4 py-3.5 rounded-xl glass-input text-white placeholder-slate-500 text-sm font-medium focus:ring-2 focus:ring-cyan-400/50"
              autoFocus
            />
            {error && <p className="text-xs text-rose-400 mt-1.5">{error}</p>}
          </div>

          {/* Select Avatar */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Choose Your Persona
            </label>
            <div className="grid grid-cols-6 gap-2 sm:gap-3">
              {AVATAR_OPTIONS.map((avatar) => {
                const isSelected = selectedAvatar === avatar.url;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.url)}
                    className={`relative rounded-xl overflow-hidden aspect-square border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-105 shadow-lg shadow-cyan-500/25'
                        : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                    }`}
                    title={avatar.name}
                  >
                    <img
                      src={avatar.url}
                      alt={avatar.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-cyan-900/30 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-cyan-300" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Features Preview Strip */}
          <div className="py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-indigo-400" />
              <span>4K Movies</span>
            </div>
            <span className="text-slate-600">·</span>
            <div className="flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-violet-400" />
              <span>Full Series</span>
            </div>
            <span className="text-slate-600">·</span>
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Channels</span>
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-98 cursor-pointer"
          >
            <span>Enter Aether Stream</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quiet Footer Note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Dolby Atmos & IMAX Enhanced certified profile</span>
        </div>
      </div>
    </div>
  );
};
