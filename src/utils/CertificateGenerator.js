/**
 * ============================================================================
 * CertificateGenerator Utility
 * ============================================================================
 * 
 * High-fidelity, client-side certificate renderer and downloader.
 * Renders an official, publication-grade Certificate of Commitment
 * using HTML5 Canvas at 2x/3x retina resolution (2400x1600px).
 * 
 * Design Standards:
 * - Brand Palette: Dark Blue (#0B1F4D), Royal Blue (#2563EB), Accent Pink (#EC4899), Gold Seal (#D97706)
 * - Anti-aliased high-resolution typography with fallback font stacks
 * - Guilloche-inspired geometric certificate border
 * - Authentic Cyber Shield Project logo embedding
 * - Official certificate ID (e.g. NF/CSP/26...), pledge number, and formatted issue date
 * - Download formats: PNG file and PDF-ready print stream
 */

/**
 * Format a certificate ID if not already formatted
 * @param {number|string} pledgeNumber 
 * @param {string} existingCertId 
 * @returns {string} Formatted certificate identifier
 */
export function formatCertificateId(pledgeNumber, existingCertId) {
  if (existingCertId && typeof existingCertId === 'string' && existingCertId.trim()) {
    return existingCertId.trim();
  }
  const cleanNumber = String(pledgeNumber || '1').replace(/\D/g, '');
  const padded = cleanNumber.padStart(6, '0');
  const year = new Date().getFullYear().toString().slice(-2);
  return `NF/CSP/${year}${padded}`;
}

/**
 * Format date for certificate display
 * @param {string|Date} date 
 * @param {string} language 
 * @returns {string} Formatted date string
 */
export function formatCertificateDate(date, language = 'en') {
  try {
    const d = date ? new Date(date) : new Date();
    if (isNaN(d.getTime())) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    return d.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return new Date().toLocaleDateString();
  }
}

/**
 * Preload an image asset safely
 * @param {string} src 
 * @returns {Promise<HTMLImageElement|null>}
 */
function preloadImage(src) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Renders the official Certificate of Commitment onto an HTML5 Canvas.
 * 
 * @param {object} certData Certificate metadata
 * @param {string} [certData.title] Recipient salutation (Mr., Ms., Dr., etc.)
 * @param {string} certData.name Recipient official name
 * @param {number|string} [certData.pledgeNumber] Official pledge sequence number
 * @param {string} [certData.certificateId] Official certificate code
 * @param {string|Date} [certData.date] Issue date
 * @param {string} [certData.language] Language (en or hi)
 * @returns {Promise<HTMLCanvasElement|null>}
 */
