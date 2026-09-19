import React from 'react';
import { ArrowRight, Shield, Lock, Users } from 'lucide-react';
import { PLEDGE_CONFIG } from '../../config/pledgeConfig';

/**
 * Editorial Light-Theme Campaign Hero.
 * Focuses on strong typography, ample whitespace, and restraint rather than AI-card tropes.
 */
export function PledgeHero({ onStart }) {
  const { campaign } = PLEDGE_CONFIG;

  return (
    <section
      className="relative min-h-[82vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 bg-[#FFFFFF] text-[#050505]"
      aria-labelledby="hero-title"
    >
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
        {/* Campaign Label Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[#0B1F4D] text-xs font-semibold tracking-wider uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" />
          <span>{campaign.heroBadge}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">{campaign.shortTitle}</span>
        </div>

        {/* Major Headline */}
        <h1
          id="hero-title"
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#050505] leading-[1.08] mb-6"
        >
          Your digital safety begins with a{' '}
          <span className="text-[#2563EB] underline decoration-blue-200 decoration-4 underline-offset-8">
            commitment.
          </span>
        </h1>

        {/* Narrative / Supporting Text */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed font-normal">
          {campaign.heroSubtext}
        </p>

        {/* Primary CTA Button */}
        <div>
          <button
            onClick={onStart}
            type="button"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-semibold text-white bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99] rounded-xl shadow-sm hover:shadow-md transition-all duration-150 focus-visible-ring"
          >
            <span>{campaign.primaryCta}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Editorial 3-Pillar Text Strip (Clean typography and thin dividers, NOT cards) */}
        <div className="mt-16 w-full pt-10 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-left">
          <div className="sm:border-r sm:border-slate-200 sm:pr-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#0B1F4D] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" />
              <span>Vigilance</span>
            </p>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Practicing active personal cyber habits and recognizing deception.
            </p>
          </div>

          <div className="sm:border-r sm:border-slate-200 sm:pr-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#0B1F4D] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" />
              <span>Privacy</span>
            </p>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Safeguarding confidential information and respecting digital boundaries.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#0B1F4D] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#EC4899]" aria-hidden="true" />
              <span>Community</span>
            </p>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Spreading cybersecurity awareness to foster collective resilience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PledgeHero;
