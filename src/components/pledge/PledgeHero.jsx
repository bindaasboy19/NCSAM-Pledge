import React, { useState, useEffect } from 'react';
import { ArrowRight, Shield, Lock, Users } from 'lucide-react';
import { PLEDGE_CONFIG } from '../../config/pledgeConfig';
import { getPledgeCount } from '../../services/pledgeService';

/**
 * Editorial Light-Theme Campaign Hero for National Cyber Security Awareness Month.
 * 
 * Features:
 * - Prominent full campaign name with refined Manrope/Plus Jakarta typography
 * - Integrated cybersecurity environment graphics (shield geometry, network pathways, connection nodes)
 * - Compact spacing avoiding excessive blank areas
 * - Dynamic floating 'TAKE THE PLEDGE' CTA (subtle 4.5s loop, gentle elevation)
 * - Real backend pledge counter widget
 * - Editorial three-pillar text strip (Vigilance, Privacy, Community)
 */
export function PledgeHero({ onStart }) {
  const { campaign } = PLEDGE_CONFIG;
  const [pledgeCount, setPledgeCount] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getPledgeCount().then((count) => {
      if (isMounted && count !== null && typeof count === 'number') {
        setPledgeCount(count);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      className="relative flex items-center justify-center pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 bg-[#FFFFFF] text-[#050505] overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* ============================================================ */}
      {/* CYBERSECURITY ENVIRONMENT GRAPHICS (Background Layer)         */}
      {/* ============================================================ */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
        aria-hidden="true"
      >
        {/* Central Thin Shield Geometric Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] md:w-[640px] h-[380px] sm:h-[580px] opacity-[0.035] text-[#0B1F4D]">
          <svg viewBox="0 0 200 240" fill="none" className="w-full h-full">
            <path
              d="M100 10 L180 45 V115 C180 170 100 225 100 225 C100 225 20 170 20 115 V45 Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M100 35 L160 62 V115 C160 156 100 198 100 198 C100 198 40 156 40 115 V62 Z"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeDasharray="4 4"
            />
          </svg>
        </div>

        {/* Subtle Decorative Network Pathways across the Canvas */}
        <svg
          className="absolute inset-0 w-full h-full opacity-40 text-[#2563EB]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="heroPathFade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#2563EB" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Desktop network pathways */}
          <g className="hidden md:block">
            {/* Top Left to Center Network */}
            <path
              d="M 50,110 L 180,170 L 260,130 L 340,210"
              stroke="url(#heroPathFade)"
              strokeWidth="1"
              fill="none"
              className="animate-pathway"
            />
            <circle cx="180" cy="170" r="3" fill="#2563EB" fillOpacity="0.25" className="animate-node-pulse" />
            <circle cx="260" cy="130" r="2.5" fill="#2563EB" fillOpacity="0.35" />
            <circle cx="340" cy="210" r="3" fill="#EC4899" fillOpacity="0.35" />

            {/* Top Right Security Circuit */}
            <path
              d="M 850,100 L 980,180 L 920,270 L 1050,310"
              stroke="url(#heroPathFade)"
              strokeWidth="1"
              fill="none"
              className="animate-pathway"
            />
            <circle cx="980" cy="180" r="3" fill="#2563EB" fillOpacity="0.3" className="animate-node-pulse" />
            <circle cx="920" cy="270" r="2.5" fill="#2563EB" fillOpacity="0.35" />

            {/* Bottom Floating Connection Lines */}
            <path
              d="M 120,440 L 220,490 L 310,430"
              stroke="url(#heroPathFade)"
              strokeWidth="0.75"
              strokeDasharray="3 3"
              fill="none"
            />
            <path
              d="M 880,470 L 960,420 L 1080,480"
              stroke="url(#heroPathFade)"
              strokeWidth="0.75"
              strokeDasharray="3 3"
              fill="none"
            />
          </g>
        </svg>
      </div>

      {/* ============================================================ */}
      {/* HERO CONTENT CONTAINER                                        */}
      {/* ============================================================ */}
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center relative z-10">
        {/* Campaign Label Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[#0B1F4D] text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
          <span className="font-heading">{campaign.fullName}</span>
        </div>

        {/* Primary Headline */}
        <h1
          id="hero-title"
          className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#050505] leading-[1.12] mb-5 max-w-3xl"
        >
          Your digital safety begins with a{' '}
          <span className="text-[#2563EB] underline decoration-blue-200 decoration-4 underline-offset-8">
            commitment.
          </span>
        </h1>

        {/* Campaign Subtitle */}
        <p className="font-heading text-base sm:text-lg md:text-xl font-bold text-[#0B1F4D] max-w-2xl mb-2.5 leading-snug">
          {campaign.heroSubtext}
        </p>

        {/* Supporting Narrative */}
        <p className="font-body text-xs sm:text-sm text-slate-600 max-w-xl mb-8 leading-relaxed font-normal">
          {campaign.heroSupportingText}
        </p>

        {/* Dynamic Floating CTA Button */}
        <div className="my-1">
          <button
            onClick={onStart}
            type="button"
            className="animate-floating-cta group inline-flex items-center justify-center gap-3 px-8 py-3.5 text-sm sm:text-base font-bold tracking-wide text-white bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98] hover:scale-[1.02] rounded-xl transition-all duration-200 focus-visible-ring"
            aria-label="Begin the Cyber Safety Pledge"
          >
            <span className="font-heading">{campaign.primaryCta}</span>
            <ArrowRight
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Real Backend-Fed Counter */}
        {pledgeCount !== null && (
          <div className="mt-6 px-4 py-1.5 rounded-full bg-blue-50/70 border border-blue-200/80 text-xs text-[#0B1F4D] flex items-center gap-2 animate-fade-in">
            <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="font-bold text-[#2563EB] font-mono">
              {Number(pledgeCount).toLocaleString()}
            </span>
            <span className="text-slate-600">people have taken the pledge</span>
          </div>
        )}

        {/* Editorial 3-Pillar Text Strip */}
        <div className="mt-12 w-full pt-8 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 text-left max-w-3xl">
          <div className="sm:border-r sm:border-slate-200/80 sm:pr-4">
            <p className="font-heading text-xs font-bold uppercase tracking-wider text-[#0B1F4D] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" />
              <span>Vigilance</span>
            </p>
            <p className="font-body text-xs text-slate-600 mt-1 leading-relaxed">
              Practicing active personal cyber habits and recognizing deception.
            </p>
          </div>

          <div className="sm:border-r sm:border-slate-200/80 sm:pr-4">
            <p className="font-heading text-xs font-bold uppercase tracking-wider text-[#0B1F4D] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" />
              <span>Privacy</span>
            </p>
            <p className="font-body text-xs text-slate-600 mt-1 leading-relaxed">
              Safeguarding confidential information and respecting digital boundaries.
            </p>
          </div>

          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-wider text-[#0B1F4D] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#EC4899]" aria-hidden="true" />
              <span>Community</span>
            </p>
            <p className="font-body text-xs text-slate-600 mt-1 leading-relaxed">
              Spreading cybersecurity awareness to foster collective resilience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PledgeHero;