export async function renderCertificateCanvas(certData) {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  // High-res retina dimensions: 2400 x 1600 (3:2 certificate aspect ratio)
  canvas.width = 2400;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const isHindi = certData?.language === 'hi';
  const rawName = certData?.name?.trim() || 'Committed Citizen';
  const salutation = certData?.title ? `${certData.title.trim()} ` : '';
  const fullName = `${salutation}${rawName}`.trim();
  const certId = formatCertificateId(certData?.pledgeNumber, certData?.certificateId);
  const issueDate = formatCertificateDate(certData?.date, certData?.language);

  // 1. Crisp White Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 2400, 1600);

  // Subtle Parchment / Light radial warmth for authenticity
  const bgGrad = ctx.createRadialGradient(1200, 800, 300, 1200, 800, 1400);
  bgGrad.addColorStop(0, '#FFFFFF');
  bgGrad.addColorStop(1, '#F8FAFC');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 2400, 1600);

  // 2. Multi-tier Guilloche-Inspired Certificate Frame
  // Outermost solid navy border
  ctx.strokeStyle = '#0B1F4D';
  ctx.lineWidth = 14;
  ctx.strokeRect(50, 50, 2300, 1500);

  // Secondary thin navy border
  ctx.strokeStyle = '#2563EB';
  ctx.lineWidth = 3;
  ctx.strokeRect(70, 70, 2260, 1460);

  // Decorative Inner Border with corner cuts
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.strokeRect(90, 90, 2220, 1420);

  // 3. Ornate Corner Brackets in Brand Blue & Gold
  const drawCorner = (x, y, dx, dy) => {
    ctx.save();
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x, y + dy * 60);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * 60, y);
    ctx.stroke();

    // Corner dot
    ctx.fillStyle = '#0B1F4D';
    ctx.beginPath();
    ctx.arc(x + dx * 16, y + dy * 16, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawCorner(70, 70, 1, 1);       // Top-Left
  drawCorner(2330, 70, -1, 1);    // Top-Right
  drawCorner(70, 1530, 1, -1);    // Bottom-Left
  drawCorner(2330, 1530, -1, -1); // Bottom-Right

  // 4. Subtle Watermark Shield in Canvas Center
  ctx.save();
  ctx.translate(1200, 820);
  ctx.strokeStyle = '#2563EB';
  ctx.fillStyle = '#2563EB';
  ctx.globalAlpha = 0.035;
  ctx.lineWidth = 10;

  // Draw Large Stylized Shield
  ctx.beginPath();
  ctx.moveTo(0, -320);
  ctx.bezierCurveTo(240, -320, 360, -260, 360, -120);
  ctx.bezierCurveTo(360, 180, 180, 360, 0, 440);
  ctx.bezierCurveTo(-180, 360, -360, 180, -360, -120);
  ctx.bezierCurveTo(-360, -260, -240, -320, 0, -320);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 5. Draw Campaign Logo at Top
  const logoImg = await preloadImage('/logo.png');
  if (logoImg && logoImg.naturalWidth > 0) {
    const targetH = 92;
    const targetW = (logoImg.naturalWidth / logoImg.naturalHeight) * targetH;
    ctx.drawImage(logoImg, 1200 - targetW / 2, 130, targetW, targetH);
  } else {
    // Elegant text fallback if logo fails
    ctx.fillStyle = '#0B1F4D';
    ctx.font = 'bold 36px "Plus Jakarta Sans", Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('THE CYBER SHIELD PROJECT', 1200, 190);
  }

  // 6. Campaign Subhead
  ctx.fillStyle = '#2563EB';
  ctx.font = 'bold 24px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';
  ctx.fillText('NATIONAL CYBER SECURITY AWARENESS MONTH', 1200, 275);
  ctx.letterSpacing = '0px';

  // Decorative header divider line
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(750, 310);
  ctx.lineTo(1650, 310);
  ctx.stroke();

  // Center crest diamond on divider
  ctx.fillStyle = '#0B1F4D';
  ctx.beginPath();
  ctx.moveTo(1200, 302);
  ctx.lineTo(1210, 310);
  ctx.lineTo(1200, 318);
  ctx.lineTo(1190, 310);
  ctx.closePath();
  ctx.fill();

  // 7. Certificate Main Heading
  ctx.fillStyle = '#0B1F4D';
  ctx.font = '900 56px "Plus Jakarta Sans", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '3px';
  ctx.fillText(isHindi ? 'प्रतिबद्धता का प्रमाणपत्र' : 'CERTIFICATE OF COMMITMENT', 1200, 400);
  ctx.letterSpacing = '0px';

  // 8. "This is proudly presented to"
  ctx.fillStyle = '#64748B';
  ctx.font = 'italic 500 28px Georgia, "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.fillText(isHindi ? 'यह गौरवपूर्वक प्रदान किया जाता है' : 'This is proudly presented to', 1200, 480);

  // 9. Recipient Official Name in Distinguished Typography
  ctx.fillStyle = '#0B1F4D';
  ctx.font = 'bold 64px "Plus Jakarta Sans", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(fullName, 1200, 580);

  // Elegant Underline below Name
  const nameWidth = ctx.measureText(fullName).width;
  const lineHalfW = Math.max(nameWidth / 2 + 50, 320);
  ctx.strokeStyle = '#2563EB';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(1200 - lineHalfW, 615);
  ctx.lineTo(1200 + lineHalfW, 615);
  ctx.stroke();

  // 10. Affirmation Body Text
  ctx.fillStyle = '#334155';
  ctx.font = '400 30px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.textAlign = 'center';

  if (isHindi) {
    ctx.fillText('राष्ट्रीय साइबर सुरक्षा जागरूकता माह के दौरान साइबर सुरक्षा प्रतिज्ञा लेने', 1200, 710);
    ctx.fillText('तथा जिम्मेदार डिजिटल नागरिकता और सुरक्षित डिजिटल वातावरण के निर्माण में', 1200, 765);
    ctx.fillText('सक्रिय योगदान देने की निष्ठावान प्रतिबद्धता के लिए।', 1200, 820);
  } else {
    ctx.fillText('for solemnly taking the National Cyber Security Awareness Month Pledge,', 1200, 710);
    ctx.fillText('affirming their commitment to proactive data privacy, cyber threat vigilance,', 1200, 765);
    ctx.fillText('and the promotion of a safer, more responsible digital India for all.', 1200, 820);
  }

  // 11. Security Watermark & Three Pillars Badge Strip
  const pillarsY = 960;
  const pillarBoxW = 280;
  const pillarBoxH = 54;
  const pillars = [
    { title: isHindi ? 'सतर्कता' : 'VIGILANCE', sub: isHindi ? 'सचेत व्यवहार' : 'Safe Practices' },
    { title: isHindi ? 'गोपनीयता' : 'PRIVACY', sub: isHindi ? 'डेटा सुरक्षा' : 'Data Respect' },
    { title: isHindi ? 'समुदाय' : 'COMMUNITY', sub: isHindi ? 'सामूहिक सुरक्षा' : 'Shared Safety' },
  ];

  pillars.forEach((p, idx) => {
    const px = 1200 + (idx - 1) * 360;
    ctx.fillStyle = '#F1F5F9';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(px - pillarBoxW / 2, pillarsY - pillarBoxH / 2, pillarBoxW, pillarBoxH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0B1F4D';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.title, px, pillarsY + 7);
  });

  // 12. Bottom Metadata & Signatures Section
  const bottomLineY = 1120;
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(180, bottomLineY);
  ctx.lineTo(2220, bottomLineY);
  ctx.stroke();

  // LEFT COLUMN: Verification & Certificate ID
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('OFFICIAL CERTIFICATE ID', 200, 1180);
  ctx.letterSpacing = '0px';

  ctx.fillStyle = '#0B1F4D';
  ctx.font = 'bold 28px monospace';
  ctx.fillText(certId, 200, 1225);

  if (certData?.pledgeNumber) {
    ctx.fillStyle = '#2563EB';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Pledge Ref: #${certData.pledgeNumber}`, 200, 1265);
  }

  // CENTER COLUMN: Official Gold Security Seal
  ctx.save();
  ctx.translate(1200, 1260);
  // Outer gold ring
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.arc(0, 0, 72, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#D97706';
  ctx.beginPath();
  ctx.arc(0, 0, 64, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(0, 0, 56, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Seal Icon / Shield
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(0, -26);
  ctx.lineTo(22, -14);
  ctx.lineTo(22, 12);
  ctx.bezierCurveTo(22, 28, 0, 36, 0, 36);
  ctx.bezierCurveTo(0, 36, -22, 28, -22, 12);
  ctx.lineTo(-22, -14);
  ctx.closePath();
  ctx.fill();

  // Seal Checkmark inside shield
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-9, 4);
  ctx.lineTo(-2, 12);
  ctx.lineTo(10, -6);
  ctx.stroke();
  ctx.restore();

  // Seal Label
  ctx.fillStyle = '#B45309';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '1px';
  ctx.fillText('VERIFIED COMMITMENT', 1200, 1360);
  ctx.letterSpacing = '0px';

  // RIGHT COLUMN: Date of Issue & Campaign Authority
  ctx.textAlign = 'right';
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('DATE OF ISSUE', 2200, 1180);
  ctx.letterSpacing = '0px';

  ctx.fillStyle = '#0B1F4D';
  ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(issueDate, 2200, 1225);

  ctx.fillStyle = '#2563EB';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('The Cyber Shield Project', 2200, 1265);

  // 13. Very Bottom Legal Line
  ctx.fillStyle = '#94A3B8';
  ctx.font = '400 16px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    'This digital credential verifies authentic participation in the National Cyber Security Awareness Month campaign. Not for resale.',
    1200,
    1480
  );

  return canvas;
}

/**
 * Downloads the rendered certificate directly to the user's device as a high-res PNG.
 * 
 * @param {object} certData 
 * @returns {Promise<boolean>}
 */
export async function downloadCertificate(certData) {
  try {
    const canvas = await renderCertificateCanvas(certData);
    if (!canvas) return false;

    const certId = formatCertificateId(certData?.pledgeNumber, certData?.certificateId);
    const sanitizedId = certId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Cyber_Safety_Pledge_${sanitizedId}.png`;

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        resolve(true);
      }, 'image/png');
    });
  } catch (error) {
    console.error('Certificate download failed:', error);
    return false;
  }
}

/**
 * Opens a print-optimized window for instant printing/saving as PDF.
 * 
 * @param {object} certData 
 * @returns {Promise<boolean>}
 */
export async function printCertificate(certData) {
  try {
    const canvas = await renderCertificateCanvas(certData);
    if (!canvas) return false;
    const dataUrl = canvas.toDataURL('image/png');

    const printWin = window.open('', '_blank');
    if (!printWin) return false;

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Certificate - ${formatCertificateId(certData?.pledgeNumber, certData?.certificateId)}</title>
          <style>
            @page {
              size: landscape;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: #fff;
            }
            img {
              width: 100vw;
              max-height: 100vh;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWin.document.close();
    return true;
  } catch (error) {
    console.error('Certificate print failed:', error);
    return false;
  }
}

export default {
  renderCertificateCanvas,
  downloadCertificate,
  printCertificate,
  formatCertificateId,
  formatCertificateDate,
};
