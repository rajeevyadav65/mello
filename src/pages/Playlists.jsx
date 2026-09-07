// File: src/pages/Playlists.jsx
import React from 'react';
import { Plus, ListMusic, Play, Heart, Sparkles, User, ShieldCheck } from 'lucide-react';

export default function Playlists({
  playlists = [],
  allSongs = [],
  onSelectPlaylist,
  onOpenCreatePlaylist,
  onPlayPlaylist,
  onOpenAuth,
  currentUser
}) {
  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ListMusic className="w-6 h-6 text-violet-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              My Playlists
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Create, sequence, and manage personal music playlists synced to your profile.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={onOpenCreatePlaylist}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-lg shadow-violet-600/30 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Playlist</span>
          </button>

          {!currentUser && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 px-3 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 text-xs font-medium transition"
            >
              <User className="w-3.5 h-3.5 text-violet-400" />
              <span>Sign In to Sync</span>
            </button>
          )}
        </div>
      </div>

      {/* Account sync badge */}
      <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-xs">
            {currentUser ? (
              <span>
                Playlists synced with account: <strong className="text-white">{currentUser.email}</strong>
              </span>
            ) : (
              <span className="text-zinc-400">
                Playlists currently stored locally in your browser. <button type="button" onClick={onOpenAuth} className="text-violet-400 underline font-semibold">Sign in</button> to link to your account.
              </span>
            )}
          </div>
        </div>
        <span className="text-xs font-semibold text-zinc-400">{playlists.length} total</span>
      </div>

      {/* Playlist Cards Grid */}
      {playlists.length === 0 ? (
        <div className="text-center py-16 space-y-3 bg-zinc-900/30 rounded-3xl border border-zinc-800/60">
          <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 mx-auto flex items-center justify-center text-zinc-500">
            <ListMusic className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-zinc-300">
            No playlists created yet
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Create your first playlist and add tracks from search, trending hits, or your local library.
          </p>
          <button
            type="button"
            onClick={onOpenCreatePlaylist}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white transition mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Your First Playlist</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((pl) => {
            const playlistSongs = (pl.songIds || [])
              .map((id) => allSongs.find((s) => s.id === id))
              .filter(Boolean);

            return (
              <div
                key={pl.id}
                onClick={() => onSelectPlaylist(pl)}
                className="group relative flex flex-col p-4 rounded-2xl bg-zinc-900/70 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-violet-950/20"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-zinc-800">
                  <img
                    src={pl.coverUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80"}
                    alt={pl.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Play Button Overlay */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (playlistSongs.length > 0) {
                        onPlayPlaylist(playlistSongs, 0);
                      }
                    }}
                    className="absolute bottom-3 right-3 p-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/40 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                    title="Play Playlist"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>

                  <div className="absolute bottom-3 left-3 flex items-center space-x-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: pl.accentColor || '#6366f1' }}
                    />
                    <span className="text-[11px] font-semibold text-white/90 drop-shadow">
                      {pl.songIds?.length || 0} songs
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white truncate group-hover:text-violet-300 transition-colors">
                  {pl.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mt-1 min-h-[32px]">
                  {pl.description || "Curated track collection."}
                </p>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-3 pt-2 border-t border-zinc-800">
                  <span>{playlistSongs.length} tracks</span>
                  <span>{pl.createdAt || "Recently"}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
