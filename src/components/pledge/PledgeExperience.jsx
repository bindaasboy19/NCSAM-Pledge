import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Check, ArrowRight, Loader2, FastForward, Award } from 'lucide-react';
import { PLEDGE_CONFIG } from '../../config/pledgeConfig';

/**
 * Continuous Editorial Pledge Experience.
 * 
 * Flow:
 * 1. Centered reading area with clean typography & whitespace (not a card).
 * 2. Natural typing animation with blinking cursor & subtle skip link.
 * 3. When typing finishes: completed pledge REMAINS VISIBLE.
 * 4. Acceptance statements reveal DIRECTLY BELOW the pledge separated by hairline dividers.
 * 5. 'GENERATE MY CERTIFICATE' button remains COMPLETELY HIDDEN until all checkboxes are checked.
 * 6. When all checkboxes are selected, button smoothly fades and slides into view.
 */
export function PledgeExperience({
  pledgeText,
  statements = [],
  acceptedIds = [],
  onToggleStatement,
  onGenerateCertificate,
  isGenerating,
  errorMessage,
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  // Check prefers-reduced-motion
  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const speed = PLEDGE_CONFIG.animation.typingSpeedMs || 26;

  const finishTyping = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayedText(pledgeText);
    setIsTypingComplete(true);
  }, [pledgeText]);

  useEffect(() => {
    if (isReducedMotion) {
      setDisplayedText(pledgeText);
      setIsTypingComplete(true);
      return;
    }

    indexRef.current = 0;
    setDisplayedText('');
    setIsTypingComplete(false);

    timerRef.current = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current <= pledgeText.length) {
        setDisplayedText(pledgeText.slice(0, indexRef.current));
      } else {
        clearInterval(timerRef.current);
        setIsTypingComplete(true);
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pledgeText, speed, isReducedMotion]);

  // Are all required acceptance statements selected?
  const allAccepted =
    statements.length > 0 &&
    statements.every((stmt) => acceptedIds.includes(stmt.id));

  return (
    <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* ============================================================ */}
      {/* 1. PLEDGE READING SECTION (Permanent, Never Hidden)           */}
      {/* ============================================================ */}
      <section aria-labelledby="pledge-heading" className="text-left">
        {/* Editorial Subheading & Label */}
        <div className="mb-6">
          <span className="text-xs font-mono font-bold tracking-widest text-[#2563EB] uppercase block">
            THE CYBER SAFETY PLEDGE
          </span>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
            Read carefully. Make the commitment your own.
          </p>
        </div>

        {/* Hairline Divider */}
        <div className="w-full h-[1px] bg-slate-200 mb-8" aria-hidden="true" />

        {/* Pledge Body Text with Natural Typing Animation */}
        <div
          className="text-xl sm:text-2xl md:text-3xl text-[#050505] leading-[1.6] sm:leading-[1.65] font-normal tracking-[-0.01em] select-text"
          aria-live="polite"
        >
          <span>&ldquo;{displayedText}&rdquo;</span>
          {!isTypingComplete && !isReducedMotion && (
            <span className="typing-cursor" aria-hidden="true" />
          )}
        </div>

        {/* Subtle Skip Animation Link (positioned nearby, understated) */}
        {!isTypingComplete && !isReducedMotion && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={finishTyping}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-[#2563EB] transition-colors py-1 px-2 rounded focus-visible-ring"
              aria-label="Skip typing animation and show full pledge"
            >
              <span>Skip animation</span>
              <FastForward className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* 2. ACCEPTANCE SECTION (Reveals Directly Below upon Typing)   */}
      {/* ============================================================ */}
      {isTypingComplete && (
        <section
          aria-labelledby="acceptance-heading"
          className="mt-12 pt-8 animate-fade-slide-up"
        >
          {/* Hairline Divider Separating Pledge from Acceptance */}
          <div className="w-full h-[1px] bg-slate-200 mb-8" aria-hidden="true" />

          {/* Acceptance Heading */}
          <div className="mb-6">
            <h2
              id="acceptance-heading"
              className="text-xs font-mono font-bold tracking-widest text-[#0B1F4D] uppercase"
            >
              I ACCEPT THE PLEDGE
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm your personal adherence to each principle below:
            </p>
          </div>

          {/* Global Error Banner if API error occurred */}
          {errorMessage && (
            <div
              className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs"
              role="alert"
            >
              <p className="font-semibold text-red-900">Certificate Generation Error</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          )}

          {/* Vertical Editorial Commitment List (01, 02, 03) */}
          <fieldset className="space-y-0">
            <legend className="sr-only">Acceptance Statements</legend>

            {statements.map((stmt, idx) => {
              const isChecked = acceptedIds.includes(stmt.id);

              return (
                <div key={stmt.id}>
                  <label
                    htmlFor={stmt.id}
                    className="flex items-start gap-4 py-4 sm:py-5 group cursor-pointer select-none transition-colors"
                  >
                    {/* Subtle Numeric Identifier */}
                    <span
                      className={`text-xs font-mono font-semibold pt-0.5 transition-colors shrink-0 ${
                        isChecked ? 'text-[#2563EB]' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                      aria-hidden="true"
                    >
                      {stmt.number}
                    </span>

                    {/* Real Accessible Checkbox */}
                    <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        id={stmt.id}
                        name="acceptance-statement"
                        checked={isChecked}
                        onChange={() => onToggleStatement(stmt.id)}
                        disabled={isGenerating}
                        className="sr-only peer"
                        aria-describedby={`${stmt.id}-text`}
                      />
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-[#2563EB] peer-focus-visible:ring-offset-2 ${
                          isChecked
                            ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-sm'
                            : 'border-slate-300 bg-white group-hover:border-slate-400'
                        }`}
                        aria-hidden="true"
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Statement Text */}
                    <span
                      id={`${stmt.id}-text`}
                      className={`text-sm sm:text-base leading-relaxed transition-colors ${
                        isChecked ? 'text-[#050505] font-medium' : 'text-slate-700 group-hover:text-slate-900'
                      }`}
                    >
                      {stmt.text}
                    </span>
                  </label>

                  {/* Thin Hairline Divider between items */}
                  {idx < statements.length - 1 && (
                    <div className="w-full h-[1px] bg-slate-100" aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </fieldset>

          {/* Bottom Hairline Divider */}
          <div className="w-full h-[1px] bg-slate-200 mt-4 mb-8" aria-hidden="true" />

          {/* ============================================================ */}
          {/* 3. GENERATE CERTIFICATE BUTTON (REVEALED ONLY AFTER ALL CHECKED) */}
          {/* ============================================================ */}
          {allAccepted ? (
            <div className="flex flex-col items-center sm:items-start animate-fade-slide-up">
              <button
                type="button"
                onClick={onGenerateCertificate}
                disabled={isGenerating}
                className={`px-8 py-3.5 text-sm font-semibold tracking-wide text-white bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99] rounded-xl shadow-sm hover:shadow-md transition-all duration-150 inline-flex items-center gap-2.5 focus-visible-ring ${
                  isGenerating ? 'opacity-80 cursor-wait' : ''
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" aria-hidden="true" />
                    <span>{PLEDGE_CONFIG.loadingMessages.generatingCertificate}</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" aria-hidden="true" />
                    <span>GENERATE MY CERTIFICATE</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              Please acknowledge all 3 commitments above to generate your official certificate.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

export default PledgeExperience;
