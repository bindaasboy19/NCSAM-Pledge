import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Check, ArrowRight, ArrowLeft, FastForward } from 'lucide-react';
import { PLEDGE_CONFIG } from '../../config/pledgeConfig';

/**
 * Resolve full personalized pledge text safely before animation begins.
 */
function getFullPledgeText({ language = 'en', title = 'Mr.', name = 'Participant' }) {
  const lang = PLEDGE_CONFIG.content[language] || PLEDGE_CONFIG.content.en;

  const greeting = typeof lang.pledgeGreeting === 'function'
    ? lang.pledgeGreeting(title, name)
    : `I, ${name}, pledge to be a safe and responsible digital citizen. I will:`;

  const commitments = Array.isArray(lang.commitments) ? lang.commitments : [];
  const fullParagraphs = [greeting, ...commitments];
  const fullText = fullParagraphs.join('\n\n');

  return {
    greeting,
    commitments,
    fullParagraphs,
    fullText,
  };
}

/**
 * PledgeExperience: Editorial, Calm, Fixed-Ratio Character-by-Character Pledge Reader.
 * 
 * Hard UX Guarantees (per specifications):
 * 1. HEADING NEVER MOVES: Completely isolated, centered header with zero layout shifts.
 * 2. FIXED STARTING POSITION: Typed text always starts at the exact same predetermined top-left pixel.
 * 3. ZERO CONTAINER JUMP / SHIFT: Uses an invisible scaffold layer containing the full text
 *    to reserve 100% of the final required dimensions from millisecond 0.
 * 4. PURE TYPING ANIMATION: Zero bouncing cards, zero sliding headers, zero animated borders.
 * 5. BACK NAVIGATION: Clear 'Back' button returning to Step 1 with all personal data intact.
 * 6. SKIP ANIMATION: Discrete button to reveal full pledge immediately.
 * 7. CLEAR ACCEPTANCE & FINISH: Unlocks checkbox upon completion, revealing 'FINISH THE PLEDGE'.
 */
