import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FastForward } from 'lucide-react';

/**
 * Reusable TypingText component.
 * Progressively renders text with natural cadence, blinking cursor,
 * and a subtle 'Skip animation' control.
 * Immediately renders full text if prefers-reduced-motion is detected.
 */
export function TypingText({
  text = '',
  speed = 10,
  onComplete,
  skipEnabled = true,
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  // Check if reduced motion is requested
  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const finishTyping = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayedText(text);
    setIsCompleted(true);
    if (onComplete) onComplete();
  }, [text, onComplete]);

  useEffect(() => {
    // If user prefers reduced motion, complete immediately
    if (isReducedMotion) {
      setDisplayedText(text);
      setIsCompleted(true);
      if (onComplete) onComplete();
      return;
    }

    indexRef.current = 0;
    setDisplayedText('');
    setIsCompleted(false);

    timerRef.current = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current <= text.length) {
        setDisplayedText(text.slice(0, indexRef.current));
      } else {
        clearInterval(timerRef.current);
        setIsCompleted(true);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed, isReducedMotion, onComplete]);

  return (
    <div className="relative">
      <div
        className="font-serif text-lg sm:text-2xl md:text-3xl text-slate-100 leading-relaxed sm:leading-loose tracking-wide font-light select-text"
        aria-live="polite"
      >
        <span>&ldquo;{displayedText}&rdquo;</span>
        {!isCompleted && !isReducedMotion && (
          <span className="typing-cursor" aria-hidden="true" />
        )}
      </div>

      {/* Subtle Skip Animation Button */}
      {skipEnabled && !isCompleted && !isReducedMotion && (
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={finishTyping}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-blue-300 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors focus-visible-ring"
            aria-label="Skip typing animation and show full pledge text"
          >
            <FastForward className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Skip animation</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default TypingText;
