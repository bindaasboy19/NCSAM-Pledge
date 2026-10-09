
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import {
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
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
 * AdminDashboardPage
 *
 * Read-only administrative dashboard for pledge submissions.
 *
 * Features:
 * - Loads ALL pledge records in a single request
 * - No server-side pagination
 * - Search and client-side filters
 * - Campaign statistics
 * - Read-only pledge details modal
 */
export function AdminDashboardPage({ onNavigate }) {

  // ---------------------------------------------------------
  // Session protection
  // ---------------------------------------------------------

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      if (onNavigate) {
        onNavigate('/admin/login');
      }
    }
  }, [onNavigate]);


  // ---------------------------------------------------------
  // Statistics
  // ---------------------------------------------------------

  const [stats, setStats] = useState({
    totalPledges: 0,
    certificatesSent: 0,
    certificatesPending: 0,
    certificatesFailed: 0,
  });


  // ---------------------------------------------------------
  // Pledges
  // ---------------------------------------------------------

  const [pledges, setPledges] = useState([]);


  // ---------------------------------------------------------
  // Search & Filters
  // ---------------------------------------------------------

  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');
  const [receiveCertFilter, setReceiveCertFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');


  // ---------------------------------------------------------
  // Loading / Error / Modal
  // ---------------------------------------------------------

  const [isLoading, setIsLoading] = useState(true);
  const [selectedPledge, setSelectedPledge] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');


  // ---------------------------------------------------------
  // Load KPI Stats
  // ---------------------------------------------------------

  const loadStats = useCallback(async () => {
    try {
      const data = await getAdminStats();

      if (data) {
        setStats(data);
      }
    } catch {
      // Keep existing stats if request fails.
    }
  }, []);


  // ---------------------------------------------------------
  // Load ALL Pledges
  // ---------------------------------------------------------

  const loadPledges = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg('');

    try {

      /*
       * IMPORTANT:
       * No page, size or pagination parameters are sent.
       *
       * Backend endpoint:
       * GET /api/admin/pledges
       *
       * Backend returns:
       * List<Pledge>
       */

      const result = await getAdminPledges();

      if (Array.isArray(result)) {
        setPledges(result);
      } else if (Array.isArray(result?.content)) {
        /*
         * Fallback in case the service/backend still returns
         * a paginated object.
         */
        setPledges(result.content);
      } else {
        setPledges([]);
      }

    } catch (err) {

      setErrorMsg(
        err?.message || 'Unable to load pledge records.'
      );

      setPledges([]);

    } finally {
      setIsLoading(false);
    }
  }, []);


  // ---------------------------------------------------------
  // Initial Load
  // ---------------------------------------------------------

  useEffect(() => {
    loadStats();
    loadPledges();
  }, [loadStats, loadPledges]);


  // ---------------------------------------------------------
  // Search Submit
  // ---------------------------------------------------------

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput.trim());
  };


  // ---------------------------------------------------------
  // Clear Filters
  // ---------------------------------------------------------

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setStatusFilter('all');
    setReceiveCertFilter('all');
    setLanguageFilter('all');
  };


  // ---------------------------------------------------------
  // Status Badge
  // ---------------------------------------------------------

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


  // ---------------------------------------------------------
  // Client-side filtering
  // ---------------------------------------------------------

  const filteredPledges = useMemo(() => {

    const normalizedSearch = searchTerm.toLowerCase();

    return pledges.filter((p) => {

      // -------------------------
      // Search
      // -------------------------

      if (normalizedSearch) {

        const searchableText = [
          p.officialName,
          p.name,
          p.email,
          p.phone,
          p.mobile,
          p.pledgeNumber,
          p.certificateId,
          p.certificateNumber,
          p.organisation,
          p.organization,
          p.occupation,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!searchableText.includes(normalizedSearch)) {
          return false;
        }
      }


      // -------------------------
      // Certificate status
      // -------------------------

      if (
        statusFilter !== 'all' &&
        p.certificateStatus !== statusFilter
      ) {
        return false;
      }


      // -------------------------
      // Certificate requested
      // -------------------------

      if (receiveCertFilter !== 'all') {

        const receiveCertificate =
          p.receiveCertificate === true ||
          p.receiveCertificate === 'true' ||
          p.receiveCertificate === 'yes';

        if (
          receiveCertFilter === 'yes' &&
          !receiveCertificate
        ) {
          return false;
        }

        if (
          receiveCertFilter === 'no' &&
          receiveCertificate
        ) {
          return false;
        }
      }


      // -------------------------
      // Language
      // -------------------------

      if (
        languageFilter !== 'all' &&
        p.language &&
        p.language !== languageFilter
      ) {
        return false;
      }

      return true;
    });

  }, [
    pledges,
    searchTerm,
    statusFilter,
    receiveCertFilter,
    languageFilter,
  ]);


  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#050505] flex flex-col selection:bg-[#2563EB] selection:text-white">

      {/* Admin Header */}

      <AdminHeader
        onNavigate={onNavigate}
        onLogout={() =>
          onNavigate && onNavigate('/admin/login')
        }
      />


      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* -------------------------------------------------
            Page Title
        ------------------------------------------------- */}

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

            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isLoading
                  ? 'animate-spin text-[#2563EB]'
                  : ''
              }`}
            />

            <span>Refresh Telemetry</span>

          </button>

        </div>


        {/* -------------------------------------------------
            KPI Cards
        ------------------------------------------------- */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">

          {/* Total Pledges */}

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


          {/* Certificates Sent */}

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


          {/* Pending */}

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


          {/* Failed */}

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


        {/* -------------------------------------------------
            Search & Filters
        ------------------------------------------------- */}

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">

          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-wrap items-center gap-3"
          >

            <div className="relative flex-1 min-w-[240px]">

              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>

              <input
                type="text"
                value={searchInput}
                onChange={(e) =>
                  setSearchInput(e.target.value)
                }
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


            {(searchTerm ||
              statusFilter !== 'all' ||
              receiveCertFilter !== 'all' ||
              languageFilter !== 'all') && (

              <button
                type="button"
                onClick={handleClearFilters}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Reset Filters
              </button>

            )}

          </form>


          {/* Filter Dropdowns */}

          <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">

            <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">

              <Filter className="w-3 h-3" />

              <span>Filters:</span>

            </div>


            {/* Status */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#2563EB]"
              aria-label="Filter by certificate status"
            >

              <option value="all">
                Status: All
              </option>

              <option value="sent">
                Status: Sent
              </option>

              <option value="pending">
                Status: Pending
              </option>

              <option value="failed">
                Status: Failed
              </option>

              <option value="not_requested">
                Status: Not Requested
              </option>

            </select>


            {/* Certificate Requested */}

            <select
              value={receiveCertFilter}
              onChange={(e) =>
                setReceiveCertFilter(e.target.value)
              }
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#2563EB]"
              aria-label="Filter by certificate request"
            >

              <option value="all">
                Cert Requested: All
              </option>

              <option value="yes">
                Cert Requested: Yes
              </option>

              <option value="no">
                Cert Requested: No
              </option>

            </select>


            {/* Language */}

            <select
              value={languageFilter}
              onChange={(e) =>
                setLanguageFilter(e.target.value)
              }
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#2563EB]"
              aria-label="Filter by language"
            >

              <option value="all">
                Language: All
              </option>

              <option value="en">
                English (EN)
              </option>

              <option value="hi">
                Hindi (HI)
              </option>

            </select>

          </div>

        </div>


        {/* Error */}

        {errorMsg && (

          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">

            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />

            <span>{errorMsg}</span>

          </div>

        )}


        {/* -------------------------------------------------
            Pledge Table
        ------------------------------------------------- */}

        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-left text-xs sm:text-sm">

              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">

                <tr>

                  <th className="py-3 px-4">
                    Pledge #
                  </th>

                  <th className="py-3 px-4">
                    Participant Name
                  </th>

                  <th className="py-3 px-4">
                    Email & Phone
                  </th>

                  <th className="py-3 px-4">
                    Certificate ID
                  </th>

                  <th className="py-3 px-4">
                    Delivery Status
                  </th>

                  <th className="py-3 px-4 text-right">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">

                {/* Loading */}

                {isLoading ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="py-12 text-center text-slate-400"
                    >

                      <div className="flex flex-col items-center justify-center gap-2">

                        <Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" />

                        <span className="text-xs">
                          Fetching verified pledge records...
                        </span>

                      </div>

                    </td>

                  </tr>

                ) : errorMsg ? (

                  /* Error */

                  <tr>

                    <td
                      colSpan={7}
                      className="py-12 text-center text-slate-400"
                    >

                      <div className="flex flex-col items-center justify-center gap-2 max-w-md mx-auto">

                        <AlertCircle className="w-8 h-8 text-rose-500 mb-1" />

                        <span className="font-semibold text-sm text-rose-700">
                          Failed to load pledge records
                        </span>

                        <span className="text-xs text-slate-500">
                          {errorMsg}
                        </span>

                        <button
                          type="button"
                          onClick={loadPledges}
                          className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-semibold transition-colors"
                        >

                          <RefreshCw className="w-3.5 h-3.5" />

                          <span>Try Again</span>

                        </button>

                      </div>

                    </td>

                  </tr>

                ) : filteredPledges.length === 0 ? (

                  /* Empty */

                  <tr>

                    <td
                      colSpan={7}
                      className="py-12 text-center text-slate-400"
                    >

                      <div className="flex flex-col items-center justify-center gap-1">

                        <Shield className="w-8 h-8 text-slate-300 mb-1" />

                        <span className="font-semibold text-sm text-slate-600">
                          No pledge submissions found
                        </span>

                        <span className="text-xs text-slate-400">
                          Try adjusting your search criteria or resetting filters.
                        </span>

                      </div>

                    </td>

                  </tr>

                ) : (

                  /* ALL RECORDS */

                  filteredPledges.map((p) => {

                    const recDate = p.createdAt
                      ? new Date(
                          p.createdAt
                        ).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                        : '';
                      


                    return (

                      <tr
                        key={
                          p.id ||
                          p.pledgeNumber ||
                          p._id
                        }
                        className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                        onClick={() =>
                          setSelectedPledge(p)
                        }
                      >

                        {/* Pledge # */}

                        <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                          #{p.pledgeNumber}
                        </td>


                        {/* Name */}

                        <td className="py-3.5 px-4">

                          <div className="font-bold text-[#0B1F4D]">

                            {p.title
                              ? `${p.title} `
                              : ''}

                            {p.officialName ||
                              p.name ||
                              'N/A'}

                          </div>


                          {(p.organization ||
                            p.organisation) && (

                            <div className="text-[11px] text-slate-400 truncate max-w-[180px]">

                              {p.organization ||
                                p.organisation}

                            </div>

                          )}

                        </td>


                        {/* Contact */}

                        <td className="py-3.5 px-4">

                          <div className="text-slate-800 truncate max-w-[200px]">
                            {p.email || 'N/A'}
                          </div>

                          <div className="text-[11px] text-slate-400 font-mono">
                            {p.phone ||
                              p.mobile ||
                              'N/A'}
                          </div>

                        </td>


                        {/* Certificate ID */}

                        <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-600">

                          {p.certificateId ||
                            p.certificateNumber ||
                            'Pending'}

                        </td>


                        {/* Status */}

                        <td className="py-3.5 px-4">
                          {getStatusBadge(
                            p.certificateStatus
                          )}
                        </td>


                        {/* Date */}

                       


                        {/* Action */}

                        <td
                          className="py-3.5 px-4 text-right"
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        >

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedPledge(p)
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors focus-visible-ring"
                            aria-label={`View details for pledge ${p.pledgeNumber}`}
                          >

                            <Eye className="w-3.5 h-3.5 text-[#2563EB]" />

                            <span>
                              Details
                            </span>

                          </button>

                        </td>

                      </tr>

                    );

                  })

                )}

              </tbody>

            </table>

          </div>


          {/* -------------------------------------------------
              Record Count
          ------------------------------------------------- */}

          {!isLoading &&
            !errorMsg &&
            pledges.length > 0 && (

              <div className="p-4 border-t border-slate-100 text-xs text-slate-500">

                Showing{' '}

                <span className="font-semibold text-slate-800">
                  {filteredPledges.length}
                </span>

                {' '}of{' '}

                <span className="font-semibold text-slate-800">
                  {pledges.length}
                </span>

                {' '}pledge records

              </div>

            )}

        </div>

      </main>


      {/* User Details Modal */}

      <UserDetailsModal
        isOpen={Boolean(selectedPledge)}
        onClose={() =>
          setSelectedPledge(null)
        }
        pledge={selectedPledge}
      />

    </div>
  );
}


export default AdminDashboardPage;
