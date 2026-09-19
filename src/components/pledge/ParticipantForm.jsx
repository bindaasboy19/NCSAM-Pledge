import React, { useState } from 'react';
import { User, Mail, Phone, Briefcase, MapPin, Building2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { PLEDGE_CONFIG } from '../../config/pledgeConfig';

/**
 * Editorial Light-Theme Participant Registration Form.
 * Avoids nested card-bloat, prioritizing clean fields, whitespace, and accessibility.
 */
export function ParticipantForm({ onSubmit, isSubmitting, initialData, errorMessage }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    mobile: initialData?.mobile || '',
    profession: initialData?.profession || '',
    city: initialData?.city || '',
    organization: initialData?.organization || '',
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    let error = '';
    const trimmed = (value || '').trim();

    if (field === 'name') {
      if (!trimmed) {
        error = 'Full Name is required';
      } else if (trimmed.length < 2) {
        error = 'Please enter at least 2 characters';
      }
    }

    if (field === 'email') {
      if (!trimmed) {
        error = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        error = 'Please enter a valid email address';
      }
    }

    if (field === 'mobile') {
      if (!trimmed) {
        error = 'Mobile number is required';
      } else if (!/^\+?[0-9\s\-()]{8,15}$/.test(trimmed)) {
        error = 'Please enter a valid mobile number';
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTouched = {
      name: true,
      email: true,
      mobile: true,
    };
    setTouched(newTouched);

    const nameError = validateField('name', formData.name);
    const emailError = validateField('email', formData.email);
    const mobileError = validateField('mobile', formData.mobile);

    const newErrors = {
      name: nameError,
      email: emailError,
      mobile: mobileError,
    };

    setErrors(newErrors);

    if (nameError || emailError || mobileError) {
      const firstInvalidField = nameError ? 'name' : emailError ? 'email' : 'mobile';
      document.getElementById(firstInvalidField)?.focus();
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      profession: formData.profession.trim(),
      city: formData.city.trim(),
      organization: formData.organization.trim(),
    });
  };

  return (
    <section
      className="max-w-xl mx-auto px-4 py-6"
      aria-labelledby="form-heading"
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-bold tracking-wider text-[#2563EB] uppercase">
            Step 01 / Registration
          </span>
          <h2
            id="form-heading"
            className="text-2xl sm:text-3xl font-extrabold text-[#050505] mt-1 mb-2 tracking-tight"
          >
            Tell us a little about yourself
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Before making the commitment, provide your details so your personalized pledge
            and certificate can be recorded.
          </p>
        </div>

        {/* Global Error Notice */}
        {errorMessage && (
          <div
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold text-red-900">Unable to continue</p>
              <p className="text-xs text-red-700 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Full Name <span className="text-[#EC4899]" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" aria-hidden="true" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                aria-invalid={Boolean(touched.name && errors.name)}
                aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
                placeholder="e.g. Ananya Sharma"
                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-[#050505] text-sm placeholder-slate-400 focus:outline-none focus:ring-4 transition-all ${
                  touched.name && errors.name
                    ? 'border-red-500 focus:ring-red-100'
                    : 'border-slate-300 hover:border-slate-400 focus:border-[#2563EB] focus:ring-blue-50'
                }`}
              />
            </div>
            {touched.name && errors.name && (
              <p id="name-error" className="mt-1.5 text-xs text-red-600 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Email Address <span className="text-[#EC4899]" aria-hidden="true">*</span>
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
                placeholder="e.g. ananya.sharma@example.com"
                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-[#050505] text-sm placeholder-slate-400 focus:outline-none focus:ring-4 transition-all ${
                  touched.email && errors.email
                    ? 'border-red-500 focus:ring-red-100'
                    : 'border-slate-300 hover:border-slate-400 focus:border-[#2563EB] focus:ring-blue-50'
                }`}
              />
            </div>
            {touched.email && errors.email && (
              <p id="email-error" className="mt-1.5 text-xs text-red-600 font-medium">
                {errors.email}
              </p>
            )}
            <p className="mt-1 text-[11px] text-slate-500">
              Your official completion certificate will be dispatched here.
            </p>
          </div>

          {/* Mobile Number */}
          <div>
            <label
              htmlFor="mobile"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Mobile Number <span className="text-[#EC4899]" aria-hidden="true">*</span>
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
                placeholder="e.g. +91 9876543210"
                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-[#050505] text-sm placeholder-slate-400 focus:outline-none focus:ring-4 transition-all ${
                  touched.mobile && errors.mobile
                    ? 'border-red-500 focus:ring-red-100'
                    : 'border-slate-300 hover:border-slate-400 focus:border-[#2563EB] focus:ring-blue-50'
                }`}
              />
            </div>
            {touched.mobile && errors.mobile && (
              <p id="mobile-error" className="mt-1.5 text-xs text-red-600 font-medium">
                {errors.mobile}
              </p>
            )}
          </div>

          {/* Profession & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="profession"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Profession <span className="text-slate-400 font-normal lowercase">(optional)</span>
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
                  placeholder="e.g. Engineer, Student"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 hover:border-slate-400 focus:border-[#2563EB] rounded-xl text-[#050505] text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                City <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="e.g. New Delhi"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 hover:border-slate-400 focus:border-[#2563EB] rounded-xl text-[#050505] text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Organization */}
          <div>
            <label
              htmlFor="organization"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Organization / Institution <span className="text-slate-400 font-normal lowercase">(optional)</span>
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
                placeholder="e.g. University / Company name"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 hover:border-slate-400 focus:border-[#2563EB] rounded-xl text-[#050505] text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all"
              />
            </div>
          </div>

          {/* Privacy Note */}
          <p className="text-[11px] text-slate-500 text-center pt-2">
            Your details are handled under strict privacy standards and used only for
            certificate generation and dispatch.
          </p>

          {/* Submit Action */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide text-white transition-all duration-150 flex items-center justify-center gap-2 shadow-sm focus-visible-ring ${
                isSubmitting
                  ? 'bg-[#0B1F4D] cursor-not-allowed opacity-80'
                  : 'bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" aria-hidden="true" />
                  <span>{PLEDGE_CONFIG.loadingMessages.savingParticipant}</span>
                </>
              ) : (
                <>
                  <span>PROCEED TO THE PLEDGE</span>
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
