import React from 'react';
import { Shield } from 'lucide-react';

/**
 * Editorial light-theme campaign footer reusing the provided logo.
 * Free of social media links as requested.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-slate-200 py-12 px-4 sm:px-6" role="contentinfo">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Logo and campaign identity */}
        <div className="flex flex-col items-center md:items-start gap-2.5">
          <img
            src="/logo.png"
            alt="The Cyber Shield Project by Naksh Foundation"
            className="h-8 w-auto object-contain"
          />
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
            National Cyber Security Awareness Month (NCSAM) initiative dedicated to advancing
            digital vigilance, privacy protection, and cyber safety practices for everyone.
          </p>
        </div>

        {/* Campaign dedication */}
        <div className="flex flex-col items-center md:items-end gap-1 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-[#0B1F4D] font-medium">
            <Shield className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" />
            <span>The Cyber Shield Project</span>
          </div>
          <p>© {currentYear} NCSAM Initiative. All rights reserved.</p>
          <p className="text-[11px] text-slate-400">Privacy-first digital commitment</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
