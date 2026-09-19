import React, { useEffect, useRef } from 'react';
import { usePledge, PLEDGE_STAGES } from '../hooks/usePledge';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ProgressIndicator } from '../components/pledge/ProgressIndicator';
import { PledgeHero } from '../components/pledge/PledgeHero';
import { ParticipantForm } from '../components/pledge/ParticipantForm';
import { PledgeExperience } from '../components/pledge/PledgeExperience';
import { CertificateModal } from '../components/pledge/CertificateModal';

/**
 * Main Pledge Page orchestrator.
 * Connects the editorial stages in a pure light theme and continuous reading flow.
 */
export function PledgePage() {
  const {
    stage,
    participant,
    pledgeText,
    acceptanceStatements,
    acceptedStatements,
    certificateData,
    isCertificateModalOpen,
    isSubmittingDetails,
    isGeneratingCertificate,
    errorMessage,
    isDevPreview,
    startPledge,
    submitDetails,
    toggleStatement,
    requestCertificate,
    closeCertificateModal,
    restartFlow,
  } = usePledge();

  const stageContainerRef = useRef(null);

  // Smooth scroll to reading area when entering pledge stage
  useEffect(() => {
    if (stage !== PLEDGE_STAGES.INTRO && stageContainerRef.current) {
      stageContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [stage]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#050505] selection:bg-[#2563EB] selection:text-white relative">
      <div id="top" className="sr-only" />

      {/* Light Theme Minimal Header */}
      <Header
        currentStage={stage}
        onReset={restartFlow}
        isDevPreview={isDevPreview}
      />

      {/* Main Experience Flow */}
      <main className="flex-1 w-full" id="main-content">
        {stage === PLEDGE_STAGES.INTRO && (
          <PledgeHero onStart={startPledge} />
        )}

        {stage !== PLEDGE_STAGES.INTRO && (
          <div
            ref={stageContainerRef}
            className="pt-20 pb-16 px-4 sm:px-6 min-h-[80vh] flex flex-col justify-start"
          >
            {/* Progress Indicator */}
            <ProgressIndicator currentStage={stage} />

            {/* Stage: Participant Registration */}
            {stage === PLEDGE_STAGES.DETAILS && (
              <ParticipantForm
                onSubmit={submitDetails}
                isSubmitting={isSubmittingDetails}
                initialData={participant}
                errorMessage={errorMessage}
              />
            )}

            {/* Stage: Continuous Pledge Experience (Reading + Typing + Acceptance + Certificate Trigger) */}
            {(stage === PLEDGE_STAGES.PLEDGE ||
              stage === PLEDGE_STAGES.ACCEPTANCE ||
              stage === PLEDGE_STAGES.CERTIFICATE) && (
              <PledgeExperience
                pledgeText={pledgeText}
                statements={acceptanceStatements}
                acceptedIds={acceptedStatements}
                onToggleStatement={toggleStatement}
                onGenerateCertificate={requestCertificate}
                isGenerating={isGeneratingCertificate}
                errorMessage={errorMessage}
              />
            )}
          </div>
        )}
      </main>

      {/* Certificate Modal Dialog */}
      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={closeCertificateModal}
        certificateData={certificateData}
      />

      {/* Light Theme Editorial Footer */}
      <Footer />
    </div>
  );
}

export default PledgePage;
