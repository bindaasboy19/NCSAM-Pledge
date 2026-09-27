import React, { useState, useEffect } from 'react';
import { ArrowRight, Shield, Lock, Users } from 'lucide-react';
import { PLEDGE_CONFIG } from '../../config/pledgeConfig';
import { getPledgeCount } from '../../services/pledgeService';

/**
 * Editorial Light-Theme Campaign Hero for National Cyber Security Awareness Month.
 * Inspired by reference cinematic hero composition:
 * - Large rounded visual container with muted looping background video
 * - High-contrast translucent overlay for optimal typography legibility
 * - Prominent elevated 'TAKE THE PLEDGE' CTA
 * - Live backend pledge counter pill
 * - Clean 3-pillar editorial cards below the hero
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
      className="relative pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 bg-[#FFFFFF] text-[#050505] overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* ============================================================ */}
        {/* CINEMATIC VIDEO HERO CONTAINER                               */}
        {/* ============================================================ */}
        <div className="w-full rounded-2xl sm:rounded-3xl md:rounded-[32px] overflow-hidden shadow-xl sm:shadow-2xl relative min-h-[580px] sm:min-h-[630px] md:min-h-[700px] flex items-center justify-center p-6 sm:p-10 md:p-16 border border-slate-200/80 bg-[#0B1F4D]">
          {/* Background Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-[1] contrast-[1.05]"
          >
            <source src="/Video.mp4" type="video/mp4" />
            <source src="/video.mp4" type="video/mp4" />

          </video>

          {/* Cinematic Translucent Gradient Overlay for Legibility */}
          <div
            className="absolute inset-0 z-10 bg-gradient-to-b from-[#050505]/75 via-[#0B1F4D]/55 to-[#050505]/85"
            aria-hidden="true"
          />

          {/* Hero Foreground Content */}
          <div className="relative z-20 text-center max-w-3xl mx-auto flex flex-col items-center">
            {/* Campaign Category Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-pulse" />
              <span className="font-heading">{campaign.fullName}</span>
            </div>

            {/* Display Headline */}
            <h1
              id="hero-title"
              className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.14] mb-4 drop-shadow-sm"
            >
              This Cybersecurity Month,{' '}
              <span className="text-[#60A5FA]">
                Pledge to Protect Yourself
              </span>{' '}
              and Others Online.
            </h1>

            {/* Supporting Campaign Statement */}
            <p className="font-body text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto mb-8 font-normal leading-relaxed drop-shadow-xs">
              {campaign.heroSubtext} Join thousands of citizens across India building a safer, more vigilant digital nation.
            </p>

            {/* Primary CTA Button */}
            <div className="my-1">
              <button
                onClick={onStart}
                type="button"
                className="group inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 text-base sm:text-lg font-heading font-extrabold tracking-wide text-white bg-[#2563EB] hover:bg-blue-600 active:scale-[0.98] hover:scale-[1.4] rounded-xl shadow-lg shadow-blue-600/50 transition-all duration-200 focus-visible-ring"
                aria-label="Begin the Cyber Safety Pledge"
              >
                <span>{campaign.primaryCta}</span>
                <ArrowRight
                  className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Live Counter Pill */}
            {pledgeCount !== null ? (
              <div className="mt-7 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs text-white/90 shadow-sm animate-fade-in">
                <Shield className="w-4 h-4 text-[#60A5FA]" aria-hidden="true" />
                <span className="font-bold text-white font-mono text-sm">
                  {Number(pledgeCount).toLocaleString()}
                </span>
                <span className="text-slate-300">Citizens Have Taken the Pledge</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* ============================================================ */}
        {/* EDITORIAL THREE-PILLAR STRIP (Below Cinematic Card)          */}
        {/* ============================================================ */}
        <div className="mt-12 sm:mt-16 w-full grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-left">
          <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 transition-all hover:shadow-sm">
            <p className="font-heading text-sm font-bold uppercase tracking-wider text-[#0B1F4D] flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#2563EB]">
                <Shield className="w-4 h-4" aria-hidden="true" />
              </span>
              <span>Vigilance</span>
            </p>
            <p className="font-body text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
              Practicing active personal cyber habits and recognizing online deception before opening unknown links or attachments.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 transition-all hover:shadow-sm">
            <p className="font-heading text-sm font-bold uppercase tracking-wider text-[#0B1F4D] flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#2563EB]">
                <Lock className="w-4 h-4" aria-hidden="true" />
              </span>
              <span>Privacy</span>
            </p>
            <p className="font-body text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
              Safeguarding confidential credentials, OTPs, and bank details, respecting personal digital boundaries.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 transition-all hover:shadow-sm">
            <p className="font-heading text-sm font-bold uppercase tracking-wider text-[#0B1F4D] flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-[#EC4899]">
                <Users className="w-4 h-4" aria-hidden="true" />
              </span>
              <span>Community</span>
            </p>
            <p className="font-body text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
              Spreading awareness among family and peers to foster collective national cyber resilience and safe digital citizenship.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PledgeHero;
