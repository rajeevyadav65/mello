// File: src/components/TopBar.jsx
import React from 'react';
import { Radio, HardDrive, ListMusic } from 'lucide-react';
import { motion } from 'motion/react';
import SearchBar from './SearchBar.jsx';
import UserProfileMenu from './UserProfileMenu.jsx';
import MelloLogo from './MelloLogo.jsx';

export default function TopBar({
  searchQuery,
  onSearchChange,
  onVoiceSearch,
  currentTrack,
  isPlaying,
  onOpenNowPlaying,
  activeTab,
  onTabChange,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenCreatePlaylist,
  playlistsCount = 0,
  likedCount = 0
}) {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-xl border-b border-orange-100/90 px-4 py-3 sm:px-6 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Unique Mello Logo */}
        <div
          onClick={() => onTabChange('home')}
          className="cursor-pointer select-none shrink-0"
        >
          <MelloLogo size="md" showWordmark={true} />
        </div>

        {/* Center: Search Bar & Mic */}
        <div className="flex-1 max-w-xl">
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              onSearchChange(val);
              if (val && activeTab !== 'search') {
                onTabChange('search');
              }
            }}
            onVoiceSearch={(query) => {
              onVoiceSearch(query);
              if (activeTab !== 'search') {
                onTabChange('search');
              }
            }}
          />
        </div>

        {/* Right: Audio Indicator / User Profile */}
        <div className="flex items-center space-x-2 shrink-0">
          {currentTrack && isPlaying ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={onOpenNowPlaying}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-300 text-orange-700 hover:bg-orange-500/20 transition shadow-xs group"
              title="Click to expand Now Playing"
            >
              <div className="flex items-end space-x-0.5 h-3.5">
                <span className="w-1 bg-orange-500 rounded-full animate-pulse h-2"></span>
                <span className="w-1 bg-orange-500 rounded-full animate-pulse h-3.5" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1 bg-orange-500 rounded-full animate-pulse h-1.5" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span className="text-xs font-semibold hidden md:inline truncate max-w-[120px] text-stone-800">
                {currentTrack.title}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 font-bold hidden lg:inline">
                Playing
              </span>
            </motion.button>
          ) : (
            <div className="hidden lg:flex items-center space-x-1.5 text-xs text-stone-500 px-3 py-1.5 rounded-full bg-orange-50/70 border border-orange-200/70">
              <Radio className="w-3.5 h-3.5 text-orange-500" />
              <span className="font-medium">Audio Ready</span>
            </div>
          )}

          {/* Playlists Quick Nav */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={() => onTabChange('playlists')}
            className={`p-2 rounded-xl border transition hidden sm:inline-flex ${
              activeTab === 'playlists'
                ? "bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/30"
                : "bg-white hover:bg-orange-50/80 text-stone-600 border-stone-200 hover:border-orange-200"
            }`}
            title="My Playlists"
          >
            <ListMusic className="w-4 h-4" />
          </motion.button>

          {/* User Account / Profile */}
          <UserProfileMenu
            currentUser={currentUser}
            onOpenAuth={onOpenAuth}
            onLogout={onLogout}
            onOpenCreatePlaylist={onOpenCreatePlaylist}
            onViewPlaylists={() => onTabChange('playlists')}
            playlistsCount={playlistsCount}
            likedCount={likedCount}
          />
        </div>
      </div>
    </header>
  );
}
