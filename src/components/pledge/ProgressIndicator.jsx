import React from 'react';

const STEPS = [
  { key: 'DETAILS', number: '01', label: 'YOUR DETAILS' },
  { key: 'PLEDGE', number: '02', label: 'THE PLEDGE' },
  { key: 'CERTIFICATE', number: '03', label: 'CERTIFICATE' },
];

/**
 * Clean, understated light-theme journey indicator.
 */
export function ProgressIndicator({ currentStage }) {
  const stageToIndex = {
    INTRO: -1,
    DETAILS: 0,
    PLEDGE: 1,
    ACCEPTANCE: 1, // Pledge and Acceptance are one continuous step
    CERTIFICATE: 2,
  };

  const activeIndex = stageToIndex[currentStage] ?? 0;

  if (currentStage === 'INTRO') {
    return null;
  }

  return (
    <nav
      aria-label="Pledge progress"
      className="w-full max-w-xl mx-auto mb-10 px-4"
    >
      <ol className="flex items-center justify-between relative">
        {/* Subtle background connecting line */}
        <div
          className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[1px] bg-slate-200 z-0"
          aria-hidden="true"
        />
        {/* Active progress fill line */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-[1px] bg-[#2563EB] z-0 transition-all duration-300 ease-out"
          style={{
            width: `${Math.max(0, Math.min(100, (activeIndex / (STEPS.length - 1)) * 92))}%`,
          }}
          aria-hidden="true"
        />

        {STEPS.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <li
              key={step.key}
              aria-current={isCurrent ? 'step' : undefined}
              className="relative z-10 flex flex-col items-center group"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-all duration-200 ${
                  isCurrent
                    ? 'bg-[#2563EB] text-white ring-4 ring-blue-100 shadow-sm'
                    : isCompleted
                    ? 'bg-[#0B1F4D] text-white'
                    : 'bg-white text-slate-400 border border-slate-300'
                }`}
              >
                {step.number}
              </div>
              <span
                className={`mt-2 text-[10px] tracking-wider uppercase font-semibold transition-colors ${
                  isCurrent
                    ? 'text-[#2563EB]'
                    : isCompleted
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default ProgressIndicator;
