// File: src/components/SearchBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, X, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SearchBar({
  value,
  onChange,
  onVoiceSearch,
  placeholder = "Search songs, artists, albums, or genres...",
  autoFocus = false
}) {
  const [isListening, setIsListening] = useState(false);
  const [listeningText, setListeningText] = useState("Listening...");
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const sampleVoiceQueries = [
    "lofi beats for late night",
    "Afrobeat party vibes 2026",
    "Tokyo city pop revival",
    "Bollywood monsoon chill",
    "Midnight Horizon",
    "Synthwave sunset highway"
  ];

  const handleMicClick = () => {
    if (isListening) return;
    setIsListening(true);
    setListeningText("Listening for music or voice...");

    // Simulated speech recognition with waveform animation
    timerRef.current = setTimeout(() => {
      setListeningText("Recognizing query...");
      
      setTimeout(() => {
        const randomQuery = sampleVoiceQueries[Math.floor(Math.random() * sampleVoiceQueries.length)];
        setIsListening(false);
        if (onChange) {
          onChange(randomQuery);
        }
        if (onVoiceSearch) {
          onVoiceSearch(randomQuery);
        }
      }, 900);
    }, 1400);
  };

  const handleCancelListening = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsListening(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative flex items-center w-full bg-white/95 border border-orange-200/90 hover:border-orange-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 rounded-full transition-all duration-200 px-4 py-2 shadow-xs">
        <Search className="w-4 h-4 text-orange-500 shrink-0 mr-2.5" />
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full bg-transparent text-sm text-stone-900 placeholder-stone-600 focus:outline-none"
        />

        {value && (
          <motion.button
            whileTap={{ scale: 0.85 }}
            type="button"
            onClick={() => onChange("")}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-orange-50 transition mr-1"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </motion.button>
        )}

        {/* Mic Search Button with Voice state */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.88 }}
          type="button"
          onClick={handleMicClick}
          className={`relative p-2 rounded-full transition-all duration-300 shrink-0 ${
            isListening
              ? "bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/40 animate-pulse"
              : "text-stone-500 hover:text-orange-600 hover:bg-orange-50"
          }`}
          title="Search by voice"
        >
          <Mic className="w-4 h-4" />
          {isListening && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
            </span>
          )}
        </motion.button>
      </div>

      {/* Listening overlay banner if active */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            className="absolute top-full left-0 right-0 mt-2 p-3.5 bg-white border border-orange-300 rounded-2xl shadow-xl shadow-orange-500/10 z-50 flex items-center justify-between backdrop-blur-xl"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                <Radio className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Voice Search</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
                </div>
                <p className="text-sm font-semibold text-stone-800">{listeningText}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-end space-x-1 h-5 px-2">
                <span className="w-1 bg-orange-500 rounded-full animate-pulse h-3"></span>
                <span className="w-1 bg-orange-400 rounded-full animate-pulse h-5" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1 bg-amber-400 rounded-full animate-pulse h-2" style={{ animationDelay: '300ms' }}></span>
                <span className="w-1 bg-orange-500 rounded-full animate-pulse h-4" style={{ animationDelay: '450ms' }}></span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCancelListening}
                className="text-xs px-2.5 py-1 text-stone-600 hover:text-stone-900 bg-stone-100 rounded-lg hover:bg-stone-200 transition font-medium"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
