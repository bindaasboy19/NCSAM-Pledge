/**
 * ============================================================================
 * Admin Service
 * ============================================================================
 *
 * Authentication:
 * - Spring Boot HttpSession
 * - Browser JSESSIONID cookie
 * - NO JWT
 * - NO Authorization: Bearer token
 *
 * Backend:
 * - POST /api/admin/login
 * - GET  /api/admin/pledges
 * - GET  /api/admin/pledges/:id
 *
 * The frontend keeps a small sessionStorage flag only so the React UI knows
 * that the admin has logged in during the current browser tab/session.
 * Actual authentication is handled by the backend HttpSession cookie.
 * ============================================================================
 */

import { apiClient } from '../api/client';

const AUTH_STORAGE_KEY = 'ncsam_admin_auth';

/* -------------------------------------------------------------------------- */
/* Local UI session                                                          */
/* -------------------------------------------------------------------------- */

export function getAdminSession() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated() {
  const session = getAdminSession();
  return Boolean(session?.authenticated);
}

export function setAdminSession(sessionData) {
  if (typeof window === 'undefined') return;

  sessionStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify(sessionData)
  );
}

export function clearAdminSession() {
  if (typeof window === 'undefined') return;

  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

/* -------------------------------------------------------------------------- */
/* Admin Login                                                               */
/* -------------------------------------------------------------------------- */

export async function adminLogin(usernameOrEmail, password) {
  const username = usernameOrEmail?.trim();

  if (!username || !password) {
    throw new Error(
      'Please provide both username/email and password.'
    );
  }

  try {
    /**
     * IMPORTANT:
     * Backend expects only:
     *
     * {
     *   username,
     *   password
     * }
     *
     * Backend creates HttpSession and sets:
     * ADMIN_LOGGED_IN = true
     *
     * credentials: 'include' is required so browser accepts/sends
     * the JSESSIONID cookie.
     */
    const response = await apiClient('/api/admin/login', {
      method: 'POST',

      credentials: 'include',

      body: {
        username,
        password,
      },
    });

    if (!response?.success) {
      throw new Error(
        response?.message || 'Invalid administrator credentials.'
      );
    }

    /**
     * DO NOT create a fake JWT.
     *
     * Authentication is actually maintained by the Spring Boot
     * JSESSIONID cookie.
     */
    const session = {
      authenticated: true,
      user: username,
      role: 'ROLE_ADMIN',
    };

    setAdminSession(session);

    return {
      success: true,
      ...session,
      message: response?.message || 'Login successful',
    };
  } catch (err) {
    if (
      err?.status === 401 ||
      err?.status === 403 ||
      err?.backendMessage ||
      err?.message?.toLowerCase().includes('invalid') ||
      err?.message?.toLowerCase().includes('unauthorized') ||
      err?.message?.toLowerCase().includes('credential')
    ) {
      throw new Error(
        err?.backendMessage ||
          err?.message ||
          'Invalid administrator credentials. Please check your username and password.'
      );
    }

    if (
      err?.status === 502 ||
      err?.message?.toLowerCase().includes('fetch') ||
      err?.message?.toLowerCase().includes('network')
    ) {
      throw new Error(
        'Unable to connect to the authentication server. Please check your connection and try again.'
      );
    }

    throw err;
  }
}

/* -------------------------------------------------------------------------- */
/* Pledge normalization                                                       */
/* -------------------------------------------------------------------------- */

export function normalizePledgeRecord(item) {
  if (!item || typeof item !== 'object') {
    return item;
  }

  const officialName =
    item.officialName ||
    item.name ||
    item.fullName ||
    'Committed Citizen';

  const name =
    item.name ||
    item.officialName ||
    officialName;

  const title = item.title || '';

  const phone =
    item.phone ||
    item.mobile ||
    item.phoneNumber ||
    '';

  const mobile =
    item.mobile ||
    item.phone ||
    phone;

  const email = item.email || '';

  const pledgeNumber =
    item.pledgeNumber ??
    item.id ??
    item.number ??
    0;

  const certificateId =
    item.certificateId ||
    item.certificateNumber ||
    item.certId ||
    '';

  const certificateNumber =
    item.certificateNumber ||
    item.certificateId ||
    certificateId;

  const profession =
    item.profession ||
    item.occupation ||
    '';

  const occupation =
    item.occupation ||
    item.profession ||
    profession;

  const organization =
    item.organization ||
    item.organisation ||
    item.institution ||
    '';

  const organisation =
    item.organisation ||
    item.organization ||
    organization;

  let certificateStatus =
    item.certificateStatus ||
    item.status ||
    item.deliveryStatus;

  if (!certificateStatus) {
    certificateStatus =
      item.receiveCertificate ||
      item.certificateConsent
        ? 'sent'
        : 'not_requested';
  }

  const createdAt =
    item.createdAt ||
    item.submittedAt ||
    item.timestamp ||
    item.createdDate ||
    item.date ||
    null;

  const language = item.language || 'en';

  const receiveCertificate = Boolean(
    item.receiveCertificate ??
      item.certificateConsent ??
      false
  );

  const certificateUrl =
    item.certificateUrl ||
    item.downloadUrl ||
    item.fileUrl ||
    null;

  return {
    ...item,

    id: item.id ?? pledgeNumber,

    name,
    officialName,
    title,

    phone,
    mobile,
    email,

    pledgeNumber,

    certificateId,
    certificateNumber,

    profession,
    occupation,

    organization,
    organisation,

    certificateStatus,

    createdAt,
    language,

    receiveCertificate,
    certificateConsent: receiveCertificate,

    certificateUrl,
  };
}

/* -------------------------------------------------------------------------- */
/* Admin Stats                                                                */
/* -------------------------------------------------------------------------- */

/**
 * We don't depend on an imaginary stats API here.
 *
 * We already have the complete pledge list from /api/admin/pledges,
 * so dashboard statistics can be calculated from that same response.
 */
export async function getAdminStats() {
  try {
    const response = await apiClient('/api/admin/pledges', {
      method: 'GET',
      credentials: 'include',
    });

    const rawList = extractPledgeArray(response);

    const pledges = rawList.map(normalizePledgeRecord);

    const totalPledges = pledges.length;

    const certificatesSent = pledges.filter((pledge) => {
      const status = String(
        pledge.certificateStatus || ''
      ).toLowerCase();

      return (
        status === 'sent' ||
        status === 'delivered' ||
        status === 'success' ||
        status === 'completed'
      );
    }).length;

    const certificatesPending = pledges.filter((pledge) => {
      const status = String(
        pledge.certificateStatus || ''
      ).toLowerCase();

      return (
        status === 'pending' ||
        status === 'processing'
      );
    }).length;

    const certificatesFailed = pledges.filter((pledge) => {
      const status = String(
        pledge.certificateStatus || ''
      ).toLowerCase();

      return (
        status === 'failed' ||
        status === 'error'
      );
    }).length;

    return {
      totalPledges,
      certificatesSent,
      certificatesPending,
      certificatesFailed,
    };
  } catch (err) {
    handleAuthError(err);

    return {
      totalPledges: 0,
      certificatesSent: 0,
      certificatesPending: 0,
      certificatesFailed: 0,
    };
  }
}

/* -------------------------------------------------------------------------- */
/* Extract pledge array                                                       */
/* -------------------------------------------------------------------------- */

function extractPledgeArray(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.pledges)) {
    return data.pledges;
  }

  if (Array.isArray(data?.data?.pledges)) {
    return data.data.pledges;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  if (Array.isArray(data?.data?.content)) {
    return data.data.content;
  }

  return [];
}

