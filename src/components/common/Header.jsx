import React, { useState, useEffect } from 'react';
import { Shield, RotateCcw } from 'lucide-react';

/**
 * Minimalist, elegant light-theme header featuring the provided logo.
 */
export function Header({ currentStage, onReset, isDevPreview }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 bg-white ${
        isScrolled ? 'border-b border-slate-200 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]' : 'border-b border-slate-100 py-4'
      }`}
      role="banner"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
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

        {/* Right Actions / Campaign Badge */}
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

          <div className="flex items-center gap-1.5 text-xs font-medium text-[#0B1F4D] bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
            <Shield className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" />
            <span className="tracking-wide">NCSAM CAMPAIGN</span>
          </div>

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
