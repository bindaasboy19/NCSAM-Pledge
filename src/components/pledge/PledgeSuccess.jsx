import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ShieldCheck,
  MailCheck,
  Share2,
  MessageCircle,
  Copy,
  Check,
  ArrowRight,
  Shield,
  AlertCircle,
  FileText,
} from 'lucide-react';
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
 * 
 * Centralized Sharing Architecture:
 * 1. CLICK SHARE -> IMAGE + TEXT + URL shared together automatically where supported.
 * 2. WhatsApp -> Always sends complete TEXT + URL fallback (never URL alone).
 * 3. Single source of truth: All sharing operations delegate to src/services/shareService.js.
 * 4. Copy Pledge Link -> Copies URL only.
 * 5. Copy Pledge Message -> Copies complete message + URL.
 * 6. Public URL -> Protected against localhost in production.
 * 7. Certificate -> Strictly NEVER displayed on screen; emailed notice appears ONLY IF consent was checked AND backend confirmed it.
 */
export function PledgeSuccess({
  participant,
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

  const certificateRequestedAndConfirmed = Boolean(participant?.certificateConsent) && emailSent;

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

        {/* Email Dispatched Note (ONLY if certificate was requested AND backend confirmed it) */}
        {certificateRequestedAndConfirmed && (
          <div className="mb-4 p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-center gap-2 text-slate-700 max-w-md mx-auto">
            <MailCheck className="w-4 h-4 text-[#2563EB] shrink-0" aria-hidden="true" />
            <p className="font-heading text-xs font-semibold text-[#0B1F4D] text-left">
              {langContent.certEmailedNotice}
            </p>
          </div>
        )}

        {/* ============================================================ */}
        {/* COMPACT CAMPAIGN SHARE GRAPHIC PREVIEW (Not a download card) */}
        {/* ============================================================ */}
        <div className="my-4 max-w-sm sm:max-w-md mx-auto text-left relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 sm:p-5 shadow-sm">
          {/* Watermark Shield */}
          <div className="absolute -right-6 -bottom-6 pointer-events-none opacity-[0.04] text-[#0B1F4D]">
            <Shield className="w-44 h-44" />
          </div>

          {/* Card Top */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/70">
            <img
              src="/logo.png"
              alt="The Cyber Shield Project"
              className="h-5 sm:h-6 w-auto object-contain"
            />
            <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              NCSAM
            </span>
          </div>

          {/* Card Content */}
          <div className="space-y-1 mb-3">
            <h2 className="font-heading text-xs sm:text-sm font-extrabold text-[#0B1F4D] tracking-tight uppercase">
              {langContent.shareCardTitle}
            </h2>
            <p className="font-heading text-lg sm:text-xl font-extrabold text-[#2563EB] leading-tight">
              {langContent.shareCardPrompt}
            </p>
            <p className="text-xs text-slate-600 font-medium pt-0.5 leading-relaxed">
              {langContent.shareCardTagline}
            </p>
          </div>

          {/* Card Footer */}
          <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>National Cyber Security Awareness Month</span>
            <span className="text-[#2563EB] font-bold">#CyberShield</span>
          </div>
        </div>

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

        {/* Back to Home / Return */}
        <div className="pt-3 border-t border-slate-100 flex justify-center">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#2563EB] transition-colors py-1 px-3 rounded-lg focus-visible-ring"
          >
            <span>Return to Home</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default PledgeSuccess;
