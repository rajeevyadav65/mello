// File: src/components/PlaylistModal.jsx
import React, { useState, useEffect } from 'react';
import { X, ListMusic, Palette, Check } from 'lucide-react';
import { motion } from 'motion/react';

const COVER_GRADIENTS = [
  { id: 'orange', label: 'Sunset Orange', bg: 'bg-gradient-to-tr from-orange-500 to-amber-500', color: '#f97316' },
  { id: 'coral', label: 'Coral Sunrise', bg: 'bg-gradient-to-tr from-rose-500 to-orange-400', color: '#fb7185' },
  { id: 'amber', label: 'Golden Honey', bg: 'bg-gradient-to-tr from-amber-500 to-yellow-400', color: '#f59e0b' },
  { id: 'terracotta', label: 'Warm Terracotta', bg: 'bg-gradient-to-tr from-orange-600 to-stone-700', color: '#ea580c' },
  { id: 'teal', label: 'Oasis Breeze', bg: 'bg-gradient-to-tr from-teal-500 to-emerald-600', color: '#14b8a6' }
];

export default function PlaylistModal({
  isOpen,
  onClose,
  onSave,
  initialData = null
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(COVER_GRADIENTS[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      const found = COVER_GRADIENTS.find(g => g.color === initialData.accentColor);
      if (found) setSelectedGradient(found);
    } else {
      setTitle('');
      setDescription('');
      setSelectedGradient(COVER_GRADIENTS[0]);
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please give your playlist a title.');
      return;
    }

    onSave({
      id: initialData?.id || `pl-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      accentColor: selectedGradient.color,
      coverUrl: initialData?.coverUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
      songIds: initialData?.songIds || []
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="relative w-full max-w-md rounded-3xl bg-white border border-orange-200 shadow-2xl shadow-orange-500/15 p-6 sm:p-8 text-stone-800 overflow-hidden"
      >
        <motion.button
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.1 }}
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-orange-50 transition"
        >
          <X className="w-5 h-5" />
        </motion.button>

        <div className="text-center space-y-1 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 mx-auto flex items-center justify-center border border-orange-200">
            <ListMusic className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight pt-2">
            {initialData ? "Edit Playlist Details" : "Create New Playlist"}
          </h2>
          <p className="text-xs text-stone-500">
            Organize and sequence your favorite tracks in Mello
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Playlist Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunny Beats 2026"
              maxLength={50}
              required
              autoFocus
              className="w-full bg-stone-50 border border-stone-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give your playlist a vibe or notes..."
              rows={2}
              maxLength={140}
              className="w-full bg-stone-50 border border-stone-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2 text-sm text-stone-900 placeholder-stone-400 outline-none transition resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2 flex items-center space-x-1.5">
              <Palette className="w-3.5 h-3.5 text-orange-500" />
              <span>Cover Theme Palette</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {COVER_GRADIENTS.map((grad) => (
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  key={grad.id}
                  type="button"
                  onClick={() => setSelectedGradient(grad)}
                  className={`h-10 rounded-xl ${grad.bg} flex items-center justify-center transition-all ${
                    selectedGradient.id === grad.id
                      ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-white scale-105 shadow-md"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  title={grad.label}
                >
                  {selectedGradient.id === grad.id && (
                    <Check className="w-4 h-4 text-white drop-shadow" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="pt-3 flex space-x-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-bold transition"
            >
              Cancel
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold shadow-md shadow-orange-500/25 transition"
            >
              {initialData ? "Save Changes" : "Create Playlist"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
