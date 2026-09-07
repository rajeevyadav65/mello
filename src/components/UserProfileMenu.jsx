// File: src/components/UserProfileMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Plus, ListMusic, Heart, Shield, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function UserProfileMenu({
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenCreatePlaylist,
  onViewPlaylists,
  playlistsCount = 0,
  likedCount = 0
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        type="button"
        onClick={onOpenAuth}
        className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 transition"
      >
        <User className="w-3.5 h-3.5" />
        <span>Sign In</span>
      </motion.button>
    );
  }

  const providerBadges = {
    google: { label: "Google", color: "bg-blue-50 text-blue-700 border-blue-200" },
    apple: { label: "Apple", color: "bg-stone-100 text-stone-800 border-stone-300" },
    email: { label: "Email", color: "bg-orange-50 text-orange-700 border-orange-200" }
  };

  const badge = providerBadges[currentUser.provider] || providerBadges.email;

  return (
    <div ref={menuRef} className="relative select-none">
      <motion.button
        whileTap={{ scale: 0.94 }}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 pl-1.5 pr-2.5 rounded-full bg-white hover:bg-orange-50 border border-orange-200/80 shadow-xs transition"
      >
        <img
          src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
          alt={currentUser.name}
          referrerPolicy="no-referrer"
          className="w-6 h-6 rounded-full object-cover border border-orange-400"
        />
        <span className="text-xs font-bold text-stone-800 max-w-[100px] truncate hidden sm:inline">
          {currentUser.name}
        </span>
        <ChevronDown className="w-3 h-3 text-stone-400" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-orange-200 shadow-xl shadow-orange-500/15 p-2 z-50 text-stone-700 backdrop-blur-xl"
          >
            {/* User Info Header */}
            <div className="p-3 bg-gradient-to-br from-orange-50/80 to-amber-50/50 rounded-xl border border-orange-200/70 mb-2">
              <div className="flex items-center space-x-3">
                <img
                  src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border-2 border-orange-300"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <p className="text-xs font-bold text-stone-900 truncate">{currentUser.name}</p>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-around pt-3 mt-2 border-t border-orange-200/70 text-center">
                <div>
                  <span className="block text-xs font-bold text-stone-900">{playlistsCount}</span>
                  <span className="text-[10px] text-stone-500">Playlists</span>
                </div>
                <div className="w-[1px] h-4 bg-orange-200" />
                <div>
                  <span className="block text-xs font-bold text-stone-900">{likedCount}</span>
                  <span className="text-[10px] text-stone-500">Liked Songs</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-1 text-xs">
              <motion.button
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenCreatePlaylist();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-orange-50 text-stone-700 hover:text-orange-600 transition font-medium"
              >
                <Plus className="w-4 h-4 text-orange-500" />
                <span>Create New Playlist</span>
              </motion.button>

              <motion.button
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onViewPlaylists();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-orange-50 text-stone-700 hover:text-orange-600 transition font-medium"
              >
                <ListMusic className="w-4 h-4 text-orange-500" />
                <span>My Custom Playlists</span>
              </motion.button>

              <motion.button
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenAuth();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-orange-50 text-stone-700 hover:text-orange-600 transition font-medium"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Switch Account</span>
              </motion.button>

              <div className="border-t border-orange-100 pt-1 mt-1">
                <motion.button
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-600 transition font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
