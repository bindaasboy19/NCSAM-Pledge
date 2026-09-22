/**
 * ============================================================================
 * Pledge Service Adapter
 * ============================================================================
 * 
 * Communicates with the Java Spring Boot backend for:
 * 1. getPledgeCount() -> GET /api/pledge/count (returns real count or null)
 * 2. submitInitialData() -> POST /api/pledge/initial (title, name, language)
 * 3. generateCertificate() -> POST /api/pledge/generate-certificate
 */

import { apiClient } from '../api/client';
import { PLEDGE_CONFIG } from '../config/pledgeConfig';

const ENABLE_DEV_FALLBACK = import.meta.env.VITE_ENABLE_DEV_MOCK_FALLBACK === 'true';

/**
 * Fetch real pledge counter from Spring Boot backend.
 * Returns null if endpoint does not exist or backend is unreachable (no fake numbers!).
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
    // If backend does not provide count or is offline, do NOT fabricate data
    return null;
  }
}

/**
 * Submit initial participant registration (Title, Name, Language)
 * 
 * @param {object} initialData { title, name, language }
 * @returns {Promise<{ participantId: string, isDevPreview?: boolean }>}
 */
export async function submitInitialData(initialData) {
  try {
    const response = await apiClient(PLEDGE_CONFIG.apiEndpoints.submitInitial, {
      method: 'POST',
      body: initialData,
    });
    return {
      participantId: response?.participantId || response?.id || `PART-${Date.now()}`,
      isDevPreview: false,
    };
  } catch (error) {
    if (ENABLE_DEV_FALLBACK && error.message?.includes('Unable to connect')) {
      return {
        participantId: `DEV-${Date.now().toString(36).toUpperCase()}`,
        isDevPreview: true,
      };
    }
    throw error;
  }
}

/**
 * Request certificate generation from Spring Boot backend.
 * 
 * @param {object} payload { title, name, language, email, mobile, profession, organization, certificateConsent, acceptedStatement }
 * @returns {Promise<{ certificateId: string, participantName: string, issueDate: string, emailSent: boolean, isDevPreview?: boolean }>}
 */
export async function generateCertificate(payload) {
  try {
    const response = await apiClient(PLEDGE_CONFIG.apiEndpoints.generateCertificate, {
      method: 'POST',
      body: payload,
    });

    return {
      certificateId: response.certificateId || response.id || 'NCSAM-CERT',
      participantName: response.participantName || `${payload.title ? payload.title + ' ' : ''}${payload.name}`,
      issueDate: response.issueDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      emailSent: Boolean(response.emailSent ?? response.emailDispatched ?? true),
      isDevPreview: false,
    };
  } catch (error) {
    if (ENABLE_DEV_FALLBACK && error.message?.includes('Unable to connect')) {
      await new Promise((r) => setTimeout(r, 850));
      const formattedDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      const devCertId = `CSP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      return {
        certificateId: devCertId,
        participantName: `${payload.title ? payload.title + ' ' : ''}${payload.name}`,
        issueDate: formattedDate,
        emailSent: true,
        isDevPreview: true,
      };
    }
    throw error;
  }
}

export default {
  getPledgeCount,
  submitInitialData,
  generateCertificate,
};
