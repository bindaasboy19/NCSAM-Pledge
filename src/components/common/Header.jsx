import React, { useState, useEffect } from 'react';
import { Shield, RotateCcw } from 'lucide-react';
import { getPledgeCount } from '../../services/pledgeService';

/**
 * Minimalist, elegant light-theme header.
 * 
 * Features:
 * - Official campaign logo (logo.png)
 * - Live backend-fed Pledge Counter (replaces "NCSAM Campaign" badge)
 * - Graceful handling: hides or stays minimal if backend counter is unavailable (no fake numbers)
 * - Start over button when not on landing page
 */
export function Header({ currentStage, onReset, isDevPreview }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [pledgeCount, setPledgeCount] = useState(null);
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;
    getPledgeCount()
      .then((count) => {
        if (isMounted) {
          if (count !== null && typeof count === 'number') {
            setPledgeCount(count);
          }
          setIsLoadingCount(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingCount(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 bg-white ${
        isScrolled
          ? 'border-b border-slate-200 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
          : 'border-b border-slate-100 py-3.5'
      }`}
      role="banner"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Provided Logo Link */}
        <a
          href="#top"
          className="flex items-center gap-2 focus-visible-ring rounded-lg p-0.5"
          aria-label="NCSAM Cyber Safety Pledge Home"
        >
          <img
            src="/logo.png"
            alt="The Cyber Shield Project - Naksh Foundation"
            className="h-8 sm:h-9 w-auto object-contain"
          />
        </a>

        {/* Right Actions: Real Backend Pledge Counter & Reset Button */}
        <div className="flex items-center gap-3">
          {isDevPreview && (
            <span
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-full"
              title="Spring Boot backend is offline; operating via isolated development adapter"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Dev Mode
            </span>
          )}

          {/* Real Backend-Fed Pledge Counter (Replaces static "NCSAM Campaign" badge) */}
          {pledgeCount !== null ? (
            <div
              className="flex items-center gap-2 text-xs text-[#0B1F4D] bg-blue-50/60 border border-blue-200/80 px-3 py-1.5 rounded-full transition-all"
              aria-label={`${Number(pledgeCount).toLocaleString()} people pledged`}
            >
              <Shield className="w-3.5 h-3.5 text-[#2563EB] shrink-0" aria-hidden="true" />
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-[#050505] font-mono">
                  {Number(pledgeCount).toLocaleString()}
                </span>
                <span className="text-slate-600 font-medium hidden sm:inline">
                  People Pledged
                </span>
                <span className="text-slate-600 font-medium sm:hidden">
                  Pledged
                </span>
              </div>
            </div>
          ) : isLoadingCount ? (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />
              <span>Checking pledge count...</span>
            </div>
          ) : null}

          {/* Start Over Button */}
          {currentStage !== 'INTRO' && (
            <button
              onClick={onReset}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#050505] transition-colors px-2.5 py-1.5 rounded-md hover:bg-slate-100 focus-visible-ring"
              title="Restart pledge process"
              aria-label="Restart pledge process"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Start over</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