/* -------------------------------------------------------------------------- */
/* Get ALL pledges                                                            */
/* -------------------------------------------------------------------------- */

/**
 * IMPORTANT:
 *
 * There is NO:
 * ?page=0
 * ?size=10
 * ?search=
 * ?status=
 * ?language=
 *
 * Backend endpoint is simply:
 *
 * GET /api/admin/pledges
 *
 * Backend returns the complete pledge list.
 */
export async function getAdminPledges() {
  try {
    const data = await apiClient('/api/admin/pledges', {
      method: 'GET',

      /**
       * THIS IS CRITICAL FOR SPRING BOOT HttpSession.
       *
       * Browser must send JSESSIONID to backend.
       */
      credentials: 'include',
    });

    const rawList = extractPledgeArray(data);

    const content = rawList.map(normalizePledgeRecord);

    /**
     * Dashboard previously expected an object containing `content`.
     * Keep that result shape so the rest of the dashboard doesn't break.
     */
    return {
      content,
      totalElements: content.length,
    };
  } catch (err) {
    handleAuthError(err);
    throw err;
  }
}

/* -------------------------------------------------------------------------- */
/* Get single pledge                                                          */
/* -------------------------------------------------------------------------- */

export async function getAdminPledgeDetails(pledgeId) {
  if (
    pledgeId === undefined ||
    pledgeId === null ||
    pledgeId === ''
  ) {
    return null;
  }

  try {
    const response = await apiClient(
      `/api/admin/pledges/${encodeURIComponent(pledgeId)}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const item = response?.data || response;

    if (
      item &&
      (item.id !== undefined ||
        item.pledgeNumber !== undefined)
    ) {
      return normalizePledgeRecord(item);
    }

    return null;
  } catch (err) {
    handleAuthError(err);
    throw err;
  }
}

/* -------------------------------------------------------------------------- */
/* Authentication error handler                                              */
/* -------------------------------------------------------------------------- */

function handleAuthError(err) {
  if (
    err?.status === 401 ||
    err?.status === 403
  ) {
    clearAdminSession();

    throw new Error(
      'Your admin session has expired or is unauthorized. Please log in again.'
    );
  }
}

/* -------------------------------------------------------------------------- */
/* Default export                                                            */
/* -------------------------------------------------------------------------- */

export default {
  getAdminSession,
  isAdminAuthenticated,
  setAdminSession,
  clearAdminSession,

  adminLogin,

  getAdminStats,
  getAdminPledges,
  getAdminPledgeDetails,
};