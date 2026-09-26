import React, { useState, useRef, useEffect } from 'react';
import {
  Film,
  Search,
  Tv,
  Home,
  Clapperboard,
  Bell,
  Check,
  LogOut,
  User,
  Sliders,
  Play,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageView } from '../types';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    navigateTo,
    user,
    notifications,
    unreadNotificationCount,
    markNotificationsAsRead,
    logout,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hide nav bar when in fullscreen video player or onboarding
  if (currentPage === 'player' || currentPage === 'onboarding') {
    return null;
  }

  const navLinks: { label: string; page: PageView; icon: React.ReactNode }[] = [
    { label: 'Home', page: 'home', icon: <Home className="w-4 h-4" /> },
    { label: 'Movies', page: 'movies', icon: <Film className="w-4 h-4" /> },
    { label: 'Series', page: 'series', icon: <Clapperboard className="w-4 h-4" /> },
    { label: 'Live TV', page: 'livetv', icon: <Tv className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Desktop & Tablet Top Navigation */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/[0.08] px-4 md:px-8 py-3.5 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            aria-label="Aether Stream Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-[#090D1A] rounded-[11px] flex items-center justify-center">
                <Play className="w-4 h-4 text-cyan-300 fill-cyan-300 ml-0.5" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display text-xl font-bold tracking-wider text-white flex items-center gap-1.5">
                AETHER
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (single-line, quiet hover underline) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => navigateTo(link.page)}
                  className={`relative py-1 transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Search, Notification, Profile) */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => navigateTo('search')}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                currentPage === 'search'
                  ? 'bg-indigo-600/30 text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'bg-white/[0.04] text-slate-300 border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
              }`}
              title="Search Titles, Actors & Genres"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification Menu */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  if (!isNotifOpen) markNotificationsAsRead();
                }}
                className="relative p-2 rounded-xl bg-white/[0.04] text-slate-300 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-[#0A0E1A]">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Glass Notification Flyout */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-panel-glow border border-white/[0.12] p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-semibold text-white">Notifications</span>
                    </div>
                    <button
                      onClick={markNotificationsAsRead}
                      className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" /> Mark all read
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 max-h-72 overflow-y-auto no-scrollbar">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.04] transition-all cursor-pointer"
                        onClick={() => {
                          setIsNotifOpen(false);
                          navigateTo('home');
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-200">{notif.title}</p>
                          <span className="text-[10px] text-slate-500 whitespace-nowrap">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Quick Menu */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all cursor-pointer group"
                aria-label="User Profile Menu"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-cyan-500/40"
                />
                <span className="hidden sm:inline-block text-xs font-medium text-slate-200 max-w-[100px] truncate group-hover:text-white">
                  {user.name}
                </span>
              </button>

              {/* Glass Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl glass-panel-glow border border-white/[0.12] p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-2">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/50"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-cyan-400 truncate">{user.plan}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigateTo('profile');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
                    >
                      <User className="w-4 h-4 text-indigo-400" />
                      <span>Account & Watchlist</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigateTo('profile');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
                    >
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      <span>Playback Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigateTo('onboarding');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
                    >
                      <User className="w-4 h-4 text-violet-400" />
                      <span>Switch Profile</span>
                    </button>
                    <div className="pt-2 mt-2 border-t border-white/[0.08]">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Glass Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-white/[0.08] px-3 py-2 flex items-center justify-around pb-safe">
        {navLinks.map((link) => {
          const isActive = currentPage === link.page;
          return (
            <button
              key={link.page}
              onClick={() => navigateTo(link.page)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {link.icon}
              <span className="text-[10px] tracking-tight">{link.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => navigateTo('search')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentPage === 'search'
              ? 'text-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Search</span>
        </button>
        <button
          onClick={() => navigateTo('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentPage === 'profile'
              ? 'text-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Profile</span>
        </button>
      </nav>
    </>
  );
};
