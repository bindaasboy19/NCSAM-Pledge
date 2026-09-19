/**
 * ============================================================================
 * Pledge Service Adapter
 * ============================================================================
 * 
 * Translates between the UI state machine and the Spring Boot backend REST API.
 * 
 * Adapts endpoints configured in PLEDGE_CONFIG:
 * - submitParticipant: POST /api/pledge/participants
 * - getPledgeContent: GET /api/pledge/content (optional, falls back to config)
 * - generateCertificate: POST /api/pledge/generate-certificate
 * 
 * Note on Development Preview (Rule 70):
 * If the Spring Boot server is not running locally during development and
 * VITE_ENABLE_DEV_MOCK_FALLBACK is true, this service catches the connection
 * failure and provides an isolated preview response clearly marked as
 * isDevPreview: true, so developers and evaluators can preview the full flow
 * without pretending it is the real production backend.
 */

import { apiClient } from '../api/client';
import { PLEDGE_CONFIG } from '../config/pledgeConfig';

const ENABLE_DEV_FALLBACK = import.meta.env.VITE_ENABLE_DEV_MOCK_FALLBACK === 'true';

/**
 * Register a participant with the Spring Boot backend.
 * 
 * @param {object} participantData { name, email, mobile, profession, city, organization }
 * @returns {Promise<{ participantId: string, name: string, email: string, isDevPreview?: boolean }>}
 */
export async function submitParticipant(participantData) {
  try {
    const response = await apiClient(PLEDGE_CONFIG.apiEndpoints.submitParticipant, {
      method: 'POST',
      body: participantData,
    });

    return {
      participantId: response.participantId || response.id || response.sessionId,
      name: response.name || participantData.name,
      email: response.email || participantData.email,
      isDevPreview: false,
    };
  } catch (error) {
    // If backend is offline in development and fallback is enabled:
    if (ENABLE_DEV_FALLBACK && error.message?.includes('Unable to connect')) {
      // Simulate network latency
      await new Promise((r) => setTimeout(r, 650));
      return {
        participantId: `DEV-${Date.now().toString(36).toUpperCase()}`,
        name: participantData.name,
        email: participantData.email,
        isDevPreview: true,
      };
    }
    throw error;
  }
}

/**
 * Fetch dynamic pledge content if supported by Spring Boot backend.
 * If backend does not implement this endpoint, falls back to centralized PLEDGE_CONFIG.
 * 
 * @returns {Promise<{ pledgeText: string, acceptanceStatements: Array }>}
 */
export async function getPledgeContent() {
  try {
    const response = await apiClient(PLEDGE_CONFIG.apiEndpoints.getPledgeContent, {
      method: 'GET',
    });

    if (response && response.pledgeText) {
      return {
        pledgeText: response.pledgeText,
        acceptanceStatements: response.acceptanceStatements || PLEDGE_CONFIG.defaultAcceptanceStatements,
      };
    }
  } catch {
    // Graceful fallback to centralized config
  }

  return {
    pledgeText: PLEDGE_CONFIG.defaultPledgeText,
    acceptanceStatements: PLEDGE_CONFIG.defaultAcceptanceStatements,
  };
}

/**
 * Request certificate generation from the Spring Boot backend.
 * 
 * @param {object} payload { participantId, acceptedStatementIds, participantName }
 * @returns {Promise<{ certificateId: string, participantName: string, issueDate: string, emailSent: boolean, isDevPreview?: boolean }>}
 */
export async function generateCertificate(payload) {
  try {
    const response = await apiClient(PLEDGE_CONFIG.apiEndpoints.generateCertificate, {
      method: 'POST',
      body: payload,
    });

    return {
      certificateId: response.certificateId || response.id || 'NCSAM-CERT-ONLINE',
      participantName: response.participantName || payload.participantName,
      issueDate: response.issueDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      emailSent: Boolean(response.emailSent ?? response.emailDispatched ?? true),
      isDevPreview: false,
    };
  } catch (error) {
    // If backend is offline in development and fallback is enabled:
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
        participantName: payload.participantName,
        issueDate: formattedDate,
        emailSent: true,
        isDevPreview: true,
      };
    }
    throw error;
  }
}

export default {
  submitParticipant,
  getPledgeContent,
  generateCertificate,
};
