// File: src/components/MelloLogo.jsx
import React from 'react';
import { motion } from 'motion/react';

export default function MelloLogo({
  size = "md", // "sm" | "md" | "lg"
  showWordmark = true,
  animated = true
}) {
  const dimensions = {
    sm: { box: "w-8 h-8", icon: 20, text: "text-base", sub: "text-[9px]" },
    md: { box: "w-10 h-10", icon: 26, text: "text-lg", sub: "text-[10px]" },
    lg: { box: "w-14 h-14", icon: 34, text: "text-2xl", sub: "text-xs" }
  }[size] || { box: "w-10 h-10", icon: 26, text: "text-lg", sub: "text-[10px]" };

  return (
    <div className="flex items-center space-x-3 select-none">
      {/* Unique Mello Icon Emblem */}
      <motion.div
        whileHover={{ scale: 1.06, rotate: 2 }}
        whileTap={{ scale: 0.94 }}
        className={`relative ${dimensions.box} rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 p-[1.5px] shadow-lg shadow-orange-500/30 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden group`}
      >
        {/* Crisp White Inner Capsule with Warm Sunset Ambient Tint */}
        <div className="w-full h-full bg-gradient-to-b from-white to-orange-50/90 rounded-[14px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle Ambient Wave Background in Icon */}
          <div className="absolute inset-0 bg-radial from-orange-400/15 via-transparent to-transparent opacity-80" />

          {/* Unique Vector Icon: Acoustic "M" Wave with vinyl & sound nodes */}
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4/5 h-4/5 relative z-10 drop-shadow-sm"
          >
            <defs>
              <linearGradient id="melloOrangeGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#EA580C" />
                <stop offset="50%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#FBBF24" />
              </linearGradient>
              <linearGradient id="melloGlowGrad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF7A00" />
                <stop offset="100%" stopColor="#FF4500" />
              </linearGradient>
              <filter id="orangeShadow" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#EA580C" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Acoustic sound wave pillars behind the M */}
            <motion.rect
              animate={animated ? { height: [12, 22, 14, 20, 12], y: [18, 13, 17, 14, 18] } : {}}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              x="6"
              y="18"
              width="3"
              height="12"
              rx="1.5"
              fill="url(#melloOrangeGrad)"
              opacity="0.75"
            />
            <motion.rect
              animate={animated ? { height: [10, 18, 12, 16, 10], y: [19, 15, 18, 16, 19] } : {}}
              transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              x="39"
              y="19"
              width="3"
              height="10"
              rx="1.5"
              fill="url(#melloOrangeGrad)"
              opacity="0.75"
            />

            {/* Stylized Acoustic "M" Harmonic Ribbon */}
            <path
              d="M13 36V18C13 15.2386 15.2386 13 18 13C19.7423 13 21.2829 13.8899 22.1865 15.2473L24 17.973L25.8135 15.2473C26.7171 13.8899 28.2577 13 30 13C32.7614 13 35 15.2386 35 18V36"
              stroke="url(#melloGlowGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#orangeShadow)"
            />

            {/* Central Rhythm Node (Vinyl center pulse) */}
            <circle cx="24" cy="27" r="3" fill="#EA580C" />
            <circle cx="24" cy="27" r="1.5" fill="#FFFFFF" />

            {/* Harmonic Frequency Bars between legs */}
            <line x1="19" y1="26" x2="19" y2="33" stroke="url(#melloOrangeGrad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
            <line x1="29" y1="26" x2="29" y2="33" stroke="url(#melloOrangeGrad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          </svg>
        </div>

        {/* Live dynamic sound beacon pulse */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-80"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500 border border-white"></span>
        </span>
      </motion.div>

      {/* Brand Wordmark */}
      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <span className={`font-black tracking-tight text-stone-900 ${dimensions.text}`}>
              Mello
            </span>
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/25 tracking-wider">
              Music
            </span>
          </div>
          <p className={`${dimensions.sub} text-stone-500 font-medium tracking-normal -mt-0.5`}>
            Global Streams & Beats
          </p>
        </div>
      )}
    </div>
  );
}
