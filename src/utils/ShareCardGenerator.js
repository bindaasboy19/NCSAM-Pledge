/**
 * ShareCardGenerator Utility
 * 
 * Generates an official 1200x630px campaign social share image using HTML5 Canvas.
 * Creates a real PNG File object for platform-aware sharing via navigator.share({ files: [file] }).
 * 
 * Design Elements:
 * - Pure light theme (#FFFFFF background)
 * - Approved brand colors (#0B1F4D, #2563EB, #EC4899)
 * - Shield outline watermark and network pathways
 * - Campaign text: "I TOOK THE CYBER SAFETY PLEDGE", "WILL YOU?", "Join me in helping build a safer digital India."
 * - Logo & National Cyber Security Awareness Month branding
 */

export async function generateShareCardFile() {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // 1. Background Fill
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 1200, 630);

  // 2. Subtle Outer Border & Corner Accents
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, 1152, 582);

  // Corner Accents in Brand Blue
  ctx.strokeStyle = '#2563EB';
  ctx.lineWidth = 4;
  // Top-Left
  ctx.beginPath();
  ctx.moveTo(24, 60);
  ctx.lineTo(24, 24);
  ctx.lineTo(60, 24);
  ctx.stroke();

  // Bottom-Right
  ctx.beginPath();
  ctx.moveTo(1176, 570);
  ctx.lineTo(1176, 606);
  ctx.lineTo(1140, 606);
  ctx.stroke();

  // 3. Subtle Cybersecurity Background Geometry
  ctx.save();
  ctx.strokeStyle = '#2563EB';
  ctx.globalAlpha = 0.07;
  ctx.lineWidth = 1.5;

  // Large Watermark Shield in Right Background
  ctx.beginPath();
  ctx.moveTo(960, 100);
  ctx.lineTo(1120, 160);
  ctx.lineTo(1120, 320);
  ctx.bezierCurveTo(1120, 460, 960, 540, 960, 540);
  ctx.bezierCurveTo(960, 540, 800, 460, 800, 320);
  ctx.lineTo(800, 160);
  ctx.closePath();
  ctx.stroke();

  // Circuit Network Lines
  ctx.beginPath();
  ctx.moveTo(80, 520);
  ctx.lineTo(240, 520);
  ctx.lineTo(340, 440);
  ctx.lineTo(520, 440);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(750, 120);
  ctx.lineTo(880, 120);
  ctx.lineTo(950, 220);
  ctx.stroke();

  ctx.restore();

  // 4. Draw Logo if available
  try {
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/logo.png';
    await new Promise((resolve) => {
      logoImg.onload = resolve;
      logoImg.onerror = resolve; // Continue if logo doesn't load immediately
    });
    if (logoImg.complete && logoImg.naturalWidth > 0) {
      const logoH = 44;
      const logoW = (logoImg.naturalWidth / logoImg.naturalHeight) * logoH;
      ctx.drawImage(logoImg, 70, 70, logoW, logoH);
    }
  } catch {
    // Fallback if image load fails
  }

  // 5. Campaign Badge Tag
  ctx.fillStyle = '#EFF6FF';
  ctx.strokeStyle = '#BFDBFE';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(70, 140, 460, 36, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#1D4ED8';
  ctx.font = 'bold 14px "Manrope", "Plus Jakarta Sans", sans-serif';
  ctx.fillText('NATIONAL CYBER SECURITY AWARENESS MONTH', 90, 163);

  // 6. Main Headlines
  ctx.fillStyle = '#0B1F4D';
  ctx.font = '800 48px "Manrope", "Plus Jakarta Sans", sans-serif';
  ctx.fillText('I TOOK THE', 70, 240);

  ctx.fillStyle = '#2563EB';
  ctx.fillText('CYBER SAFETY PLEDGE.', 70, 300);

  ctx.fillStyle = '#EC4899';
  ctx.font = '800 38px "Manrope", "Plus Jakarta Sans", sans-serif';
  ctx.fillText('WILL YOU?', 70, 360);

  // 7. Supporting Tagline
  ctx.fillStyle = '#334155';
  ctx.font = '500 22px "Inter", "Manrope", sans-serif';
  ctx.fillText('Join me in helping build a safer digital India.', 70, 420);

  // 8. Footer Info
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(70, 490);
  ctx.lineTo(1130, 490);
  ctx.stroke();

  ctx.fillStyle = '#64748B';
  ctx.font = '600 16px "Inter", "Manrope", sans-serif';
  ctx.fillText('The Cyber Shield Project · A Project by Naksh Foundation', 70, 540);

  ctx.fillStyle = '#2563EB';
  ctx.font = 'bold 16px "Manrope", sans-serif';
  ctx.fillText('#CyberSecurityAwareness · #CyberShield', 820, 540);

  // 9. Convert to Blob and File
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(null);
        return;
      }
      const file = new File([blob], 'cyber-safety-pledge-card.png', {
        type: 'image/png',
      });
      const dataUrl = canvas.toDataURL('image/png');
      resolve({ file, dataUrl });
    }, 'image/png');
  });
}

export default generateShareCardFile;
