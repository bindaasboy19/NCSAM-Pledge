import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Shield,
  Loader2,
  Users,
} from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { UserDetailsModal } from '../../components/admin/UserDetailsModal';
import {
  getAdminStats,
  getAdminPledges,
  isAdminAuthenticated,
} from '../../services/adminService';

/**
 * AdminDashboardPage: Read-Only Executive Dashboard for Pledge Submissions.
 * 
 * Capabilities:
 * - Server-side paginated table with dynamic search and multi-criteria filters
 * - Real-time campaign stats (Total Pledges, Certificates Sent, Pending, Failed)
 * - Row inspection triggering full read-only User Details inspector
 * - Strict read-only enforcement: zero edit, delete, or mutation controls
 */
export function AdminDashboardPage({ onNavigate }) {
  // Session protection check
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      if (onNavigate) {
        onNavigate('/admin/login');
      }
    }
  }, [onNavigate]);

  // Statistics
  const [stats, setStats] = useState({
    totalPledges: 0,
    certificatesSent: 0,
    certificatesPending: 0,
    certificatesFailed: 0,
  });

  // Query & Pagination State
  const [pledges, setPledges] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters & Search
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [receiveCertFilter, setReceiveCertFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');

  // Loading & Modals
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPledge, setSelectedPledge] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Load KPI Stats
  const loadStats = useCallback(async () => {
    try {
      const data = await getAdminStats();
      if (data) setStats(data);
    } catch {
      // Fallback
    }
  }, []);

  // Load Pledges with current parameters
  const loadPledges = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await getAdminPledges({
        page,
        size,
        search: searchTerm,
        status: statusFilter,
        receiveCertificate: receiveCertFilter,
        language: languageFilter,
      });

      if (result) {
        setPledges(result.content || []);
        setTotalPages(result.totalPages || 1);
        setTotalElements(result.totalElements || 0);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to load pledge records.');
    } finally {
      setIsLoading(false);
    }
  }, [page, size, searchTerm, statusFilter, receiveCertFilter, languageFilter]);

  // Initial load
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadPledges();
  }, [loadPledges]);

  // Debounced search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    setSearchTerm(searchInput);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setStatusFilter('all');
    setReceiveCertFilter('all');
    setLanguageFilter('all');
    setPage(0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Sent
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Not Requested
          </span>
        );
    }
  };

  const startEntry = totalElements === 0 ? 0 : page * size + 1;
  const endEntry = Math.min((page + 1) * size, totalElements);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#050505] flex flex-col selection:bg-[#2563EB] selection:text-white">
      {/* Top Admin Header */}
      <AdminHeader
        onNavigate={onNavigate}
        onLogout={() => onNavigate && onNavigate('/admin/login')}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Page Title & Refresh */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0B1F4D] tracking-tight">
              Campaign Pledge Telemetry
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Read-only administrative overview of verified citizen pledges and certificate dispatches.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              loadStats();
              loadPledges();
            }}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-sm focus-visible-ring"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#2563EB]' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>

        {/* 4 Stat KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {/* 1. Total Pledges */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Pledges
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#0B1F4D] tracking-tight">
              {stats.totalPledges.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
              100% Verified Records
            </span>
          </div>

          {/* 2. Certificates Sent */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Certificates Sent
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 tracking-tight">
              {stats.certificatesSent.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-500 font-medium mt-1 block">
              Dispatched via SMTP
            </span>
          </div>

          {/* 3. Pending Queue */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pending Dispatch
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-700 tracking-tight">
              {stats.certificatesPending.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-500 font-medium mt-1 block">
              Asynchronous Queue
            </span>
          </div>

          {/* 4. Failed Dispatches */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Delivery Failed
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-700 tracking-tight">
              {stats.certificatesFailed.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-500 font-medium mt-1 block">
              Invalid or Bounced Mail
            </span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, email, phone, pledge #, or cert ID..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-[#050505] placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-50 transition-all"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors focus-visible-ring"
            >
              Search
            </button>

            {/* Clear Filters Button if any active */}
            {(searchTerm || statusFilter !== 'all' || receiveCertFilter !== 'all' || languageFilter !== 'all') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </form>

          {/* Secondary Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <Filter className="w-3 h-3" />
              <span>Filters:</span>
            </div>

            {/* Certificate Status */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setPage(0);
                setStatusFilter(e.target.value);
              }}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#2563EB]"
              aria-label="Filter by certificate status"
            >
              <option value="all">Status: All</option>
              <option value="sent">Status: Sent</option>
              <option value="pending">Status: Pending</option>
              <option value="failed">Status: Failed</option>
              <option value="not_requested">Status: Not Requested</option>
            </select>

            {/* Certificate Requested */}
            <select
              value={receiveCertFilter}
              onChange={(e) => {
                setPage(0);
                setReceiveCertFilter(e.target.value);
              }}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#2563EB]"
              aria-label="Filter by certificate request"
            >
              <option value="all">Cert Requested: All</option>
              <option value="yes">Cert Requested: Yes</option>
              <option value="no">Cert Requested: No</option>
            </select>

            {/* Language */}
            <select
              value={languageFilter}
              onChange={(e) => {
                setPage(0);
                setLanguageFilter(e.target.value);
              }}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#2563EB]"
              aria-label="Filter by language"
            >
              <option value="all">Language: All</option>
              <option value="en">English (EN)</option>
              <option value="hi">Hindi (HI)</option>
            </select>
          </div>
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Pledges Data Table Container */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Pledge #</th>
                  <th className="py-3 px-4">Participant Name</th>
                  <th className="py-3 px-4">Email & Phone</th>
                  <th className="py-3 px-4">Certificate ID</th>
                  <th className="py-3 px-4">Delivery Status</th>
                  <th className="py-3 px-4">Recorded Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" />
                        <span className="text-xs">Fetching verified pledge records...</span>
                      </div>
                    </td>
                  </tr>
                ) : pledges.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Shield className="w-8 h-8 text-slate-300 mb-1" />
                        <span className="font-semibold text-sm text-slate-600">No pledge submissions found</span>
                        <span className="text-xs text-slate-400">
                          Try adjusting your search criteria or resetting filters.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pledges.map((p) => {
                    const recDate = p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                      : 'N/A';

                    return (
                      <tr
                        key={p.id || p.pledgeNumber}
                        className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                        onClick={() => setSelectedPledge(p)}
                      >
                        {/* Pledge # */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                          #{p.pledgeNumber}
                        </td>

                        {/* Name & Title */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#0B1F4D]">
                            {p.title ? `${p.title} ` : ''}{p.name}
                          </div>
                          {p.organization && (
                            <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                              {p.organization}
                            </div>
                          )}
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-4">
                          <div className="text-slate-800 truncate max-w-[200px]">
                            {p.email}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {p.phone}
                          </div>
                        </td>

                        {/* Certificate ID */}
                        <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-600">
                          {p.certificateId || 'Pending'}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {getStatusBadge(p.certificateStatus)}
                        </td>

                        {/* Timestamp */}
                        <td className="py-3.5 px-4 text-slate-500 text-xs">
                          {recDate}
                        </td>

                        {/* Action: View Details */}
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setSelectedPledge(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors focus-visible-ring"
                            aria-label={`View details for pledge ${p.pledgeNumber}`}
                          >
                            <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
                            <span>Details</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Server-Side Pagination Bar */}
          <div className="p-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            {/* Range info */}
            <div>
              Showing <span className="font-semibold text-slate-800">{startEntry}</span> to{' '}
              <span className="font-semibold text-slate-800">{endEntry}</span> of{' '}
              <span className="font-semibold text-slate-800">{totalElements}</span> entries
            </div>

            {/* Page buttons */}
            <div className="flex items-center gap-2">
              {/* Rows per page selector */}
              <div className="flex items-center gap-1.5 mr-2">
                <span>Rows:</span>
                <select
                  value={size}
                  onChange={(e) => {
                    setPage(0);
                    setSize(Number(e.target.value));
                  }}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium focus:outline-none"
                  aria-label="Rows per page"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Prev Button */}
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0 || isLoading}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-medium text-slate-700 px-1">
                Page {page + 1} of {totalPages}
              </span>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1 || isLoading}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Read-Only User Details Inspector Modal */}
      <UserDetailsModal
        isOpen={Boolean(selectedPledge)}
        onClose={() => setSelectedPledge(null)}
        pledge={selectedPledge}
      />
    </div>
  );
}

export default AdminDashboardPage;
