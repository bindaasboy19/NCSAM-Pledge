/**
 * ============================================================================
 * NCSAM Cyber Safety Pledge - Central Configuration
 * ============================================================================
 * 
 * IMPORTANT:
 * All pledge text and acceptance statements are centralized here for easy
 * replacement by the project owner or dynamically overridden by the Spring
 * Boot backend API.
 * 
 * Do NOT scatter pledge copy across multiple React components.
 */

export const PLEDGE_CONFIG = {
  // Campaign Identity
  campaign: {
    title: "National Cyber Security Awareness Month",
    shortTitle: "NCSAM",
    initiativeName: "The Cyber Shield Project",
    initiativeSubtitle: "A Project by Naksh Foundation",
    heroBadge: "CYBER SAFETY PLEDGE",
    heroHeadline: "Your digital safety begins with a commitment.",
    heroSubtext:
      "Join thousands of citizens pledging to uphold digital vigilance, protect personal data, and build a safer digital cyberspace for all.",
    primaryCta: "TAKE THE PLEDGE",
  },

  // Temporary Sample Pledge (Section 6)
  // Can be overridden at runtime if the Spring Boot backend serves dynamic content
  defaultPledgeText:
    "I pledge to use digital technology responsibly, protect my personal information, respect the privacy of others, stay alert to suspicious messages and links, use strong security practices, and contribute to a safer and more aware digital community.",

  // Temporary Acceptance Statements (Section 7)
  // All statements are required before certificate generation unlocks
  defaultAcceptanceStatements: [
    {
      id: "stmt-01",
      number: "01",
      text: "I will practice safe and responsible digital behaviour.",
    },
    {
      id: "stmt-02",
      number: "02",
      text: "I will protect my personal information and respect the privacy of others.",
    },
    {
      id: "stmt-03",
      number: "03",
      text: "I will stay alert to cyber threats and help promote cyber awareness.",
    },
  ],

  // Visual Pathway Milestones
  pathwayMilestones: [
    { label: "Awareness", targetPercent: 33 },
    { label: "Understanding", targetPercent: 66 },
    { label: "Commitment", targetPercent: 100 },
  ],

  // Animation and Timing Configuration
  animation: {
    typingSpeedMs: 26, // Natural readable speed (ms per character)
    cursorBlinkSpeedMs: 900,
    skipLabel: "Skip animation",
  },

  // Spring Boot API Endpoint Routes (Section 70)
  // Adaptable to match exact Spring Boot controller RequestMappings
  apiEndpoints: {
    submitParticipant: "/api/pledge/participants",
    getPledgeContent: "/api/pledge/content",
    generateCertificate: "/api/pledge/generate-certificate",
  },

  // Network & Request Defaults
  network: {
    timeoutMs: 15000,
  },

  // Contextual Loading Messages
  loadingMessages: {
    savingParticipant: "Saving your details...",
    preparingPledge: "Preparing your pledge...",
    generatingCertificate: "Creating your certificate...",
  },
};
