import React, { useState } from 'react';
import { Mail, Phone, Briefcase, Building2, Award, ArrowRight, Loader2, AlertCircle, Check } from 'lucide-react';
import { PLEDGE_CONFIG } from '../../config/pledgeConfig';

/**
 * ParticipantForm: Personal Details Step.
 * 
 * Collects:
 * - Email Address (Mandatory)
 * - Phone Number (Mandatory)
 * - Occupation (Optional)
 * - Organisation (Optional)
 * - Consent Checkbox: "I want to receive the Certificate" (Controls backend certificate generation & dispatch)
 * 
 * Displays the confirmed Title and Name in read-only context.
 */
export function ParticipantForm({
  onSubmit,
  isSubmitting,
  participantData,
  errorMessage,
}) {
  const title = participantData?.title || 'Mr.';
  const name = participantData?.name || 'Participant';
  const language = participantData?.language || 'en';

  const langContent = PLEDGE_CONFIG.content[language] || PLEDGE_CONFIG.content.en;
  const isHindi = language === 'hi';

  const [formData, setFormData] = useState({
    email: participantData?.email || '',
    mobile: participantData?.mobile || '',
    profession: participantData?.profession || '',
    organization: participantData?.organization || '',
    consent: true, // Default checked for user convenience
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    let error = '';
    const trimmed = typeof value === 'string' ? value.trim() : '';

    if (field === 'email') {
      if (!trimmed) {
        error = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        error = 'Please enter a valid email address';
      }
    }

    if (field === 'mobile') {
      const digits = (trimmed || '').replace(/\D/g, '');
      if (!trimmed) {
        error = 'Phone number is required';
      } else if (digits.length < 10) {
        error = 'Please enter a valid 10-digit phone number';
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));

    if (touched[name]) {
      const error = validateField(name, val);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, val);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTouched = {
      email: true,
      mobile: true,
    };
    setTouched(newTouched);

    const emailError = validateField('email', formData.email);
    const mobileError = validateField('mobile', formData.mobile);

    const newErrors = {
      email: emailError,
      mobile: mobileError,
    };

    setErrors(newErrors);

    if (emailError || mobileError) {
      const firstInvalid = emailError ? 'email' : 'mobile';
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    onSubmit({
      title,
      name,
      language,
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      profession: formData.profession.trim(),
      organization: formData.organization.trim(),
      certificateConsent: Boolean(formData.consent),
      receiveCertificate: Boolean(formData.consent),
    });
  };

  const mobileDigits = formData.mobile.replace(/\D/g, '');
  const isFormValid =
    formData.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) &&
    mobileDigits.length >= 10;

  return (
    <section
      className={`max-w-xl mx-auto px-4 py-4 sm:py-6 animate-fade-slide-up ${isHindi ? 'font-hindi' : 'font-body'}`}
      aria-labelledby="cert-details-heading"
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        {/* Section Header */}
        <div className="text-center mb-6">
          <span className="font-heading text-xs font-bold tracking-wider text-[#2563EB] uppercase">
            Step 03 / Personal Details
          </span>
          <h2
            id="cert-details-heading"
            className="font-heading text-2xl sm:text-3xl font-extrabold text-[#050505] mt-1 mb-1.5 tracking-tight"
          >
            {langContent.detailsHeading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            {langContent.detailsSubtext}
          </p>
        </div>

        {/* Confirmed Participant Identity Badge */}
        <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Pledged As
            </span>
            <span className="font-heading text-sm font-bold text-[#0B1F4D]">
              {title} {name}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#2563EB] bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full">
            {isHindi ? 'हिंदी प्रतिज्ञा' : 'English Pledge'}
          </span>
        </div>

        {/* Global Error Notice */}
        {errorMessage && (
          <div
            className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs sm:text-sm"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold text-red-900">Unable to complete pledge</p>
              <p className="text-xs text-red-700 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email Address (Mandatory) */}
          <div>
            <label
              htmlFor="email"
              className="font-heading block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
            >
              {langContent.emailLabel} <span className="text-[#EC4899]" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" aria-hidden="true" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                aria-invalid={Boolean(touched.email && errors.email)}
                aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                placeholder="e.g. yourname@example.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-[#050505] text-sm placeholder-slate-400 focus:outline-none focus:ring-4 transition-all ${
                  touched.email && errors.email
                    ? 'border-red-500 focus:ring-red-100'
                    : 'border-slate-300 hover:border-slate-400 focus:border-[#2563EB] focus:ring-blue-50'
                }`}
              />
            </div>
            {touched.email && errors.email && (
              <p id="email-error" className="mt-1 text-xs text-red-600 font-medium">
                {errors.email}
              </p>
            )}
            <p className="mt-1 text-[11px] text-slate-500">
              Your official completion certificate will be dispatched here.
            </p>
          </div>

          {/* Phone Number (Mandatory) */}
          <div>
            <label
              htmlFor="mobile"
              className="font-heading block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
            >
              {langContent.phoneLabel} <span className="text-[#EC4899]" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" aria-hidden="true" />
              </div>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                required
                autoComplete="tel"
                value={formData.mobile}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                aria-invalid={Boolean(touched.mobile && errors.mobile)}
                aria-describedby={touched.mobile && errors.mobile ? 'mobile-error' : undefined}
                placeholder="e.g. 9876543210"
                className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-[#050505] text-sm placeholder-slate-400 focus:outline-none focus:ring-4 transition-all ${
                  touched.mobile && errors.mobile
                    ? 'border-red-500 focus:ring-red-100'
                    : 'border-slate-300 hover:border-slate-400 focus:border-[#2563EB] focus:ring-blue-50'
                }`}
              />
            </div>
            {touched.mobile && errors.mobile && (
              <p id="mobile-error" className="mt-1 text-xs text-red-600 font-medium">
                {errors.mobile}
              </p>
            )}
          </div>

          {/* Occupation & Organisation (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor="profession"
                className="font-heading block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
              >
                {langContent.occupationLabel} <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="profession"
                  name="profession"
                  type="text"
                  value={formData.profession}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="e.g. Student, Engineer"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 focus:border-[#2563EB] rounded-xl text-[#050505] text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="organization"
                className="font-heading block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
              >
                {langContent.organisationLabel} <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  value={formData.organization}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="e.g. University / Company"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 focus:border-[#2563EB] rounded-xl text-[#050505] text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Certificate Consent Checkbox: "I want to receive the Certificate" */}
          <div className="pt-1.5">
            <label
              htmlFor="consent-checkbox"
              className="flex items-start gap-3 cursor-pointer select-none group"
            >
              <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  id="consent-checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="sr-only peer"
                />
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-[#2563EB] peer-focus-visible:ring-offset-2 ${
                    formData.consent
                      ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-sm'
                      : 'border-slate-300 bg-white group-hover:border-slate-400'
                  }`}
                  aria-hidden="true"
                >
                  {formData.consent && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              <span className="font-heading text-xs sm:text-sm font-semibold text-[#0B1F4D] leading-snug group-hover:text-black transition-colors">
                {langContent.consentLabel}
              </span>
            </label>
          </div>

          {/* Privacy Note */}
          <p className="text-[11px] text-slate-500 text-center pt-1">
            Your details are handled under strict privacy standards and used only for
            pledge verification and certificate dispatch.
          </p>

          {/* Action Button: GET CERTIFICATE (if consent checked) or COMPLETE THE PLEDGE */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className={`w-full py-3 px-6 rounded-xl font-heading font-bold text-sm tracking-wide text-white transition-all duration-150 flex items-center justify-center gap-2 shadow-sm focus-visible-ring ${
                isSubmitting || !isFormValid
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99] text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" aria-hidden="true" />
                  <span>
                    {formData.consent
                      ? PLEDGE_CONFIG.loadingMessages.generatingCertificate
                      : PLEDGE_CONFIG.loadingMessages.completingPledge}
                  </span>
                </>
              ) : formData.consent ? (
                <>
                  <Award className="w-4 h-4" aria-hidden="true" />
                  <span>{langContent.getCertificateButton}</span>
                </>
              ) : (
                <>
                  <span>{langContent.completePledgeButton}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ParticipantForm;
