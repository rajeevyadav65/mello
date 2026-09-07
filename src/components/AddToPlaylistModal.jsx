// File: src/components/AddToPlaylistModal.jsx
import React, { useState } from 'react';
import { X, Plus, Check, ListMusic } from 'lucide-react';
import { motion } from 'motion/react';

export default function AddToPlaylistModal({
  isOpen,
  onClose,
  track,
  playlists = [],
  onAddToPlaylist,
  onCreateNewPlaylist
}) {
  const [justAddedId, setJustAddedId] = useState(null);

  if (!isOpen || !track) return null;

  const handleSelectPlaylist = (playlistId) => {
    onAddToPlaylist(playlistId, track.id);
    setJustAddedId(playlistId);
    setTimeout(() => {
      setJustAddedId(null);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="relative w-full max-w-sm rounded-3xl bg-white border border-orange-200 shadow-2xl shadow-orange-500/15 p-5 sm:p-6 text-stone-800 overflow-hidden"
      >
        <motion.button
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.1 }}
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-orange-50 transition"
        >
          <X className="w-5 h-5" />
        </motion.button>

        <div className="flex items-center space-x-3 mb-4 pr-6">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 shadow-xs border border-stone-200">
            <img
              src={track.coverUrl}
              alt={track.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
              Add Song to Playlist
            </span>
            <h3 className="text-sm font-bold text-stone-900 truncate">
              {track.title}
            </h3>
            <p className="text-xs text-stone-500 truncate">
              {track.artist}
            </p>
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => {
              onClose();
              onCreateNewPlaylist();
            }}
            className="w-full flex items-center space-x-3 p-2.5 rounded-xl bg-orange-50/80 hover:bg-orange-100/70 text-orange-700 border border-dashed border-orange-300 text-xs font-bold transition"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <Plus className="w-4 h-4" />
            </div>
            <span>Create New Playlist</span>
          </motion.button>

          {playlists.length === 0 ? (
            <div className="text-center py-6 text-xs text-stone-400 font-medium">
              No playlists found. Create your first playlist above!
            </div>
          ) : (
            playlists.map((pl) => {
              const alreadyHasSong = pl.songIds?.includes(track.id);
              const isJustAdded = justAddedId === pl.id;

              return (
                <motion.div
                  whileHover={{ scale: 1.01, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  key={pl.id}
                  onClick={() => handleSelectPlaylist(pl.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                    isJustAdded
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                      : alreadyHasSong
                      ? "bg-stone-50 border-stone-200 text-stone-700 hover:bg-orange-50/40"
                      : "bg-white hover:bg-orange-50/40 border-stone-200/80 text-stone-700"
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs font-bold"
                      style={{ backgroundColor: pl.accentColor || '#f97316' }}
                    >
                      <ListMusic className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-stone-900 truncate">{pl.title}</p>
                      <p className="text-[10px] text-stone-400">{pl.songIds?.length || 0} songs</p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {alreadyHasSong || isJustAdded ? (
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Check className="w-3 h-3 mr-1" />
                        Added
                      </span>
                    ) : (
                      <span className="text-xs text-stone-400 hover:text-orange-600">
                        <Plus className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
