import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

/**
 * Contextual loading state component for smooth transitions between pledge steps.
 */
export function LoadingState({ message = 'Loading...', subtitle }) {
  return (
    <div
      className="flex flex-col items-center justify-center p-12 text-center animate-fade-in"
      role="status"
      aria-live="polite"
    >
      <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="absolute inset-0 rounded-full border-2 border-[#2563EB]/20 border-t-[#2563EB] animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-[#EC4899]/10 border-b-[#EC4899] animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
        
        {/* Center Shield Icon */}
        <Shield className="w-6 h-6 text-[#2563EB] animate-pulse-slow" aria-hidden="true" />
      </div>

      <p className="text-base sm:text-lg font-semibold text-white tracking-wide">
        {message}
      </p>

      {subtitle && (
        <p className="text-xs text-slate-400 mt-1 max-w-xs font-light">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default LoadingState;
