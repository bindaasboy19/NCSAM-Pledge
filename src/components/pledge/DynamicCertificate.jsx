import React, { useState, useRef, useMemo } from 'react';
import { Download, Check, Loader2 } from 'lucide-react';

/**
 * DynamicCertificate
 * 
 * Renders the authoritative Cyber Safety Pledge certificate using the static
 * template asset (`/Certificate.png`) with dynamic text overlays:
 * - Recipient Name: centered above the decorative pink underline
 * - Certificate Number: bottom-left above www.nakash.org
 * - Date: bottom-left below certificate number
 * 
 * Features:
 * - Responsive Container Query (`cqw`) scaling so text never drifts or wraps unexpectedly
 * - Dynamic font sizing for short, medium, and long names
 * - Pixel-matched 1600x1132 HD Canvas download matching the exact on-screen preview
 */
export function DynamicCertificate({
  officialName = 'Committed Citizen',
  certificateNumber = 'NF/CSP/26000001',
  date = '02 October 2026',
  className = '',
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const certificateRef = useRef(null);

  // Dynamic font sizing based on name length to prevent overflow
  const nameLength = officialName.length;
  const nameFontSizeClass = useMemo(() => {
    if (nameLength > 36) return 'text-[clamp(11px,1.9cqw,26px)]';
    if (nameLength > 26) return 'text-[clamp(13px,2.4cqw,32px)]';
    if (nameLength > 18) return 'text-[clamp(15px,3.0cqw,38px)]';
    return 'text-[clamp(17px,3.5cqw,44px)]';
  }, [nameLength]);

  /**
   * Pixel-perfect Canvas HD Download (1600 x 1132 px matching Certificate.png)
   */
  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Wait for custom fonts to be ready in the document
      if (document.fonts) {
        await document.fonts.ready;
      }

      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1132;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }

      // Load background template
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load Certificate template'));
        img.src = '/Certificate.png';
      });

      // 1. Draw base certificate template
      ctx.drawImage(img, 0, 0, 1600, 1132);

      // 2. Render Recipient Name
      // Horizontal center: 800px (50%)
      // Vertical position: 582px (approx 51.4% height, resting above the pink line at 628px)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let canvasNameSize = 46;
      if (nameLength > 36) canvasNameSize = 28;
      else if (nameLength > 26) canvasNameSize = 34;
      else if (nameLength > 18) canvasNameSize = 40;

      ctx.font = `bold ${canvasNameSize}px "Playfair Display", Georgia, serif`;
      ctx.fillStyle = '#0B1F4D';

      // Measure and ensure text fits within max 720px width
      const maxWidth = 720;
      let textWidth = ctx.measureText(officialName).width;
      while (textWidth > maxWidth && canvasNameSize > 18) {
        canvasNameSize -= 2;
        ctx.font = `bold ${canvasNameSize}px "Playfair Display", Georgia, serif`;
        textWidth = ctx.measureText(officialName).width;
      }

      ctx.fillText(officialName, 800, 582);

      // 3. Render Certificate Number (Bottom Left)
      // x: 93px (5.8%), y: 920px (81.3%)
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = '500 17px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#64748B';
      const labelCert = '';
      ctx.fillText(labelCert, 93, 920);

      const labelCertWidth = ctx.measureText(labelCert).width;
      ctx.font = '700 17px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#0B1F4D';
      ctx.fillText(certificateNumber, 93 + labelCertWidth, 920);

      // 4. Render Date (Bottom Left, below certificate number)
      // x: 93px (5.8%), y: 955px (84.4%)
      ctx.font = '500 17px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#64748B';
      const labelDate = '';
      ctx.fillText(labelDate, 93, 955);

      const labelDateWidth = ctx.measureText(labelDate).width;
      ctx.font = '700 17px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#0B1F4D';
      ctx.fillText(date, 93 + labelDateWidth, 955);

      // 5. Trigger download
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to create certificate blob');
        }
        const cleanCertId = (certificateNumber || 'NF_CSP')
          .replace(/[^a-zA-Z0-9_-]/g, '_');
        const fileName = `Cyber_Safety_Pledge_${cleanCertId}.png`;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      }, 'image/png');
    } catch (err) {
      console.error('Certificate download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto my-4 ${className}`}>
      {/* Certificate Display Card */}
      <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-sm p-2 sm:p-3 overflow-hidden">
        {/* Certificate Container with Container Query for perfect scaling */}
        <div
          ref={certificateRef}
          className="relative w-full aspect-[1600/1132] overflow-hidden rounded-xl bg-slate-50 [container-type:inline-size] select-none"
        >
          {/* Base Template Image */}
          <img
            src="/Certificate.png"
            alt="Official Cyber Safety Pledge Certificate"
            className="w-full h-full object-contain pointer-events-none block"
            loading="eager"
            decoding="async"
          />

          {/* Recipient Name Overlay (Centered above the decorative pink underline) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none w-[75%] max-w-[75%]"
            style={{ top: '51.4%' }}
          >
            <p
              className={`font-serif font-bold text-[#0B1F4D] tracking-tight truncate leading-tight ${nameFontSizeClass}`}
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              title={officialName}
            >
              {officialName}
            </p>
          </div>

          {/* Certificate Number (Bottom Left) */}
          <div
            className="absolute pointer-events-none text-left"
            style={{ left: '5.8%', top: '80.5%' }}
          >
            <p
              className="text-[clamp(7px,1.15cqw,16px)] font-sans leading-tight text-slate-500"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              {' '}
              <span className="font-bold text-[#0B1F4D] font-mono tracking-tight">
                {certificateNumber}
              </span>
            </p>
          </div>

          {/* Certificate Date (Bottom Left, below number) */}
          <div
            className="absolute pointer-events-none text-left"
            style={{ left: '5.8%', top: '84.4%' }}
          >
            <p
              className="text-[clamp(7px,1.15cqw,16px)] font-sans leading-tight text-slate-500"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              {' '}
              <span className="font-bold text-[#0B1F4D]">
                {date}
              </span>
            </p>
          </div>
        </div>

        {/* Certificate Actions & Verification Bar */}
        <div className="mt-3 pt-2.5 px-1 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
              <Check className="w-3 h-3 text-emerald-600" />
              Verified Certificate
            </span>
            <span className="font-mono text-[11px] font-semibold text-slate-600">
              {certificateNumber}
            </span>
          </div>

          {/* Download Certificate Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all focus-visible-ring disabled:opacity-75 disabled:cursor-not-allowed"
            aria-label="Download Official Certificate as PNG"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>Generating Certificate...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Downloaded Successfully</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 shrink-0" />
                <span>Download Certificate</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DynamicCertificate;
