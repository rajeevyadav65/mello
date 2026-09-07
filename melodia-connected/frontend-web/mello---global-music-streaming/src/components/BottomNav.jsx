// File: src/components/BottomNav.jsx
import React from 'react';
import { Home, Search, ListMusic, HardDrive, Flame } from 'lucide-react';
import { motion } from 'motion/react';

export default function BottomNav({
  activeTab,
  onTabChange,
  localTracksCount = 0,
  playlistsCount = 0
}) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    {
      id: 'playlists',
      label: 'Playlists',
      icon: ListMusic,
      badge: playlistsCount > 0 ? playlistsCount : null
    },
    {
      id: 'library',
      label: 'Library',
      icon: HardDrive,
      badge: localTracksCount > 0 ? localTracksCount : null
    },
    { id: 'trends', label: 'Trends', icon: Flame }
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-orange-100/90 px-2 py-2 shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.88 }}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                  isActive ? "text-orange-600 font-bold" : "text-stone-500 hover:text-stone-800"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110 text-orange-600" : "text-stone-500"}`} />
                  {tab.badge && (
                    <span className="absolute -top-1.5 -right-2 px-1 min-w-[14px] h-[14px] flex items-center justify-center text-[9px] font-bold bg-orange-500 text-white rounded-full shadow-xs">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] mt-1 ${isActive ? "font-bold text-orange-600" : "font-medium"}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="activeTabDot"
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-xs shadow-orange-500/50"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-white/80 backdrop-blur-md border-r border-orange-100/90 p-4 shrink-0 justify-between select-none shadow-xs">
        <div className="space-y-6">
          <div>
            <p className="px-3 text-[11px] font-bold tracking-wider text-stone-600 uppercase mb-3">
              Discover & Play
            </p>
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: 2, scale: 1.01 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-md shadow-orange-500/25"
                        : "text-stone-600 hover:text-stone-900 hover:bg-orange-50/80 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-stone-500"}`} />
                      <span>{tab.label}</span>
                    </div>

                    {tab.badge && (
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-orange-100">
            <p className="px-3 text-[11px] font-bold tracking-wider text-stone-600 uppercase mb-3">
              Curated Moods
            </p>
            <div className="space-y-1 text-sm text-stone-600">
              {["Midnight Drive", "Late Night Lofi", "Tokyo City Pop", "Afrobeats 2026", "Deep Focus"].map((mood) => (
                <motion.div
                  key={mood}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onTabChange('home')}
                  className="px-3 py-1.5 rounded-lg hover:text-orange-600 hover:bg-orange-50/80 cursor-pointer text-xs truncate transition font-medium"
                >
                  • {mood}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-50/90 to-amber-50/70 border border-orange-200/80 text-xs text-stone-600 shadow-xs">
          <div className="flex items-center space-x-2 text-stone-900 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Audio Sound Ready</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
            Streaming audio + local files with MediaSession background support.
          </p>
        </div>
      </aside>
    </>
  );
}
