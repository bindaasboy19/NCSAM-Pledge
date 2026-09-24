/**
 * ============================================================================
 * NCSAM / National Cyber Security Awareness Month - Central Configuration
 * ============================================================================
 * 
 * Centralized content for bilingual pledges (English & Hindi), acceptance statements,
 * title options, typing speeds, API endpoints, footer links, and sharing messages.
 */

export const PLEDGE_CONFIG = {
  // Campaign Identity
  campaign: {
    fullName: "National Cyber Security Awareness Month",
    shortTitle: "NCSAM",
    initiativeName: "The Cyber Shield Project",
    initiativeSubtitle: "A Project by Naksh Foundation",
    heroBadge: "CYBER SAFETY PLEDGE",
    heroHeadline: "Your digital safety begins with a commitment.",
    heroSubtext: "This Cybersecurity Month, Pledge to Protect Yourself and Others Online.",
    heroSupportingText: "Join thousands across India taking a proactive stand against cyber threats, digital fraud, and online exploitation.",
    primaryCta: "TAKE THE PLEDGE",
  },

  // Title Options for Step 1
  titleOptions: [
    { value: "Mr.", label: "Mr." },
    { value: "Ms.", label: "Ms." },
    { value: "Mrs.", label: "Mrs." },
    { value: "Adv.", label: "Adv." },
    { value: "Dr.", label: "Dr." },
    { value: "Other", label: "Other" },
  ],

  // Language Options
  languages: [
    { code: "en", label: "English", nativeName: "English" },
    { code: "hi", label: "Hindi", nativeName: "हिंदी" },
  ],

  // Bilingual Content & Authoritative Commitments
  content: {
    en: {
      campaignName: "National Cyber Security Awareness Month",
      readReflectCommit: "READ. REFLECT. COMMIT.",
      pledgeHeading: "THE CYBER SAFETY PLEDGE",
      pledgeSubtext: "Read carefully. Make the commitment your own.",
      pledgeGreeting: (title, name) => `I, ${title ? title + ' ' : ''}${name}, pledge to be a safe and responsible digital citizen. I will:`,
      commitments: [
        "Think before I click and check before opening unknown links, messages, or attachments.",
        "Never share my OTP, PIN, password, or bank details with anyone.",
        "Keep my personal information safe and be careful about what I share online.",
        "Be kind and respectful online and never bully, threaten, or harass anyone.",
        "Report cybercrime if I or someone I know becomes a victim, by calling 1930 or reporting it at Cyber Crime Portal.",
        "Check before trusting online job offers, prizes, investment schemes, or other money-related offers.",
        "Help my family and friends stay safe online by sharing what I learn about cyber safety.",
        "Stay alert, stay informed, and use the internet responsibly to help build a safer digital India.",
      ],
      acceptanceHeading: "I have read and accept this pledge.",
      acceptanceStatement: "I have read and accept this pledge.",
      finishButton: "FINISH THE PLEDGE",
      detailsHeading: "YOUR CERTIFICATE DETAILS",
      detailsSubtext: "We only need a few details to send your certificate.",
      emailLabel: "Email Address",
      phoneLabel: "Phone Number",
      occupationLabel: "Occupation",
      organisationLabel: "Organisation",
      consentLabel: "I want to receive the Certificate",
      getCertificateButton: "GET CERTIFICATE",
      completePledgeButton: "COMPLETE THE PLEDGE",
      successHeading: "I’ve Successfully Completed the Cyber Safety Pledge.",
      successSubtext: "Your commitment to safer and more responsible digital participation has been recorded.",
      certEmailedNotice: "Your certificate has been emailed to your registered email address.",
      inviteHeading: "Now invite someone else.",
      inviteSubtext: "If you believe in a safer digital India, invite your family, friends, classmates, and colleagues to take the pledge too.",
      shareCardTitle: "I TOOK THE CYBER SAFETY PLEDGE",
      shareCardPrompt: "Will you?",
      shareCardTagline: "Join me in helping build a safer digital India.",
      shareHeading: "SHARE THE COMMITMENT",
      shareWhatsApp: "Share on WhatsApp",
      shareWhatsAppStatus: "WhatsApp Status",
      shareSocial: "Share with Others",
      copyLink: "Copy Pledge Link",
      linkCopied: "Pledge link copied!",
      copyMessage: "Copy Pledge Message",
      messageCopied: "Pledge message copied!",
    },
    hi: {
      campaignName: "राष्ट्रीय साइबर सुरक्षा जागरूकता माह",
      readReflectCommit: "पढ़ें। विचार करें। संकल्प लें।",
      pledgeHeading: "साइबर सुरक्षा प्रतिज्ञा",
      pledgeSubtext: "ध्यान से पढ़ें। इस संकल्प को अपना बनाएं।",
      pledgeGreeting: (title, name) => `मैं, ${title ? title + ' ' : ''}${name}, एक जिम्मेदार और जागरूक डिजिटल नागरिक बनने की शपथ लेता/लेती हूँ कि मैं:`,
      commitments: [
        "किसी भी लिंक पर क्लिक करने से पहले सोचूँगा/सोचूँगी और अनजान लिंक, मैसेज या फाइल को खोलने से पहले उसकी जाँच करूँगा/करूँगी।",
        "अपना OTP, PIN, पासवर्ड या बैंक से जुड़ी जानकारी किसी के साथ साझा नहीं करूँगा/करूँगी।",
        "अपनी निजी जानकारी सुरक्षित रखूँगा/रखूँगी और इंटरनेट पर कुछ भी साझा करने से पहले सावधानी बरतूँगा/बरतूँगी।",
        "इंटरनेट पर दूसरों के साथ सम्मान और अच्छे व्यवहार से पेश आऊँगा/आऊँगी और किसी को परेशान, धमकाने या ऑनलाइन बदनाम करने में शामिल नहीं होऊँगा/होऊँगी।",
        "साइबर अपराध होने पर उसकी शिकायत करूँगा/करूँगी। इसके लिए 1930 पर कॉल करूँगा/करूँगी या Cyber Crime Portal पर शिकायत दर्ज करूँगा/करूँगी।",
        "ऑनलाइन नौकरी, इनाम, निवेश या पैसे से जुड़े किसी भी ऑफर पर भरोसा करने से पहले उसकी जाँच करूँगा/करूँगी।",
        "अपने परिवार और दोस्तों को भी साइबर सुरक्षा के बारे में जागरूक करूँगा/करूँगी।",
        "सतर्क, जागरूक और जिम्मेदार रहूँगा/रहूँगी और एक सुरक्षित डिजिटल भारत बनाने में अपना योगदान दूँगा/दूँगी।",
      ],
      acceptanceHeading: "मैंने इस शपथ को पढ़ लिया है और मैं इसे स्वीकार करता/करती हूँ।",
      acceptanceStatement: "मैंने इस शपथ को पढ़ लिया है और मैं इसे स्वीकार करता/करती हूँ।",
      finishButton: "प्रतिज्ञा पूरी करें (FINISH THE PLEDGE)",
      detailsHeading: "आपके प्रमाणपत्र का विवरण",
      detailsSubtext: "आपका प्रमाणपत्र भेजने के लिए हमें केवल कुछ विवरणों की आवश्यकता है।",
      emailLabel: "ईमेल पता (Email Address)",
      phoneLabel: "फ़ोन नंबर (Phone Number)",
      occupationLabel: "व्यवसाय (Occupation)",
      organisationLabel: "संगठन / संस्थान (Organisation)",
      consentLabel: "मैं प्रमाणपत्र प्राप्त करना चाहता/चाहती हूँ",
      getCertificateButton: "प्रमाणपत्र प्राप्त करें (GET CERTIFICATE)",
      completePledgeButton: "प्रतिज्ञा पूरी करें (COMPLETE THE PLEDGE)",
      successHeading: "मैंने साइबर सुरक्षा प्रतिज्ञा सफलतापूर्वक पूरी कर ली है।",
      successSubtext: "सुरक्षित और अधिक जिम्मेदार डिजिटल भागीदारी के प्रति आपकी प्रतिबद्धता दर्ज कर ली गई है।",
      certEmailedNotice: "आपका प्रमाणपत्र आपके पंजीकृत ईमेल पते पर भेज दिया गया है।",
      inviteHeading: "अब दूसरों को भी प्रतिज्ञा लेने के लिए प्रेरित करें।",
      inviteSubtext: "यदि आप एक सुरक्षित डिजिटल भारत में विश्वास करते हैं, तो अपने परिवार, दोस्तों और सहकर्मियों को भी यह प्रतिज्ञा लेने के लिए आमंत्रित करें।",
      shareCardTitle: "मैंने साइबर सुरक्षा प्रतिज्ञा ली है",
      shareCardPrompt: "क्या आप भी लेंगे?",
      shareCardTagline: "एक सुरक्षित डिजिटल भारत बनाने में मेरे साथ जुड़ें।",
      shareHeading: "प्रतिज्ञा साझा करें",
      shareWhatsApp: "व्हाट्सएप पर साझा करें",
      shareWhatsAppStatus: "व्हाट्सएप स्टेटस",
      shareSocial: "अन्य माध्यमों से साझा करें",
      copyLink: "प्रतिज्ञा लिंक कॉपी करें",
      linkCopied: "लिंक कॉपी हो गया!",
      copyMessage: "प्रतिज्ञा संदेश कॉपी करें",
      messageCopied: "संदेश कॉपी हो गया!",
    },
  },

  // Slower Typing Configuration (85-110ms per char for comfortable reading)
  animation: {
    typingSpeedMs: 85,
    cursorBlinkSpeedMs: 900,
    skipLabel: "Skip animation",
  },

  // Authoritative Social Share Message Template
  shareMessage:
    "I’ve successfully completed the Cyber Safety Pledge for National Cyber Security Awareness Month.\n\nI’m taking a step toward safer and more responsible digital participation.\n\nWill you take the pledge too?\n\nTake the pledge:\n",

  // API Endpoint Routes
  apiEndpoints: {
    pledgeCount: "/api/pledges/count",
    submitPledge: "/api/pledges",
  },

  // Verified Footer Links
  footerLinks: {
    privacyPolicy: "https://naksh.org/privacy-policy",
    termsAndConditions: "https://naksh.org/terms-conditions",
    contactSupport: "https://naksh.org/contact-us",
  },

  // Network & Request Defaults
  network: {
    timeoutMs: 180000,
  },

  loadingMessages: {
    generatingCertificate: "Completing your pledge & requesting certificate...",
    completingPledge: "Recording your commitment...",
  },
};

export default PLEDGE_CONFIG;
