/**
 * ============================================================================
 * Share Service — Single Source of Truth
 * ============================================================================
 * 
 * Centralized share architecture for the Cyber Safety Pledge:
 * 1. buildPledgeUrl() -> Dynamically constructs public pledge URL, protects against localhost in production.
 * 2. buildShareMessage() -> Canonical single source of truth for the complete share text.
 * 3. buildWhatsAppUrl() -> Encodes complete message + URL into WhatsApp endpoint.
 * 4. shareNative() -> Native Web Share with LEVEL 1 (IMAGE + TEXT + URL) and LEVEL 2 (TEXT + URL).
 * 5. shareWithWhatsApp() -> Checks native file sharing first, falls back to encoded WhatsApp TEXT + URL.
 * 6. copyPledgeLink() -> Copies URL only.
 * 7. copyShareMessage() -> Copies complete message + URL.
 */

import { PLEDGE_CONFIG } from '../config/pledgeConfig.js';

/**
 * Dynamically resolves the public pledge URL.
 * Never exposes localhost or 127.0.0.1 in production payloads.
 * 
 * @returns {string} The public pledge URL
 */
export function buildPledgeUrl() {
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_PUBLIC_SITE_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1');
    if (!isLocal) {
      return origin;
    }
  }

  return 'https://ncsam-pledge.vercel.app';
}

/**
 * Builds the canonical share message containing both prepared text and the pledge URL.
 * Single source of truth across all platforms.
 * 
 * @param {string} [url] - Optional pledge URL override
 * @returns {string} Complete formatted share message
 */
export function buildShareMessage(url = buildPledgeUrl()) {
  const baseMessage = PLEDGE_CONFIG.shareMessage || (
    "I’ve successfully completed the Cyber Safety Pledge for National Cyber Security Awareness Month.\n\n" +
    "I’m taking a step toward safer and more responsible digital participation.\n\n" +
    "Will you take the pledge too?\n\n" +
    "Take the pledge:\n"
  );

  return `${baseMessage.trim()}\n${url}`.trim();
}

/**
 * Constructs the WhatsApp share URL with the COMPLETE encoded message (text + URL).
 * Decodes to: Message + URL, never URL alone.
 * 
 * @param {string} [url] - Optional pledge URL override
 * @returns {string} Formatted WhatsApp URL
 */
export function buildWhatsAppUrl(url = buildPledgeUrl()) {
  const fullMessage = buildShareMessage(url);
  return `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;
}

/**
 * Checks whether native file sharing is supported by the current browser/device.
 * 
 * @param {File} file - The file to test
 * @returns {boolean}
 */
export function canShareFile(file) {
  if (typeof navigator === 'undefined' || !navigator.share || !navigator.canShare || !file) {
    return false;
  }
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

/**
 * Executes native sharing following the approved fallback hierarchy:
 * LEVEL 1: IMAGE + TEXT + URL (if file sharing supported)
 * LEVEL 2: TEXT + URL (if native sharing supported without files)
 * 
 * @param {object} options
 * @param {string} [options.title] - Share title
 * @param {string} [options.text] - Share text
 * @param {string} [options.url] - Share URL
 * @param {File} [options.file] - Optional image file
 * @returns {Promise<{ success: boolean, aborted?: boolean, error?: Error }>}
 */
export async function shareNative({
  title = 'I Took the Cyber Safety Pledge',
  text,
  url = buildPledgeUrl(),
  file,
} = {}) {
  const shareText = text || buildShareMessage(url);

  if (typeof navigator === 'undefined' || !navigator.share) {
    return { success: false, error: new Error('Native share not supported') };
  }

  // LEVEL 1: File sharing supported
  if (file && canShareFile(file)) {
    try {
      await navigator.share({
        title,
        text: shareText,
        url,
        files: [file],
      });
      return { success: true };
    } catch (err) {
      if (err.name === 'AbortError') {
        return { success: false, aborted: true };
      }
      // If file share fails, fall through to text+url native share
    }
  }

  // LEVEL 2: Text + URL native share
  try {
    await navigator.share({
      title,
      text: shareText,
      url,
    });
    return { success: true };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { success: false, aborted: true };
    }
    return { success: false, error: err };
  }
}

/**
 * Shares on WhatsApp:
 * Attempts native file share sheet first on supported mobile devices.
 * If file sharing is unavailable or fails, opens WhatsApp with the complete encoded TEXT + URL.
 * 
 * @param {object} options
 * @param {File} [options.file] - Optional campaign card file
 * @param {string} [options.url] - Optional pledge URL override
 * @returns {Promise<void>}
 */
export async function shareWithWhatsApp({ file, url = buildPledgeUrl() } = {}) {
  // Try native file share first if supported on the platform
  if (file && canShareFile(file)) {
    try {
      const result = await shareNative({
        title: 'I Took the Cyber Safety Pledge',
        text: buildShareMessage(url),
        url,
        file,
      });
      if (result.success || result.aborted) {
        return;
      }
    } catch {
      // Fall through to WhatsApp URL
    }
  }

  // LEVEL 3: WhatsApp fallback with complete TEXT + URL
  const whatsappUrl = buildWhatsAppUrl(url);
  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Shares to WhatsApp Status:
 * Uses native file sharing where supported.
 * Falls back honestly to the complete WhatsApp text + URL if direct status is unsupported.
 * 
 * @param {object} options
 * @param {File} [options.file] - Optional campaign card file
 * @param {string} [options.url] - Optional pledge URL override
 * @returns {Promise<void>}
 */
export async function shareWithWhatsAppStatus({ file, url = buildPledgeUrl() } = {}) {
  if (file && canShareFile(file)) {
    try {
      const result = await shareNative({
        title: 'Cyber Safety Pledge',
        text: buildShareMessage(url),
        url,
        file,
      });
      if (result.success || result.aborted) {
        return;
      }
    } catch {
      // Fall through to WhatsApp URL
    }
  }

  // Fallback to WhatsApp endpoint
  const whatsappUrl = buildWhatsAppUrl(url);
  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Copies only the public pledge URL to clipboard.
 * 
 * @param {string} [url] - Optional pledge URL override
 * @returns {Promise<boolean>}
 */
export async function copyPledgeLink(url = buildPledgeUrl()) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Copies the complete share message (TEXT + URL) to clipboard.
 * 
 * @param {string} [url] - Optional pledge URL override
 * @returns {Promise<boolean>}
 */
export async function copyShareMessage(url = buildPledgeUrl()) {
  const fullMessage = buildShareMessage(url);
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(fullMessage);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export default {
  buildPledgeUrl,
  buildShareMessage,
  buildWhatsAppUrl,
  canShareFile,
  shareNative,
  shareWithWhatsApp,
  shareWithWhatsAppStatus,
  copyPledgeLink,
  copyShareMessage,
};
