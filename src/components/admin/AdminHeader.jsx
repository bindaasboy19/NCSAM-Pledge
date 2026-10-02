import React from 'react';
import { Shield, LogOut, ExternalLink, User } from 'lucide-react';
import { clearAdminSession, getAdminSession } from '../../services/adminService';

/**
 * AdminHeader: Top navigation bar for the secure Admin Portal.
 * 
 * Features:
 * - Brand logo and official "Admin Portal" badge
 * - Link back to public pledge landing page
 * - Active administrator identification
 * - Secure session termination (Logout)
 */
export function AdminHeader({ onNavigate, onLogout }) {
  const session = getAdminSession();
  const userName = session?.user || 'Administrator';

  const handleLogoutClick = () => {
    clearAdminSession();
    if (onLogout) {
      onLogout();
    } else if (onNavigate) {
      onNavigate('/admin/login');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B1F4D] text-white border-b border-slate-700/60 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand & Admin Tag */}
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/admin')}
            className="flex items-center gap-2 text-left focus-visible-ring rounded-lg p-1"
          >
            <img
              src="/logo.png"
              alt="The Cyber Shield Project"
              className="h-7 w-auto object-contain brightness-0 invert"
            />
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-sm tracking-tight text-white block leading-none">
                Cyber Shield Project
              </span>
              <span className="text-[10px] text-blue-300 font-mono tracking-wider uppercase">
                Campaign Administration
              </span>
            </div>
          </button>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30 font-mono uppercase tracking-wider">
            <Shield className="w-2.5 h-2.5 text-blue-400" />
            Read-Only
          </span>
        </div>

        {/* Right: User identification, View Public Site, and Logout */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/')}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-700/80">
            <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-200">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-200 truncate max-w-[120px] lg:max-w-[180px]">
              {userName}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogoutClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 transition-colors focus-visible-ring"
            aria-label="Log out of Admin Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
