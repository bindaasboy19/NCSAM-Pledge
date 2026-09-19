import React, { useEffect, useRef } from 'react';
import { X, ShieldCheck, MailCheck } from 'lucide-react';

/**
 * Editorial Light-Theme Certificate Reveal Modal.
 * 
 * Features:
 * - Clean light theme with soft dimming backdrop
 * - Full accessibility: focus trap, Escape key dismissal, focus restoration
 * - Authentic certificate styling featuring provided logo.png
 * - Official backend data (ID, date, participant name)
 * - Strict v1 exclusion of all social and download buttons
 */
export function CertificateModal({ isOpen, onClose, certificateData }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return;
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !certificateData) {
    return null;
  }

  const {
    certificateId,
    participantName,
    issueDate,
    emailSent,
    isDevPreview,
  } = certificateData;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/40 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-dialog-title"
      ref={modalRef}
    >
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.12)] my-auto animate-fade-slide-up">
        {/* Top Control Bar with Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3
              id="cert-dialog-title"
              className="text-xs sm:text-sm font-bold tracking-wide text-[#0B1F4D] uppercase"
            >
              Official Pledge Certificate
            </h3>
            {isDevPreview && (
              <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-mono">
                Dev Mode
              </span>
            )}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-visible-ring"
            aria-label="Close certificate dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Certificate Card Canvas */}
        <div className="certificate-frame rounded-xl p-6 sm:p-10 text-slate-900 relative overflow-hidden bg-white">
          {/* Subtle Watermark Shield in Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <ShieldCheck className="w-80 h-80 text-[#0B1F4D]" />
          </div>

          {/* Certificate Inner Frame */}
          <div className="border border-[#0B1F4D]/25 p-6 sm:p-8 rounded-lg relative z-10 flex flex-col items-center text-center">
            {/* Provided Logo at top of Certificate */}
            <div className="mb-4">
              <img
                src="/logo.png"
                alt="The Cyber Shield Project - Naksh Foundation"
                className="h-10 sm:h-11 w-auto object-contain mx-auto"
              />
            </div>

            {/* Certificate Subheading */}
            <div className="uppercase tracking-[0.2em] text-[10px] sm:text-xs font-bold text-[#0B1F4D] mb-2">
              Certificate of Commitment
            </div>

            <p className="text-xs text-slate-500 font-normal mb-5">
              This acknowledges that
            </p>

            {/* Recipient Name in Refined Serif Typography */}
            <h4 className="text-2xl sm:text-4xl font-serif font-bold text-[#0B1F4D] tracking-wide mb-4 pb-2 border-b border-[#2563EB]/40 min-w-[220px] max-w-md">
              {participantName || 'Committed Participant'}
            </h4>

            {/* Pledge Affirmation */}
            <p className="text-xs sm:text-sm text-slate-700 max-w-lg leading-relaxed font-sans mb-8">
              has solemnly taken the <strong>Cyber Safety Pledge</strong> during National Cyber
              Security Awareness Month, committing to responsible digital citizenship, proactive
              data privacy, and cyber threat vigilance.
            </p>

            {/* Certificate Details */}
            <div className="w-full pt-5 border-t border-slate-200 grid grid-cols-2 gap-4 text-left">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Certificate ID
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-[#0B1F4D] break-all">
                  {certificateId || 'NCSAM-PLEDGE'}
                </span>
              </div>

              <div className="text-right">
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Date of Issue
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  {issueDate || new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Email Delivery Confirmation State */}
        <div className="mt-5 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3 text-slate-700">
          <MailCheck className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-xs sm:text-sm font-bold text-[#0B1F4D]">
              Your certificate has been generated successfully.
            </p>
            {emailSent && (
              <p className="text-xs text-slate-600 mt-0.5">
                A copy has been sent to your registered email address.
              </p>
            )}
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 transition-colors focus-visible-ring"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default CertificateModal;
