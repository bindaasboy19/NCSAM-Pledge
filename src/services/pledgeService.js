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

  const message = response?.message || '';
  const emailConfirmed = message.toLowerCase().includes('emailed') || message.toLowerCase().includes('certificate');

  return {
    success: true,
    message,
    emailSent: wantsCertificate && emailConfirmed,
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
