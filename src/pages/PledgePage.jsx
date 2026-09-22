import React, { useEffect, useRef } from 'react';
import { usePledge, PLEDGE_STAGES } from '../hooks/usePledge';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ProgressIndicator } from '../components/pledge/ProgressIndicator';
import { PledgeHero } from '../components/pledge/PledgeHero';
import { InitialSetupForm } from '../components/pledge/InitialSetupForm';
import { PledgeExperience } from '../components/pledge/PledgeExperience';
import { ParticipantForm } from '../components/pledge/ParticipantForm';
import { PledgeSuccess } from '../components/pledge/PledgeSuccess';
import { DesktopSideGraphics } from '../components/pledge/DesktopSideGraphics';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

/**
 * Main Pledge Page orchestrator.
 * 
 * Connects the editorial stages in a pure light theme and continuous reading flow:
 * 1. INTRO (Landing page with floating CTA & live backend counter)
 * 2. INITIAL_SETUP (Step 1: Title, Name, Language)
 * 3. PLEDGE_READING (Step 2: Personalized Pledge, Slower Typing, Acceptance Checkbox, Finish Button)
 * 4. DETAILS (Step 3: Personal Details Form - Email, Phone, Optional Fields, Consent)
 * 5. SUCCESS (Step 4: Dedicated Success & Social Sharing screen - NO on-screen certificate)
 */
export function PledgePage() {
  const {
    stage,
    participant,
    emailSent,
    isCompletingPledge,
    errorMessage,
    isDevPreview,
    startPledge,
    handleInitialSetup,
    finishPledgeReading,
    handleCompletePledge,
    restartFlow,
  } = usePledge();

  const stageContainerRef = useRef(null);

  // Smooth scroll to top of stage when transitioning
  useEffect(() => {
    if (stage !== PLEDGE_STAGES.INTRO && stageContainerRef.current) {
      stageContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [stage]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#050505] selection:bg-[#2563EB] selection:text-white relative overflow-x-hidden">
      <div id="top" className="sr-only" />

      {/* Desktop Side Cybersecurity Framing (Visible on >= 1280px screens) */}
      <DesktopSideGraphics />

      {/* Light Theme Minimal Header with Real Backend Pledge Counter */}
      <Header
        currentStage={stage}
        onReset={restartFlow}
        isDevPreview={isDevPreview}
      />

      {/* Main Experience Flow */}
      <main className="flex-1 w-full relative z-10" id="main-content">
        {stage === PLEDGE_STAGES.INTRO && (
          <PledgeHero onStart={startPledge} />
        )}

        {stage !== PLEDGE_STAGES.INTRO && (
          <div
            ref={stageContainerRef}
            className="pt-16 pb-10 px-4 sm:px-6 flex flex-col justify-start"
          >
            {/* Progress Indicator (INITIAL SETUP -> THE PLEDGE -> YOUR DETAILS) */}
            <ProgressIndicator currentStage={stage} />

            <ErrorBoundary onReset={restartFlow}>
              {/* Step 1: Initial Setup (Title, Official Name, Language) */}
              {stage === PLEDGE_STAGES.INITIAL_SETUP && (
                <InitialSetupForm
                  onContinue={handleInitialSetup}
                  initialData={participant}
                />
              )}

              {/* Step 2: Personalized Pledge Reading & Acceptance */}
              {stage === PLEDGE_STAGES.PLEDGE_READING && (
                <PledgeExperience
                  title={participant.title}
                  name={participant.name}
                  language={participant.language}
                  onFinishPledge={finishPledgeReading}
                />
              )}

              {/* Step 3: Personal Details Form */}
              {stage === PLEDGE_STAGES.DETAILS && (
                <ParticipantForm
                  onSubmit={handleCompletePledge}
                  isSubmitting={isCompletingPledge}
                  participantData={participant}
                  errorMessage={errorMessage}
                />
              )}

              {/* Step 4: Dedicated Success & Social Sharing Screen */}
              {stage === PLEDGE_STAGES.SUCCESS && (
                <PledgeSuccess
                  participant={participant}
                  emailSent={emailSent}
                  onRestart={restartFlow}
                />
              )}
            </ErrorBoundary>
          </div>
        )}
      </main>

      {/* Light Theme Editorial Footer */}
      <Footer />
    </div>
  );
}

export default PledgePage;