export function PledgeExperience({
  title = 'Mr.',
  name = 'Participant',
  language = 'en',
  onFinishPledge,
  onBack,
}) {
  const langContent = PLEDGE_CONFIG.content[language] || PLEDGE_CONFIG.content.en;
  const isHindi = language === 'hi';

  // Check prefers-reduced-motion
  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Resolve the full pledge text once for this participant
  const fullPledge = useMemo(() => {
    return getFullPledgeText({ language, title, name });
  }, [language, title, name]);

  const { fullText, fullParagraphs } = fullPledge;
  const typingSpeed = PLEDGE_CONFIG.animation?.typingSpeedMs || 85;

  // Fail-safe typing state: start at index 1 so first character is already rendered (never empty!)
  const [charIndex, setCharIndex] = useState(isReducedMotion ? fullText.length : 1);
  const [isTyping, setIsTyping] = useState(!isReducedMotion);
  const [isAccepted, setIsAccepted] = useState(false);

  const timerRef = useRef(null);

  // Instant skip animation handler
  const handleSkipAnimation = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCharIndex(fullText.length);
    setIsTyping(false);
  }, [fullText.length]);

  // Progressive character-by-character typing loop
  useEffect(() => {
    if (isReducedMotion || !isTyping || charIndex >= fullText.length) return;

    const char = fullText[charIndex - 1];
    let delay = typingSpeed;
    if (char === '.' || char === '।' || char === ':') {
      delay = typingSpeed * 2.2;
    } else if (char === ',' || char === ';') {
      delay = typingSpeed * 1.5;
    } else if (char === '\n') {
      delay = typingSpeed * 2.5; // Natural pause between paragraphs
    }

    timerRef.current = setTimeout(() => {
      setCharIndex((prev) => {
        const next = prev + 1;
        if (next >= fullText.length) {
          setIsTyping(false);
          return fullText.length;
        }
        return next;
      });
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [charIndex, isTyping, fullText, typingSpeed, isReducedMotion]);

  // Fail-safe progressive text slice: slice never throws even with out-of-bounds indices
  const displayedText = fullText.slice(0, charIndex);
  const displayedParagraphs = displayedText.split('\n\n');

  const greetingClasses = `font-heading text-base sm:text-lg md:text-xl font-bold text-[#050505] leading-relaxed select-text ${
    isHindi ? 'font-hindi' : ''
  }`;

  const commitmentClasses = `text-sm sm:text-base md:text-[17px] text-slate-700 font-normal leading-[1.7] sm:leading-[1.8] select-text ${
    isHindi ? 'font-hindi leading-[1.85] sm:leading-[1.95]' : 'font-body'
  }`;

  return (
    <div
      className={`w-full max-w-[880px] mx-auto px-4 sm:px-6 py-2 sm:py-4 ${
        isHindi ? 'font-hindi' : 'font-body'
      }`}
    >
      {/* ============================================================ */}
      {/* 1. FIXED & CENTERED PLEDGE HEADER (Never moves during typing) */}
      {/* ============================================================ */}
      <header className="text-center mb-6 sm:mb-8 select-none" aria-labelledby="pledge-heading">
        <span className="font-heading text-xs font-bold tracking-widest text-[#2563EB] uppercase block mb-1">
          {langContent.campaignName}
        </span>
        <h1
          id="pledge-heading"
          className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1F4D] tracking-tight mb-2"
        >
          {langContent.readReflectCommit}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal max-w-md mx-auto">
          {langContent.pledgeSubtext}
        </p>
        <div className="w-16 h-[2px] bg-blue-100 mx-auto mt-4 rounded-full" aria-hidden="true" />
      </header>

      {/* ============================================================ */}
      {/* 2. STABLE PLEDGE CARD (Reserved dimensions via scaffold)     */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative">
        {/* Skip Animation Button (Top Right of Card) */}
        {isTyping && !isReducedMotion && (
          <div className="flex justify-end mb-3">
            <button
              type="button"
              onClick={handleSkipAnimation}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#2563EB] transition-colors py-1 px-3 rounded-full border border-slate-200 hover:border-blue-300 focus-visible-ring"
              aria-label="Skip typing animation and display complete pledge immediately"
            >
              <span>{PLEDGE_CONFIG.animation?.skipLabel || 'Skip animation'}</span>
              <FastForward className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Stable Reading Area */}
        <div className="relative w-full text-left">
          {/* A. Invisible Measurement Scaffold (holds exact final height from frame 0) */}
          <div
            className="invisible pointer-events-none select-none space-y-3.5 sm:space-y-4"
            aria-hidden="true"
          >
            {fullParagraphs.map((paragraph, idx) => (
              <p key={idx} className={idx === 0 ? greetingClasses : commitmentClasses}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* B. Active Progressive Typed Text (positioned directly on top of scaffold) */}
          <div
            className="absolute top-0 left-0 right-0 space-y-3.5 sm:space-y-4 text-left"
            aria-live="polite"
          >
            {displayedParagraphs.map((paragraph, idx) => {
              const isLastParagraph = idx === displayedParagraphs.length - 1;
              const isGreeting = idx === 0;

              return (
                <p
                  key={idx}
                  className={isGreeting ? greetingClasses : commitmentClasses}
                >
                  {paragraph}
                  {isTyping && isLastParagraph && (
                    <span className="typing-cursor" aria-hidden="true" />
                  )}
                </p>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. ACCEPTANCE SECTION (Revealed strictly after typing)       */}
        {/* ============================================================ */}
        {!isTyping && (
          <section
            aria-labelledby="acceptance-heading"
            className="mt-8 pt-6 border-t border-slate-200/80 text-left"
          >
            {/* Single Acceptance Checkbox */}
            <label
              htmlFor="acceptance-checkbox"
              className="flex items-start gap-3.5 py-2 cursor-pointer select-none group transition-colors"
            >
              <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  id="acceptance-checkbox"
                  name="pledge-acceptance"
                  checked={isAccepted}
                  onChange={(e) => setIsAccepted(e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-[#2563EB] peer-focus-visible:ring-offset-2 ${
                    isAccepted
                      ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-sm'
                      : 'border-slate-300 bg-white group-hover:border-slate-400'
                  }`}
                  aria-hidden="true"
                >
                  {isAccepted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              <span className="font-heading text-sm sm:text-base font-semibold text-[#0B1F4D] leading-snug group-hover:text-black transition-colors">
                {langContent.acceptanceStatement}
              </span>
            </label>

            {/* ============================================================ */}
            {/* 4. FINISH THE PLEDGE BUTTON (Reveals after checkbox ticked)   */}
            {/* ============================================================ */}
            {isAccepted && (
              <div className="mt-5 pt-1 flex flex-col items-start">
                <button
                  type="button"
                  onClick={onFinishPledge}
                  className="px-8 py-3.5 text-sm sm:text-base font-heading font-bold tracking-wide text-white bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99] rounded-xl shadow-sm hover:shadow-md transition-all duration-150 inline-flex items-center gap-2.5 focus-visible-ring"
                >
                  <span>{langContent.finishButton}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </section>
        )}
      </div>

      {/* ============================================================ */}
      {/* 5. BACK NAVIGATION BUTTON (Always available on Pledge screen) */}
      {/* ============================================================ */}
      <div className="mt-6 flex items-center justify-start">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#050505] transition-colors py-2 px-3 rounded-lg hover:bg-slate-100 focus-visible-ring"
          aria-label="Go back to introduction step"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
}

export default PledgeExperience;
