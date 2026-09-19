import React from 'react';
import { Check, ShieldCheck, Loader2, Award, ArrowRight } from 'lucide-react';
import { PLEDGE_CONFIG } from '../../config/pledgeConfig';

/**
 * Vertical commitment sequence.
 * Requires all acceptance statements to be checked using accessible native checkboxes
 * before unlocking the 'GENERATE MY CERTIFICATE' action.
 */
export function AcceptanceSection({
  statements = [],
  acceptedIds = [],
  onToggleStatement,
  onGenerateCertificate,
  isGenerating,
  isFullyAccepted,
  errorMessage,
}) {
  return (
    <section
      className="max-w-2xl mx-auto px-4 py-8 animate-fade-in"
      aria-labelledby="acceptance-heading"
    >
      <div className="bg-[#050505]/95 border border-[#0B1F4D] rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-xl">
        {/* Section Heading */}
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-semibold tracking-wider text-[#2563EB] uppercase">
            Step 03 / Formal Acknowledgement
          </span>
          <h2
            id="acceptance-heading"
            className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-2 tracking-tight"
          >
            I ACCEPT THE PLEDGE
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Please confirm your commitment to each core pillar of cyber safety.
            All statements must be accepted to issue your certificate.
          </p>
        </div>

        {/* Error notice if certificate generation failed */}
        {errorMessage && (
          <div
            className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs"
            role="alert"
          >
            <p className="font-semibold text-white">Generation Error</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        )}

        {/* Vertical Commitment Sequence (01, 02, 03) */}
        <fieldset className="space-y-4 mb-8">
          <legend className="sr-only">Acceptance Statements</legend>

          {statements.map((stmt) => {
            const isChecked = acceptedIds.includes(stmt.id);

            return (
              <label
                key={stmt.id}
                htmlFor={stmt.id}
                className={`flex items-start gap-4 p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer select-none group ${
                  isChecked
                    ? 'bg-[#0B1F4D]/40 border-[#2563EB] shadow-[0_0_20px_rgba(37,99,235,0.15)]'
                    : 'bg-[#0B1F4D]/10 border-white/10 hover:border-[#2563EB]/40 hover:bg-[#0B1F4D]/20'
                }`}
              >
                {/* Numeric Step Identifier */}
                <span
                  className={`text-xs font-mono font-bold pt-0.5 transition-colors ${
                    isChecked ? 'text-[#EC4899]' : 'text-slate-500 group-hover:text-slate-400'
                  }`}
                  aria-hidden="true"
                >
                  {stmt.number}
                </span>

                {/* Accessible Native Checkbox with custom visual skin */}
                <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    id={stmt.id}
                    name="pledge-acceptance"
                    checked={isChecked}
                    onChange={() => onToggleStatement(stmt.id)}
                    disabled={isGenerating}
                    className="sr-only peer"
                    aria-describedby={`${stmt.id}-desc`}
                  />
                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-[#2563EB] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#050505] ${
                      isChecked
                        ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                        : 'border-slate-600 bg-[#050505]/80 group-hover:border-slate-400'
                    }`}
                    aria-hidden="true"
                  >
                    {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                {/* Statement Content */}
                <span
                  id={`${stmt.id}-desc`}
                  className={`text-sm sm:text-base leading-snug transition-colors ${
                    isChecked ? 'text-white font-medium' : 'text-slate-300'
                  }`}
                >
                  {stmt.text}
                </span>
              </label>
            );
          })}
        </fieldset>

        {/* Commitment Status Indicator */}
        <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.03] border border-white/5 mb-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck
              className={`w-4 h-4 ${
                isFullyAccepted ? 'text-[#2563EB]' : 'text-slate-600'
              }`}
            />
            <span>
              {acceptedIds.length} of {statements.length} commitments acknowledged
            </span>
          </div>
          <span
            className={`font-semibold ${
              isFullyAccepted ? 'text-blue-400' : 'text-slate-500'
            }`}
          >
            {isFullyAccepted ? 'Ready for certification' : 'Awaiting confirmation'}
          </span>
        </div>

        {/* Generate Certificate CTA Button */}
        <div>
          <button
            type="button"
            onClick={onGenerateCertificate}
            disabled={!isFullyAccepted || isGenerating}
            className={`w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-3 shadow-lg focus-visible-ring ${
              !isFullyAccepted || isGenerating
                ? 'bg-[#0B1F4D]/40 text-slate-500 border border-white/5 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#2563EB] to-blue-600 hover:from-blue-600 hover:to-[#2563EB] text-white shadow-blue-600/30 hover:shadow-blue-600/50 active:scale-[0.99]'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-blue-300" aria-hidden="true" />
                <span>{PLEDGE_CONFIG.loadingMessages.generatingCertificate}</span>
              </>
            ) : (
              <>
                <Award className="w-5 h-5" aria-hidden="true" />
                <span>GENERATE MY CERTIFICATE</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </>
            )}
          </button>

          {!isFullyAccepted && (
            <p className="text-[11px] text-center text-slate-500 mt-2">
              Select all 3 statements above to unlock your certificate.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default AcceptanceSection;
