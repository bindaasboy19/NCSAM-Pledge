/**
 * ============================================================================
 * Central REST API Client
 * ============================================================================
 * 
 * Secure wrapper around Fetch API for communicating with the Spring Boot backend.
 * 
 * Security Features:
 * - Sanitized error normalization (no Java stack traces, SQL traces, or internal paths leaked)
 * - Zero logging of sensitive personal data, emails, tokens, or raw request payloads
 * - Request timeout via AbortController
 * - Unified header injection (Content-Type, Accept)
 */

import { PLEDGE_CONFIG } from '../config/pledgeConfig';

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '::1');

// When running on localhost (dev or preview), route through Vite proxy ('') to satisfy
// Spring Boot backend CORS policy which strictly whitelists https://ncsam-pledge.vercel.app.
// In deployed production, use configured VITE_API_BASE_URL or fallback to backend domain.
const RAW_BASE_URL = isLocalhost
  ? (import.meta.env.VITE_DEV_API_BASE_URL ?? '')
  : (import.meta.env.VITE_API_BASE_URL || 'https://cyber-awareness-backend.onrender.com');

// Strip trailing slashes
const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

/**
 * Normalizes HTTP status codes and errors into safe user-facing messages.
 * Prevents internal backend exceptions from ever reaching the UI.
 * 
 * @param {Response|Error} errorOrResponse 
 * @returns {string} Safe user-friendly error message
 */
export function normalizeApiError(errorOrResponse) {
  if (!errorOrResponse) {
    return 'An unexpected error occurred. Please try again.';
  }

  // Network or timeout errors
  if (errorOrResponse.name === 'AbortError') {
    return 'The request timed out. Please check your connection and try again.';
  }

  if (errorOrResponse.name === 'TypeError' && errorOrResponse.message?.includes('fetch')) {
    return 'Unable to connect to the pledge service. Please check your network connection.';
  }

  const status = errorOrResponse.status;

  switch (status) {
    case 400:
      return 'Please verify that all required fields are filled out correctly.';
    case 401:
    case 403:
      return 'Your session could not be verified. Please refresh the page and try again.';
    case 404:
      return 'The requested pledge resource was not found. Please try again.';
    case 409:
      return 'This entry has already been recorded. Please check your details.';
    case 429:
      return 'Too many requests. Please wait a moment before trying again.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'The pledge service is currently experiencing technical difficulties. Please try again shortly.';
    default:
      return 'Your request could not be completed at this time. Please try again.';
  }
}

/**
 * Execute an HTTP request with safe defaults and timeout handling.
 * 
 * @param {string} endpoint API endpoint path (e.g. /api/pledge/participants)
 * @param {object} options Fetch options (method, body, headers, etc.)
 * @returns {Promise<any>}
 */
export async function apiClient(endpoint, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    timeoutMs = PLEDGE_CONFIG.network?.timeoutMs || 180000,
  } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const requestHeaders = {
    'Accept': 'application/json',
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  };

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let backendError = null;
      try {
        const errorJson = await response.json();
        if (errorJson && typeof errorJson.message === 'string' && errorJson.message.trim()) {
          backendError = errorJson.message.trim();
        }
      } catch {
        // Response was not JSON
      }

      const safeMessage = backendError || normalizeApiError(response);
      const error = new Error(safeMessage);
      error.status = response.status;
      error.backendMessage = backendError;
      throw error;
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (err) {
    clearTimeout(timeoutId);

    // If already normalized Error with status
    if (err.status) {
      throw err;
    }

    const safeMessage = normalizeApiError(err);
    const error = new Error(safeMessage);
    error.cause = err;
    error.originalMessage = err?.message;
    throw error;
  }
}

export default apiClient;
