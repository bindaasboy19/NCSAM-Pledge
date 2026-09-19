import React, { useState } from 'react';
import { ShieldCheck, Eye, Compass, Award } from 'lucide-react';
import { TypingText } from './TypingText';
import { PLEDGE_CONFIG } from '../../config/pledgeConfig';

/**
 * Dedicated, immersive reading ceremony for the pledge.
 * Dark blue/black visual environment with subtle pathway milestones:
 * Awareness -> Understanding -> Commitment.
 */
export function PledgeReader({ pledgeText, onPledgeComplete }) {
  const [readingFinished, setReadingFinished] = useState(false);

  const handleComplete = () => {
    setReadingFinished(true);
    if (onPledgeComplete) {
      // Short delay for reflection before showing acceptance
      setTimeout(() => {
        onPledgeComplete();
      }, 500);
    }
  };

  return (
    <section
      className="max-w-3xl mx-auto px-4 py-8"
      aria-labelledby="reader-heading"
    >
      <div className="relative bg-gradient-to-b from-[#0B1F4D]/50 via-[#050505] to-[#050505] border border-[#0B1F4D] rounded-3xl p-6 sm:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Subtle geometric framing in corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#2563EB]/40 rounded-tl-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#2563EB]/40 rounded-tr-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#2563EB]/40 rounded-bl-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#2563EB]/40 rounded-br-3xl pointer-events-none" />

        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-32 bg-[#2563EB]/15 blur-3xl pointer-events-none" />

        {/* Ceremony Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1F4D]/90 border border-blue-400/20 text-[#2563EB] text-xs font-mono font-medium tracking-widest uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Digital Security Oath</span>
          </div>

          <h2
            id="reader-heading"
            className="text-2xl sm:text-4xl font-bold tracking-tight text-white uppercase letter-spacing-wide"
          >
            READ. REFLECT. COMMIT.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 font-light">
            Read the oath carefully as it unfolds. Your solemn pledge to digital safety.
          </p>
        </div>

        {/* Subtle Security Pathway Milestones (Awareness -> Understanding -> Commitment) */}
        <div className="mb-10 max-w-md mx-auto" aria-hidden="true">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>Awareness</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-300" />
              <span>Understanding</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#EC4899]" />
              <span>Commitment</span>
            </div>
          </div>
          <div className="h-1 w-full bg-[#0B1F4D] rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-[#2563EB] via-blue-400 to-[#EC4899] transition-all duration-1000 ease-out ${
                readingFinished ? 'w-full' : 'w-2/3 animate-pulse-slow'
              }`}
            />
          </div>
        </div>

        {/* Dynamic Typing Text Container */}
        <div className="min-h-[160px] sm:min-h-[190px] flex items-center justify-center p-4 sm:p-6 bg-[#050505]/60 rounded-2xl border border-white/5">
          <TypingText
            text={pledgeText}
            speed={PLEDGE_CONFIG.animation.typingSpeedMs}
            onComplete={handleComplete}
            skipEnabled={true}
          />
        </div>

        {/* Reflection Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 italic">
            &ldquo;Security is not a singular action, but an ongoing collective habit.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

export default PledgeReader;
