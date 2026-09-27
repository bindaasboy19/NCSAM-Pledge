/**
 * ============================================================================
 * usePledge Hook
 * ============================================================================
 * 
 * Central state machine managing the 5-stage Cyber Safety Pledge journey:
 * 1. INTRO (Landing page with prominent title, floating CTA, live counter)
 * 2. INITIAL_SETUP (Step 1: Title, Name, Language)
 * 3. PLEDGE_READING (Step 2: Slower typing 90ms, single acceptance checkbox, finish button)
 * 4. DETAILS (Step 3: Email *, Phone *, Occupation, Organisation, Consent checkbox)
 * 5. SUCCESS (Step 4: Dedicated Success & Social Sharing screen - NO on-screen certificate)
 * 
 * Security & Privacy Rules:
 * - All personal data is held in React memory only.
 * - Zero sensitive data stored in localStorage / sessionStorage / URL query parameters.
 * - Duplicate submissions protected with strict loading flags.
 */

import { useState, useCallback, useRef } from 'react';
import {
  submitInitialData as apiSubmitInitialData,
  generateCertificate as apiGenerateCertificate,
} from '../services/pledgeService';

export const PLEDGE_STAGES = {
  INTRO: 'INTRO',
  INITIAL_SETUP: 'INITIAL_SETUP',
  PLEDGE_READING: 'PLEDGE_READING',
  DETAILS: 'DETAILS',
  SUCCESS: 'SUCCESS',
};

export function usePledge() {
  const [stage, setStage] = useState(PLEDGE_STAGES.INTRO);

  // Participant details strictly kept in memory
  const [participant, setParticipant] = useState({
    title: 'Mr.',
    name: '',
    language: 'en',
    email: '',
    mobile: '',
    profession: '',
    organization: '',
    certificateConsent: true,
  });
  const [participantId, setParticipantId] = useState(null);

  // Success & email dispatch state
  const [emailSent, setEmailSent] = useState(false);
  const [pledgeNumber, setPledgeNumber] = useState(null);

  // Status & loaders
  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
  const [isCompletingPledge, setIsCompletingPledge] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [isDevPreview, setIsDevPreview] = useState(false);
  const submissionIdRef = useRef(null);

  /**
   * Transition from Landing Hero to Step 1: Initial Setup
   */
  const startPledge = useCallback(() => {
    setErrorMessage(null);
    setErrorCode(null);
    setStage(PLEDGE_STAGES.INITIAL_SETUP);
  }, []);

  /**
   * Handle Step 1: Initial Setup submission (Title, Official Name, Language)
   */
  const handleInitialSetup = useCallback(async (initialData) => {
    setErrorMessage(null);
    setErrorCode(null);
    setIsSubmittingDetails(true);

    try {
      setParticipant((prev) => ({
        ...prev,
        title: initialData.title,
        name: initialData.name,
        language: initialData.language,
      }));

      // Non-blocking backend registration if backend is available
      try {
        const result = await apiSubmitInitialData(initialData);
        if (result?.participantId) {
          setParticipantId(result.participantId);
        }
        if (result?.isDevPreview) {
          setIsDevPreview(true);
        }
      } catch {
        // Continue gracefully even if initial registration is offline
      }

      setStage(PLEDGE_STAGES.PLEDGE_READING);
    } catch (err) {
      setErrorMessage(err.message || 'Unable to proceed with pledge. Please try again.');
    } finally {
      setIsSubmittingDetails(false);
    }
  }, []);

  /**
   * Transition from Step 2: Pledge Acceptance to Step 3: Personal Details
   */
  const finishPledgeReading = useCallback(() => {
    setErrorMessage(null);
    setErrorCode(null);
    setStage(PLEDGE_STAGES.DETAILS);
  }, []);

  /**
   * Handle Step 3: Personal Details submission & backend pledge completion
   */
  const handleCompletePledge = useCallback(async (fullData) => {
    setIsCompletingPledge(true);
    setErrorMessage(null);
    setErrorCode(null);

    try {
      if (!submissionIdRef.current) {
        submissionIdRef.current = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      }

      const payload = {
        submissionId: submissionIdRef.current,
        participantId: participantId || `NCSAM-${Date.now()}`,
        title: fullData.title || participant.title,
        name: fullData.name || participant.name,
        language: fullData.language || participant.language,
        email: fullData.email,
        mobile: fullData.mobile,
        profession: fullData.profession,
        organization: fullData.organization,
        certificateConsent: Boolean(fullData.certificateConsent ?? fullData.receiveCertificate),
        receiveCertificate: Boolean(fullData.certificateConsent ?? fullData.receiveCertificate),
      };

      setParticipant((prev) => ({ ...prev, ...fullData }));

      const response = await apiGenerateCertificate(payload);
      if (response?.isDevPreview) {
        setIsDevPreview(true);
      }
      if (response?.pledgeNumber) {
        setPledgeNumber(response.pledgeNumber);
      }
      setEmailSent(Boolean(response?.emailSent));
      // Clear submissionId on success so future submissions generate a fresh ID
      submissionIdRef.current = null;
      setStage(PLEDGE_STAGES.SUCCESS);
    } catch (err) {
      const code = err.code || err.errorCode || (err.status === 409 ? 'EMAIL_ALREADY_USED' : null);
      setErrorCode(code);
      setErrorMessage(
        err.message || 'Could not complete your pledge at this moment. Please try again.'
      );
    } finally {
      setIsCompletingPledge(false);
    }
  }, [participant, participantId]);

  /**
   * Restart flow gracefully without persisting sensitive data
   */
  const restartFlow = useCallback(() => {
    submissionIdRef.current = null;
    setParticipant({
      title: 'Mr.',
      name: '',
      language: 'en',
      email: '',
      mobile: '',
      profession: '',
      organization: '',
      certificateConsent: true,
    });
    setParticipantId(null);
    setPledgeNumber(null);
    setEmailSent(false);
    setErrorMessage(null);
    setErrorCode(null);
    setStage(PLEDGE_STAGES.INTRO);
  }, []);

  /**
   * Universal Back Navigation preserving in-memory user inputs
   */
  const goBack = useCallback((formDataToSave) => {
    setErrorMessage(null);
    setErrorCode(null);

    if (formDataToSave) {
      setParticipant((prev) => ({
        ...prev,
        ...formDataToSave,
      }));
    }

    setStage((currentStage) => {
      if (currentStage === PLEDGE_STAGES.DETAILS) {
        return PLEDGE_STAGES.PLEDGE_READING;
      }
      if (currentStage === PLEDGE_STAGES.PLEDGE_READING) {
        return PLEDGE_STAGES.INITIAL_SETUP;
      }
      if (currentStage === PLEDGE_STAGES.INITIAL_SETUP) {
        return PLEDGE_STAGES.INTRO;
      }
      if (currentStage === PLEDGE_STAGES.SUCCESS) {
        restartFlow();
        return PLEDGE_STAGES.INTRO;
      }
      return currentStage;
    });
  }, [restartFlow]);

  const updateParticipant = useCallback((data) => {
    setParticipant((prev) => ({ ...prev, ...data }));
  }, []);

  return {
    stage,
    participant,
    participantId,
    pledgeNumber,
    emailSent,
    isSubmittingDetails,
    isCompletingPledge,
    errorMessage,
    errorCode,
    isDevPreview,
    startPledge,
    handleInitialSetup,
    finishPledgeReading,
    handleCompletePledge,
    restartFlow,
    goBack,
    updateParticipant,
    clearError: () => {
      setErrorMessage(null);
      setErrorCode(null);
    },
  };
}

export default usePledge;
