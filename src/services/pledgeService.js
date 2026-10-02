/**
 * ============================================================================
 * Pledge Service Adapter — Real Spring Boot Integration
 * ============================================================================
 * 
 * Communicates with the real deployed Java Spring Boot backend for:
 * 1. getPledgeCount()  -> GET /api/pledges/count (returns real count or null)
 * 2. submitPledge()    -> POST /api/pledges (commits pledge & requests certificate dispatch)
 */

import { apiClient } from '../api/client';
import { PLEDGE_CONFIG } from '../config/pledgeConfig';

/**
 * Fetch real live pledge counter from Spring Boot backend.
 * Endpoint: GET /api/pledges/count
 * 
 * @returns {Promise<number|null>}
 */
export async function getPledgeCount() {
  try {
    const response = await apiClient(PLEDGE_CONFIG.apiEndpoints.pledgeCount, {
      method: 'GET',
    });
    if (response && typeof response.count === 'number') {
      return response.count;
    }
    if (typeof response === 'number') {
      return response;
    }
    return null;
  } catch {
    // If backend is unreachable or count is offline, do NOT fabricate data
    return null;
  }
}

/**
 * Stage 1 local registration adapter.
 * The Spring Boot backend commits participant data atomically in Stage 3.
 * 
 * @param {object} initialData { title, name, language }
 * @returns {Promise<{ participantId: string, isDevPreview: boolean }>}
 */
export async function submitInitialData() {
  return {
    participantId: `PART-${Date.now()}`,
    isDevPreview: false,
  };
}

/**
 * Submit complete pledge commitment to the real Spring Boot backend.
 * Endpoint: POST /api/pledges
 * 
 * Backend Contract:
 * - title: string
 * - name: string (required)
 * - language: string
 * - email: string (required, unique)
 * - phone: string (required)
 * - profession: string (optional)
 * - organization: string (optional)
 * - certificateConsent: boolean (required: true for pledge commitment)
 * - receiveCertificate: boolean (controls certificate dispatch)
 * 
 * @param {object} payload
 * @returns {Promise<{ success: boolean, message: string, emailSent: boolean, isDevPreview: boolean }>}
 */
export async function submitPledge(payload) {
  const wantsCertificate = Boolean(payload.certificateConsent ?? payload.receiveCertificate);

  // Extract 10-digit phone number as required by Spring Boot backend contract
  const rawPhone = (payload.phone || payload.mobile || '').replace(/\D/g, '');
  const cleanPhone = rawPhone.length > 10 ? rawPhone.slice(-10) : rawPhone;

  const requestBody = {
    title: payload.title || 'Mr.',
    name: payload.name?.trim(),
    language: payload.language || 'en',
    email: payload.email?.trim(),
    phone: cleanPhone,
    profession: payload.profession?.trim() || '',
    organization: payload.organization?.trim() || '',
    certificateConsent: true,
    receiveCertificate: wantsCertificate,
  };

  const response = await apiClient(PLEDGE_CONFIG.apiEndpoints.submitPledge, {
    method: 'POST',
    body: requestBody,
  });

  const message = (typeof response === 'string' ? response : response?.message) || 'Pledge submitted successfully';
  const emailConfirmed = Boolean(
    (typeof message === 'string' && (message.toLowerCase().includes('emailed') || message.toLowerCase().includes('certificate'))) ||
    response?.emailSent
  );

  let pledgeNum = response?.pledgeNumber || (typeof response?.id === 'number' ? response.id : null);
  if (!pledgeNum) {
    try {
      const latestCount = await getPledgeCount();
      if (typeof latestCount === 'number' && latestCount > 0) {
        pledgeNum = latestCount;
      }
    } catch {
      // Non-blocking fallback
    }
  }

  const certYear = new Date().getFullYear().toString().slice(-2);
  const derivedCertId = response?.certificateId || response?.certificateNumber || (pledgeNum ? `NF/CSP/${certYear}${String(pledgeNum).padStart(6, '0')}` : null);
  const certificateNumber = response?.certificateNumber || response?.certificateId || derivedCertId;
  const certificateUrl = response?.certificateUrl || response?.downloadUrl || response?.fileUrl || null;

  const rawDate = response?.date || response?.createdAt || null;
  let formattedDate;
  if (rawDate && typeof rawDate === 'string' && /^\d{1,2}\s+[A-Za-z]+\s+\d{4}$/.test(rawDate.trim())) {
    formattedDate = rawDate.trim();
  } else {
    try {
      const d = rawDate ? new Date(rawDate) : new Date();
      formattedDate = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      formattedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    }
  }

  const rawName = response?.officialName || response?.name || payload.name?.trim() || 'Committed Citizen';
  const rawTitle = response?.title || payload.title || 'Mr.';
  const officialName = rawName.startsWith(rawTitle) ? rawName : `${rawTitle} ${rawName}`.trim();

  return {
    success: true,
    message,
    pledgeNumber: pledgeNum,
    certificateNumber,
    certificateId: derivedCertId,
    certificateUrl,
    officialName,
    title: rawTitle,
    date: formattedDate,
    certificateAvailable: true,
    emailSent: wantsCertificate && (emailConfirmed || Boolean(response?.certificateNumber || pledgeNum)),
    isDevPreview: false,
  };
}

// Backward compatible export for usePledge hook
export const generateCertificate = submitPledge;

export default {
  getPledgeCount,
  submitInitialData,
  submitPledge,
  generateCertificate,
};
