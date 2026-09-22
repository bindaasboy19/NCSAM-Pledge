import React, { useState } from 'react';
import { User, Globe, ArrowRight, AlertCircle } from 'lucide-react';
import { PLEDGE_CONFIG } from '../../config/pledgeConfig';

/**
 * InitialSetupForm: Step 1 of the pledge experience.
 * Collects Title, Official Name, and Pledge Language before the pledge reading begins.
 * Does NOT ask for email, phone, or occupation.
 */
export function InitialSetupForm({ onContinue, initialData }) {
  const [title, setTitle] = useState(initialData?.title || 'Mr.');
  const [name, setName] = useState(initialData?.name || '');
  const [language, setLanguage] = useState(initialData?.language || 'en');
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');

  const validate = () => {
    if (!name.trim()) {
      setError('Official Name is required');
      return false;
    }
    if (name.trim().length < 2) {
      setError('Please enter at least 2 characters');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true });
    if (!validate()) {
      document.getElementById('official-name')?.focus();
      return;
    }
    onContinue({
      title,
      name: name.trim(),
      language,
    });
  };

  return (
    <section
      className="max-w-lg mx-auto px-4 py-8"
      aria-labelledby="initial-setup-heading"
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        {/* Step Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-bold tracking-wider text-[#2563EB] uppercase">
            Step 01 / Begin Your Commitment
          </span>
          <h2
            id="initial-setup-heading"
            className="text-2xl sm:text-3xl font-extrabold text-[#050505] mt-1 mb-2 tracking-tight"
          >
            Personalize your pledge
          </h2>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            Please provide your name and preferred language to personalize your digital oath.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* 1. Title Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Title <span className="text-[#EC4899]">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PLEDGE_CONFIG.titleOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTitle(opt.value)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    title === opt.value
                      ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-sm'
                      : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Official Name */}
          <div>
            <label
              htmlFor="official-name"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Official Name <span className="text-[#EC4899]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" aria-hidden="true" />
              </div>
              <input
                id="official-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (touched.name) setError('');
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, name: true }));
                  validate();
                }}
                placeholder="e.g. Ananya Sharma"
                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-[#050505] text-sm placeholder-slate-400 focus:outline-none focus:ring-4 transition-all ${
                  error
                    ? 'border-red-500 focus:ring-red-100'
                    : 'border-slate-300 hover:border-slate-400 focus:border-[#2563EB] focus:ring-blue-50'
                }`}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'name-error' : undefined}
              />
            </div>
            {error && (
              <p id="name-error" className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* 3. Language Selection (English / हिंदी) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Choose your pledge language <span className="text-[#EC4899]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {PLEDGE_CONFIG.languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    language === lang.code
                      ? 'border-[#2563EB] bg-blue-50/50 shadow-sm ring-2 ring-[#2563EB]/20'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Globe
                      className={`w-4 h-4 ${
                        language === lang.code ? 'text-[#2563EB]' : 'text-slate-400'
                      }`}
                    />
                    <span
                      className={`text-sm font-semibold ${
                        language === lang.code ? 'text-[#0B1F4D]' : 'text-slate-700'
                      }`}
                    >
                      {lang.nativeName}
                    </span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      language === lang.code
                        ? 'border-[#2563EB] bg-[#2563EB]'
                        : 'border-slate-300'
                    }`}
                  >
                    {language === lang.code && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide text-white bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 shadow-sm focus-visible-ring"
            >
              <span>CONTINUE</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default InitialSetupForm;
