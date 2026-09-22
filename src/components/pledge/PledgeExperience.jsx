import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Check, ArrowRight, FastForward } from 'lucide-react';
import { PLEDGE_CONFIG } from '../../config/pledgeConfig';

/**
 * Resolve full personalized pledge text safely before animation begins.
 * Removes commitment headings/titles completely as required.
 */
function getFullPledgeText({ language = 'en', title = 'Mr.', name = 'Participant' }) {
  const lang = PLEDGE_CONFIG.content[language] || PLEDGE_CONFIG.content.en;

  const greeting = typeof lang.pledgeGreeting === 'function'
    ? lang.pledgeGreeting(title, name)
    : `I, ${title ? title + ' ' : ''}${name}, pledge to be a safe and responsible digital citizen. I will:`;

  const commitments = Array.isArray(lang.commitments) ? lang.commitments : [];
  const fullText = [greeting, ...commitments].join('\n\n');

  return {
    greeting,
    commitments,
    fullText,
  };
}

/**
 * PledgeExperience: Fail-Safe, Editorial Character-by-Character Pledge Reader.
 * 
 * Guarantees:
 * 1. NEVER crashes or renders a white screen: Single string slice, stable tree, no unmounting.
 * 2. NO commitment titles (01 — TITLE headers removed).
 * 3. First character rendered immediately: displayedText is never empty.
 * 4. Progressive character typing with natural punctuation pauses.
 * 5. Blinking cursor at the active typing position, disappearing cleanly when complete.
 * 6. Instant "Skip animation" button.
 * 7. Single acceptance checkbox revealed only after typing completes or is skipped.
 * 8. "FINISH THE PLEDGE" button revealed only after checkbox is checked.
 */
export function PledgeExperience({
  title = 'Mr.',
  name = 'Participant',
  language = 'en',
  onFinishPledge,
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

  const fullText = fullPledge.fullText;
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

  return (
    <div className={`max-w-[760px] mx-auto px-4 sm:px-6 py-2 sm:py-4 ${isHindi ? 'font-hindi' : 'font-body'}`}>
      {/* ============================================================ */}
      {/* 1. PLEDGE HEADER                                             */}
      {/* ============================================================ */}
      <section aria-labelledby="pledge-heading" className="text-left">
        <div className="mb-3">
          <span className="font-heading text-xs font-bold tracking-widest text-[#2563EB] uppercase block">
            {langContent.campaignName}
          </span>
          <h1
            id="pledge-heading"
            className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0B1F4D] tracking-tight mt-1 mb-1"
          >
            {langContent.readReflectCommit}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            {langContent.pledgeSubtext}
          </p>
        </div>

        {/* Hairline Divider */}
        <div className="w-full h-[1px] bg-slate-200/80 mb-4" aria-hidden="true" />

        {/* ============================================================ */}
        {/* 2. PROGRESSIVE PLEDGE TEXT (No titles, pure commitments)     */}
        {/* ============================================================ */}
        <div className="space-y-3 sm:space-y-3.5 my-4" aria-live="polite">
          {displayedParagraphs.map((paragraph, idx) => {
            const isLastParagraph = idx === displayedParagraphs.length - 1;
            const isGreeting = idx === 0;

            return (
              <p
                key={idx}
                className={
                  isGreeting
                    ? `font-heading text-base sm:text-lg md:text-xl font-bold text-[#050505] leading-relaxed select-text ${
                        isHindi ? 'font-hindi' : ''
                      }`
                    : `text-sm sm:text-base md:text-[17px] text-slate-700 font-normal leading-[1.7] sm:leading-[1.8] select-text ${
                        isHindi ? 'font-hindi leading-[1.85] sm:leading-[1.95]' : 'font-body'
                      }`
                }
              >
                {paragraph}
                {isTyping && isLastParagraph && (
                  <span className="typing-cursor" aria-hidden="true" />
                )}
              </p>
            );
          })}
        </div>

        {/* Skip Animation Button */}
        {isTyping && !isReducedMotion && (
          <div className="flex justify-end pt-1">
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
      </section>

      {/* ============================================================ */}
      {/* 3. ACCEPTANCE SECTION (Revealed strictly after typing)       */}
      {/* ============================================================ */}
      {!isTyping && (
        <section
          aria-labelledby="acceptance-heading"
          className="mt-6 pt-4 border-t border-slate-200/80 animate-fade-slide-up"
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
            <div className="mt-5 pt-1 animate-fade-slide-up flex flex-col items-start">
              <button
                type="button"
                onClick={onFinishPledge}
                className="px-8 py-3 text-sm font-heading font-bold tracking-wide text-white bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99] rounded-xl shadow-sm hover:shadow-md transition-all duration-150 inline-flex items-center gap-2.5 focus-visible-ring"
              >
                <span>{langContent.finishButton}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default PledgeExperience;
