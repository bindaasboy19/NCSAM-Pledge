import React, { useState, useEffect } from 'react';
import {
  Download,
  Printer,
  ShieldCheck,
  CheckCircle,
  Loader2,
  MailCheck,
  Award,
  Sparkles,
} from 'lucide-react';
import {
  renderCertificateCanvas,
  downloadCertificate,
  printCertificate,
  formatCertificateId,
  formatCertificateDate,
} from '../../utils/CertificateGenerator';

/**
 * CertificateCard: Instant on-screen Certificate of Commitment display
 * with 1-click Download and Print options.
 * 
 * Features:
 * - Immediate visual rendering using canvas preview
 * - Sharp retina export via downloadCertificate (PNG)
 * - Print-ready PDF dialog via printCertificate
 * - Clean metadata summary (Recipient, Certificate ID, Date, Seal)
 * - Decoupled asynchronous email notification badge
 */
export function CertificateCard({ participant, pledgeNumber, emailSent, certificateId: propCertId }) {
  const language = participant?.language || 'en';
  const isHindi = language === 'hi';
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState(null);
  const [isRendering, setIsRendering] = useState(true);

  const rawName = participant?.name || 'Committed Citizen';
  const salutation = participant?.title ? `${participant.title} ` : '';
  const fullName = `${salutation}${rawName}`.trim();
  const certId = formatCertificateId(pledgeNumber, propCertId || participant?.certificateId);
  const issueDate = formatCertificateDate(new Date(), language);

  const certData = {
    title: participant?.title,
    name: participant?.name,
    pledgeNumber,
    certificateId: certId,
    date: new Date(),
    language,
  };

  // Render high-res preview on mount
  useEffect(() => {
    let isMounted = true;
    setIsRendering(true);

    renderCertificateCanvas(certData).then((canvas) => {
      if (isMounted && canvas) {
        setPreviewDataUrl(canvas.toDataURL('image/png'));
        setIsRendering(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [participant?.name, participant?.title, pledgeNumber, certId, language]);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadSuccess(false);

    const success = await downloadCertificate(certData);
    setIsDownloading(false);
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    }
  };

  const handlePrint = async () => {
    await printCertificate(certData);
  };

  return (
    <div className="w-full my-6 bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-[0_4px_24px_rgba(11,31,77,0.06)] transition-all">
      {/* Top Banner: Verification badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-xs sm:text-sm font-bold text-[#0B1F4D] tracking-tight">
                {isHindi ? 'डिजिटल प्रमाण-पत्र तैयार है' : 'Official Certificate Ready'}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-2.5 h-2.5" />
                Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              ID: {certId}
            </p>
          </div>
        </div>

        {/* Action Controls: Download & Print */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading || isRendering}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all duration-150 shadow-sm focus-visible-ring ${
              downloadSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-[#2563EB] hover:bg-blue-700 text-white active:scale-[0.98]'
            } ${isDownloading ? 'opacity-75 cursor-wait' : ''}`}
            aria-label="Download Certificate"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isHindi ? 'डाउनलोड हो रहा है...' : 'Generating HD Certificate...'}</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-white" />
                <span>{isHindi ? 'सफलतापूर्वक डाउनलोड हुआ!' : 'Certificate Downloaded!'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{isHindi ? 'प्रमाणपत्र डाउनलोड करें' : 'Download Certificate'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={isRendering}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors focus-visible-ring shrink-0"
            title="Print or Save as PDF"
            aria-label="Print or Save as PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real Canvas Preview Container */}
      <div className="relative mt-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center min-h-[220px] sm:min-h-[280px]">
        {isRendering ? (
          <div className="flex flex-col items-center justify-center gap-2 p-8 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" />
            <span className="text-xs font-medium">
              {isHindi ? 'प्रमाण-पत्र तैयार किया जा रहा है...' : 'Rendering high-resolution credential...'}
            </span>
          </div>
        ) : previewDataUrl ? (
          <div className="w-full relative group">
            <img
              src={previewDataUrl}
              alt={`Certificate of Commitment for ${fullName}`}
              className="w-full h-auto object-contain rounded-xl shadow-inner transition-transform"
            />
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#0B1F4D] shadow-md flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-[#2563EB]" />
                Click 'Download Certificate' for full 2400x1600 resolution
              </span>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs">
            Unable to render certificate preview. You can still download the certificate.
          </div>
        )}
      </div>

      {/* Certificate Metadata Bar */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left text-xs">
        <div>
          <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Issued To
          </span>
          <span className="font-semibold text-[#0B1F4D] truncate block">
            {fullName}
          </span>
        </div>
        <div>
          <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Pledge Ref
          </span>
          <span className="font-mono font-bold text-[#2563EB]">
            #{pledgeNumber || 'NCSAM'}
          </span>
        </div>
        <div>
          <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Issue Date
          </span>
          <span className="text-slate-700">
            {issueDate}
          </span>
        </div>
        <div>
          <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Security Status
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Authenticated
          </span>
        </div>
      </div>

      {/* Asynchronous Email Status Banner (Decoupled & Non-blocking) */}
      <div className="mt-3.5 p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-2.5 text-left">
        <MailCheck className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-semibold text-[#0B1F4D]">
            {isHindi
              ? 'प्रमाण-पत्र आपके उपकरण पर तुरंत उपलब्ध है'
              : 'Your certificate is ready for download above.'}
          </p>
          <p className="text-slate-600 mt-0.5 leading-relaxed text-[11px]">
            {participant?.email ? (
              <>
                {isHindi
                  ? emailSent
                    ? `डिजिटल प्रतिलिपि आपके पंजीकृत ईमेल (${participant.email}) पर प्रेषित कर दी गई है।`
                    : `एक डिजिटल प्रतिलिपि आपके पंजीकृत ईमेल (${participant.email}) पर भेजी जा रही है।`
                  : emailSent
                    ? `A digital copy has been dispatched to your registered email (${participant.email}).`
                    : `A digital copy is being dispatched asynchronously to your registered email (${participant.email}). You do not need to wait.`}
              </>
            ) : (
              <>
                {isHindi
                  ? 'आप उपरोक्त बटन से कभी भी अपना प्रमाणपत्र डाउनलोड कर सकते हैं।'
                  : 'You can download or print your certificate directly from this screen.'}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CertificateCard;
