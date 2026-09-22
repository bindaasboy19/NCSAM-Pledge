import React from 'react';
import { Shield, ExternalLink } from 'lucide-react';
import { PLEDGE_CONFIG } from '../../config/pledgeConfig';

/**
 * Editorial light-theme campaign footer.
 * Features:
 * - Full campaign name: National Cyber Security Awareness Month (NCSAM)
 * - The Cyber Shield Project (A Project by Naksh Foundation)
 * - Provided logo.png
 * - Verified links to Privacy Policy, Terms & Conditions, and Contact/Support
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  const { footerLinks, campaign } = PLEDGE_CONFIG;

  return (
    <footer className="w-full bg-white border-t border-slate-200 py-12 px-4 sm:px-6" role="contentinfo">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        {/* Logo and campaign identity */}
        <div className="flex flex-col items-center md:items-start gap-2.5">
          <img
            src="/logo.png"
            alt={`${campaign.initiativeName} - ${campaign.initiativeSubtitle}`}
            className="h-8 w-auto object-contain"
          />
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
            {campaign.fullName} (NCSAM) initiative dedicated to advancing digital vigilance,
            privacy protection, and cyber safety practices for everyone.
          </p>
        </div>

        {/* Footer Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium">
          <a
            href={footerLinks.privacyPolicy}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#2563EB] transition-colors inline-flex items-center gap-1"
          >
            <span>Privacy Policy</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <span className="text-slate-300" aria-hidden="true">•</span>
          <a
            href={footerLinks.termsAndConditions}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#2563EB] transition-colors inline-flex items-center gap-1"
          >
            <span>Terms & Conditions</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <span className="text-slate-300" aria-hidden="true">•</span>
          <a
            href={footerLinks.contactSupport}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#2563EB] transition-colors inline-flex items-center gap-1"
          >
            <span>Contact & Support</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>

        {/* Campaign dedication */}
        <div className="flex flex-col items-center md:items-end gap-1 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-[#0B1F4D] font-semibold">
            <Shield className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" />
            <span>{campaign.initiativeName}</span>
          </div>
          <p className="text-[11px] text-slate-500">{campaign.initiativeSubtitle}</p>
          <p className="text-[11px] text-slate-400 mt-1">© {currentYear} NCSAM Initiative. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
