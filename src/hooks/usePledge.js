/**
 * ============================================================================
 * usePledge Hook
 * ============================================================================
 * 
 * Central state machine managing the 5-stage Cyber Safety Pledge journey:
 * 1. INTRO
 * 2. DETAILS
 * 3. PLEDGE (typing animation)
 * 4. ACCEPTANCE (commitment sequence)
 * 5. CERTIFICATE (ceremonial reveal modal)
 * 
 * Security & Privacy Rules:
 * - All personal data is held in React memory only.
 * - Zero sensitive data stored in localStorage / sessionStorage / URL query parameters.
 * - Duplicate submissions protected with strict loading flags.
 */

import { useState, useCallback, useEffect } from 'react';
import { PLEDGE_CONFIG } from '../config/pledgeConfig';
import {
  submitParticipant as apiSubmitParticipant,
  getPledgeContent as apiGetPledgeContent,
  generateCertificate as apiGenerateCertificate,
} from '../services/pledgeService';

export const PLEDGE_STAGES = {
  INTRO: 'INTRO',
  DETAILS: 'DETAILS',
  PLEDGE: 'PLEDGE',
  ACCEPTANCE: 'ACCEPTANCE',
  CERTIFICATE: 'CERTIFICATE',
};

export function usePledge() {
  const [stage, setStage] = useState(PLEDGE_STAGES.INTRO);

  // Participant details strictly kept in memory
  const [participant, setParticipant] = useState(null);
  const [participantId, setParticipantId] = useState(null);

  // Dynamic or configured pledge text and statements
  const [pledgeText, setPledgeText] = useState(PLEDGE_CONFIG.defaultPledgeText);
  const [acceptanceStatements, setAcceptanceStatements] = useState(
    PLEDGE_CONFIG.defaultAcceptanceStatements
  );

  // Reading & acceptance state
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [acceptedStatements, setAcceptedStatements] = useState([]);

  // Certificate state
  const [certificateData, setCertificateData] = useState(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // Status & loaders
  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDevPreview, setIsDevPreview] = useState(false);

  // Pre-load dynamic pledge content if available on mount
  useEffect(() => {
    let isMounted = true;
    apiGetPledgeContent()
      .then((data) => {
        if (isMounted && data) {
          if (data.pledgeText) setPledgeText(data.pledgeText);
          if (data.acceptanceStatements?.length) {
            setAcceptanceStatements(data.acceptanceStatements);
          }
        }
      })
      .catch(() => {
        // Fallbacks already configured in state
      });
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Transition from Hero to Details
   */
  const startPledge = useCallback(() => {
    setErrorMessage(null);
    setStage(PLEDGE_STAGES.DETAILS);
  }, []);

  /**
   * Submit participant details to Spring Boot backend
   */
  const submitDetails = useCallback(async (formData) => {
    setIsSubmittingDetails(true);
    setErrorMessage(null);

    try {
      const result = await apiSubmitParticipant(formData);
      setParticipant(formData);
      setParticipantId(result.participantId);
      if (result.isDevPreview) {
        setIsDevPreview(true);
      }
      setStage(PLEDGE_STAGES.PLEDGE);
    } catch (err) {
      setErrorMessage(err.message || 'Unable to save participant details. Please try again.');
    } finally {
      setIsSubmittingDetails(false);
    }
  }, []);

  /**
   * Invoked when typing animation finishes or user clicks "Skip animation"
   */
  const handleTypingFinished = useCallback(() => {
    setIsTypingComplete(true);
    setStage(PLEDGE_STAGES.ACCEPTANCE);
  }, []);

  /**
   * Toggle a specific acceptance statement
   */
  const toggleStatement = useCallback((statementId) => {
    setAcceptedStatements((prev) => {
      if (prev.includes(statementId)) {
        return prev.filter((id) => id !== statementId);
      } else {
        return [...prev, statementId];
      }
    });
  }, []);

  /**
   * Are all required acceptance statements checked?
   */
  const isFullyAccepted =
    acceptanceStatements.length > 0 &&
    acceptanceStatements.every((stmt) => acceptedStatements.includes(stmt.id));

  /**
   * Submit certificate generation request to Spring Boot backend
   */
  const requestCertificate = useCallback(async () => {
    if (!isFullyAccepted || isGeneratingCertificate) return;

    setIsGeneratingCertificate(true);
    setErrorMessage(null);

    try {
      const payload = {
        participantId: participantId || 'NCSAM-PARTICIPANT',
        participantName: participant?.name || 'Committed Citizen',
        acceptedStatementIds: acceptedStatements,
      };

      const certResponse = await apiGenerateCertificate(payload);
      setCertificateData(certResponse);
      if (certResponse.isDevPreview) {
        setIsDevPreview(true);
      }
      setIsCertificateModalOpen(true);
      setStage(PLEDGE_STAGES.CERTIFICATE);
    } catch (err) {
      setErrorMessage(
        err.message || 'Could not generate your certificate at this moment. Please try again.'
      );
    } finally {
      setIsGeneratingCertificate(false);
    }
  }, [isFullyAccepted, isGeneratingCertificate, participantId, participant, acceptedStatements]);

  /**
   * Close certificate modal
   */
  const closeCertificateModal = useCallback(() => {
    setIsCertificateModalOpen(false);
  }, []);

  /**
   * Restart flow gracefully without persisting sensitive data
   */
  const restartFlow = useCallback(() => {
    setParticipant(null);
    setParticipantId(null);
    setAcceptedStatements([]);
    setIsTypingComplete(false);
    setCertificateData(null);
    setIsCertificateModalOpen(false);
    setErrorMessage(null);
    setStage(PLEDGE_STAGES.INTRO);
  }, []);

  return {
    stage,
    participant,
    participantId,
    pledgeText,
    acceptanceStatements,
    isTypingComplete,
    acceptedStatements,
    isFullyAccepted,
    certificateData,
    isCertificateModalOpen,
    isSubmittingDetails,
    isGeneratingCertificate,
    errorMessage,
    isDevPreview,
    startPledge,
    submitDetails,
    handleTypingFinished,
    toggleStatement,
    requestCertificate,
    closeCertificateModal,
    restartFlow,
    clearError: () => setErrorMessage(null),
  };
}

export default usePledge;
