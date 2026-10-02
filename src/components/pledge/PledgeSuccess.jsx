import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ShieldCheck,
  Share2,
  MessageCircle,
  Copy,
  Check,
  ArrowLeft,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { DynamicCertificate } from './DynamicCertificate';
import { PLEDGE_CONFIG } from '../../config/pledgeConfig';
import { generateShareCardFile } from '../../utils/ShareCardGenerator';
import {
  buildPledgeUrl,
  buildShareMessage,
  shareNative,
  shareWithWhatsApp,
  shareWithWhatsAppStatus,
  copyPledgeLink,
  copyShareMessage,
} from '../../services/shareService';

/**
 * PledgeSuccess: Dedicated success & social sharing screen.
 * Displays authoritative backend-generated certificate and centralized sharing.
 */
export function PledgeSuccess({
  participant,
  pledgeNumber,
  certificateId,
  certificateNumber,
  certificateDate,
  officialName,
  _certificateUrl,
  emailSent,
  onRestart,
}) {
  const language = participant?.language || 'en';
  const langContent = PLEDGE_CONFIG.content[language] || PLEDGE_CONFIG.content.en;
  const isHindi = language === 'hi';

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [shareFile, setShareFile] = useState(null);
  const [shareError, setShareError] = useState('');

  const authoritativeName = useMemo(() => {
    if (officialName) return officialName;
    const rawName = participant?.name?.trim();
    if (!rawName) return 'Committed Citizen';
    const salutation = participant?.title ? `${participant.title} ` : '';
    return rawName.startsWith(salutation.trim()) ? rawName : `${salutation}${rawName}`.trim();
  }, [officialName, participant?.name, participant?.title]);

  const authoritativeCertNumber = useMemo(() => {
    return (
      certificateNumber ||
      certificateId ||
      (pledgeNumber ? `NF/CSP/26${String(pledgeNumber).padStart(6, '0')}` : 'NF/CSP/26000001')
    );
  }, [certificateNumber, certificateId, pledgeNumber]);

  const authoritativeDate = useMemo(() => {
    return (
      certificateDate ||
      new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    );
  }, [certificateDate]);

  // Dynamically resolve public pledge URL from central share service
  const publicPledgeUrl = useMemo(() => buildPledgeUrl(), []);
  const canonicalShareMessage = useMemo(() => buildShareMessage(publicPledgeUrl), [publicPledgeUrl]);

  // Generate share card file in-memory on mount
  useEffect(() => {
    generateShareCardFile().then((result) => {
      if (result?.file) {
        setShareFile(result.file);
      }
    });
  }, []);

  // Helper to ensure file is ready before sharing
  const getOrGenerateFile = useCallback(async () => {
    if (shareFile) return shareFile;
    const result = await generateShareCardFile();
    if (result?.file) {
      setShareFile(result.file);
      return result.file;
    }
    return null;
  }, [shareFile]);

  // 1. Share on WhatsApp (IMAGE + TEXT + URL native if supported, encoded WhatsApp TEXT + URL fallback)
  const handleShareWhatsApp = async () => {
    setShareError('');
    try {
      const file = await getOrGenerateFile();
      await shareWithWhatsApp({ file, url: publicPledgeUrl });
    } catch {
      setShareError('Unable to open WhatsApp share. You can copy the message below.');
    }
  };

  // 2. WhatsApp Status (native file share if supported, encoded WhatsApp TEXT + URL fallback)
  const handleShareWhatsAppStatus = async () => {
    setShareError('');
    try {
      const file = await getOrGenerateFile();
      await shareWithWhatsAppStatus({ file, url: publicPledgeUrl });
    } catch {
      setShareError('Unable to share to WhatsApp Status. You can copy the message below.');
    }
  };

  // 3. Share with Others (Native Web Share: IMAGE + TEXT + URL -> TEXT + URL -> Copy fallback)
  const handleShareWithOthers = async () => {
    setShareError('');
    try {
      const file = await getOrGenerateFile();
      const result = await shareNative({
        title: 'I Took the Cyber Safety Pledge',
        text: canonicalShareMessage,
        url: publicPledgeUrl,
        file,
      });

      if (!result.success && !result.aborted) {
        // Fallback to copying share message
        const copied = await copyShareMessage(publicPledgeUrl);
        if (copied) {
          setCopiedMessage(true);
          setTimeout(() => setCopiedMessage(false), 2500);
        } else {
          setShareError('Unable to open the share menu. Please try copying the link or message.');
        }
      }
    } catch {
      setShareError('Unable to open the share menu. Please try again.');
    }
  };

  // 4. Copy Pledge Link (copies URL only)
  const handleCopyLink = async () => {
    const success = await copyPledgeLink(publicPledgeUrl);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // 5. Copy Pledge Message (copies complete TEXT + URL)
  const handleCopyMessage = async () => {
    const success = await copyShareMessage(publicPledgeUrl);
    if (success) {
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    }
  };

  return (
    <section
      className={`max-w-xl mx-auto px-4 py-2 sm:py-4 animate-fade-slide-up ${isHindi ? 'font-hindi' : 'font-body'}`}
      aria-labelledby="success-heading"
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] text-center">
        {/* Celebration Shield Icon */}
        <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] mb-3 shadow-sm">
          <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-[#2563EB]" />
        </div>

        {/* Success Tag */}
        <span className="font-heading text-[11px] font-bold tracking-widest text-[#2563EB] uppercase block mb-1">
          Pledge Completed
        </span>

        {/* Primary Headline */}
        <h1
          id="success-heading"
          className="font-heading text-xl sm:text-2xl font-extrabold text-[#050505] tracking-tight mb-1.5 leading-snug"
        >
          {langContent.successHeading}
        </h1>

        {/* Supporting Message */}
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-3 leading-relaxed font-normal">
          {langContent.successSubtext}
        </p>

        {/* Official Certificate ID & Status Badge */}
        <div className="mb-3 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200/90 text-[#0B1F4D] text-xs sm:text-sm shadow-sm">
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
            {isHindi ? 'आधिकारिक प्रमाणपत्र संख्या' : 'Official Certificate ID'}
          </span>
          <span className="font-mono font-bold text-[#2563EB] tracking-wide">
            {authoritativeCertNumber}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 ml-1">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            {isHindi ? 'प्रमाणपत्र सफलतापूर्वक तैयार' : 'Certificate Generated Successfully'}
          </span>
        </div>

        {/* Email Dispatch Notice (if applicable) */}
        {emailSent && (
          <p className="text-[11px] sm:text-xs text-slate-500 mb-2 max-w-md mx-auto">
            {isHindi
              ? `आधिकारिक प्रमाणपत्र की एक प्रति आपके पंजीकृत ईमेल (${participant?.email || 'email'}) पर भी भेज दी गई है।`
              : `A copy of the certificate has also been dispatched to ${participant?.email || 'your registered email'}.`}
          </p>
        )}

        {/* ============================================================ */}
        {/* ACTUAL CERTIFICATE (Replaces old share card completely)      */}
        {/* ============================================================ */}
        <DynamicCertificate
          officialName={authoritativeName}
          certificateNumber={authoritativeCertNumber}
          date={authoritativeDate}
        />

        {/* Invitation Section */}
        <div className="mt-4 mb-3">
          <h3 className="font-heading text-sm sm:text-base font-bold text-[#0B1F4D] mb-0.5">
            {langContent.inviteHeading}
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            {langContent.inviteSubtext}
          </p>
        </div>

        {/* Error Notice if share menu fails */}
        {shareError && (
          <div className="mb-3 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-center gap-1.5 max-w-md mx-auto">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{shareError}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* SHARE CONTROLS (IMAGE + MESSAGE + URL)                       */}
        {/* ============================================================ */}
        <div className="pt-1">
          <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">
            {langContent.shareHeading}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto mb-2">
            {/* 1. Share on WhatsApp */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-emerald-500 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs sm:text-sm font-semibold transition-colors focus-visible-ring"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{langContent.shareWhatsApp}</span>
            </button>

            {/* 2. WhatsApp Status */}
            <button
              type="button"
              onClick={handleShareWhatsAppStatus}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-teal-500 bg-teal-50 text-teal-800 hover:bg-teal-100 text-xs sm:text-sm font-semibold transition-colors focus-visible-ring"
            >
              <MessageCircle className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{langContent.shareWhatsAppStatus}</span>
            </button>

            {/* 3. Share with Others (Native Share with Image + Text + URL) */}
            <button
              type="button"
              onClick={handleShareWithOthers}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-blue-500 bg-blue-50 text-[#0B1F4D] hover:bg-blue-100 text-xs sm:text-sm font-semibold transition-colors focus-visible-ring sm:col-span-2"
            >
              <Share2 className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>{langContent.shareSocial}</span>
            </button>

            {/* 4. Copy Pledge Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors focus-visible-ring"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-700 font-bold">{langContent.linkCopied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{langContent.copyLink}</span>
                </>
              )}
            </button>

            {/* 5. Copy Pledge Message */}
            <button
              type="button"
              onClick={handleCopyMessage}
              className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors focus-visible-ring"
            >
              {copiedMessage ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-700 font-bold">{langContent.messageCopied}</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{langContent.copyMessage}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Back to Start (Clears submitted state and returns to Start page) */}
        <div className="pt-4 border-t border-slate-100 flex justify-center">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#050505] hover:bg-slate-100 transition-colors py-2 px-4 rounded-xl focus-visible-ring"
            aria-label="Back to start page and clear completed state"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Start</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default PledgeSuccess;
