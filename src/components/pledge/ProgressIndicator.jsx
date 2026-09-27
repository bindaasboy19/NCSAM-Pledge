import React from 'react';

const STEPS = [
  { key: 'INTRO', number: '01', label: 'Introduction' },
  { key: 'PLEDGE', number: '02', label: 'Your Pledge' },
  { key: 'DETAILS', number: '03', label: 'Your Details' },
  { key: 'SUCCESS', number: '04', label: 'Completed' },
];

/**
 * Editorial Light-Theme Campaign Progress Indicator.
 * Renders a subtle, non-checkout progress track across:
 * 01 Introduction -> 02 Your Pledge -> 03 Your Details -> 04 Completed
 */
export function ProgressIndicator({ currentStage }) {
  const stageToIndex = {
    INTRO: 0,
    INITIAL_SETUP: 0,
    PLEDGE_READING: 1,
    DETAILS: 2,
    SUCCESS: 3,
  };

  const activeIndex = stageToIndex[currentStage] ?? 0;

  // Keep it prominent during active pledge steps
  if (currentStage === 'INTRO') {
    return null;
  }

  const progressPercent = Math.max(0, Math.min(100, (activeIndex / (STEPS.length - 1)) * 100));

  return (
    <nav
      aria-label="Campaign journey progress"
      className="w-full max-w-xl mx-auto mb-6 sm:mb-8 px-4 relative z-20"
    >
      <ol className="flex items-center justify-between relative">
        {/* Track connecting line */}
        <div
          className="absolute left-6 right-6 top-3.5 sm:top-4 h-[2px] bg-slate-200 z-0 overflow-hidden rounded-full"
          aria-hidden="true"
        >
          {/* Active progress fill line */}
          <div
            className="h-full bg-[#2563EB] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

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
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-200 ${
                  isCurrent
                    ? 'bg-[#2563EB] text-white ring-4 ring-blue-100 shadow-sm scale-105'
                    : isCompleted
                    ? 'bg-[#0B1F4D] text-white shadow-xs'
                    : 'bg-white text-slate-400 border border-slate-300'
                }`}
              >
                {isCompleted ? '✓' : step.number}
              </div>
              <span
                className={`mt-1.5 text-[9px] sm:text-[11px] tracking-wider uppercase font-heading font-semibold transition-colors ${
                  isCurrent
                    ? 'text-[#2563EB]'
                    : isCompleted
                    ? 'text-[#0B1F4D]'
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
