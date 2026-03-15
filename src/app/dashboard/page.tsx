"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import {
  Lock,
  Search,
  Download,
  FileText,
  DollarSign,
  TrendingUp,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Users,
  ArrowUpDown,
  LogOut,
} from "lucide-react";

interface Proposal {
  id: string;
  created_at: string;
  company_name: string;
  industry: string | null;
  employee_count: number;
  shamel_individual_count: number;
  shamel_family_count: number;
  mini_individual_count: number;
  mini_family_count: number;
  tier_type: string | null;
  shamel_subtotal: number;
  mini_subtotal: number;
  total_annual: number;
  lump_sum_discount: number;
  final_total: number;
  sales_name: string | null;
  sales_title: string | null;
  recipient_name: string | null;
  recipient_title: string | null;
  quotation_date: string | null;
  language: string | null;
  payment_terms: string | null;
  offer_validity: string | null;
  notes: string | null;
}

type SortField = "created_at" | "company_name" | "employee_count" | "final_total";
type SortDir = "asc" | "desc";

function formatEGP(n: number) {
  return new Intl.NumberFormat("en-EG").format(Math.round(n));
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function paymentLabel(value: string | null) {
  const map: Record<string, string> = {
    "100_upfront": "100% upfront",
    "50_50": "50/50 split",
    quarterly: "Quarterly",
    net_30: "Net 30",
    net_60: "Net 60",
  };
  return value ? map[value] || value : "—";
}

function languageLabel(value: string | null) {
  const map: Record<string, string> = {
    en: "English",
    ar: "Arabic",
    both: "Both",
  };
  return value ? map[value] || value : "—";
}

export default function DashboardPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [fetching, setFetching] = useState(false);

  // Check sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("dashboard_password");
    if (stored) {
      setPassword(stored);
      setAuthenticated(true);
    }
  }, []);

  const fetchProposals = useCallback(
    async (searchQuery = "") => {
      setFetching(true);
      try {
        const storedPw = sessionStorage.getItem("dashboard_password") || password;
        const url = searchQuery
          ? `/api/proposals?search=${encodeURIComponent(searchQuery)}`
          : "/api/proposals";
        const res = await fetch(url, {
          headers: { "x-dashboard-password": storedPw },
        });
        if (res.ok) {
          const data = await res.json();
          setProposals(data.proposals || []);
        } else if (res.status === 401) {
          setAuthenticated(false);
          sessionStorage.removeItem("dashboard_password");
        }
      } catch {
        // silently fail
      } finally {
        setFetching(false);
      }
    },
    [password]
  );

  // Fetch when authenticated
  useEffect(() => {
    if (authenticated) {
      fetchProposals();
    }
  }, [authenticated, fetchProposals]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAuthError(false);
    try {
      const res = await fetch("/api/dashboard/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.valid) {
        sessionStorage.setItem("dashboard_password", password);
        setAuthenticated(true);
      } else {
        setAuthError(true);
      }
    } catch {
      setAuthError(true);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("dashboard_password");
    setAuthenticated(false);
    setPassword("");
    setProposals([]);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchProposals(search);
  }

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  const sorted = [...proposals].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortField === "company_name") {
      return a.company_name.localeCompare(b.company_name) * dir;
    }
    if (sortField === "employee_count") {
      return (a.employee_count - b.employee_count) * dir;
    }
    if (sortField === "final_total") {
      return (a.final_total - b.final_total) * dir;
    }
    // created_at
    return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * dir;
  });

  // Stats
  const totalRevenue = proposals.reduce((s, p) => s + Number(p.final_total), 0);
  const avgDealSize = proposals.length > 0 ? totalRevenue / proposals.length : 0;
  const thisMonth = new Date();
  const thisMonthCount = proposals.filter((p) => {
    const d = new Date(p.created_at);
    return d.getMonth() === thisMonth.getMonth() && d.getFullYear() === thisMonth.getFullYear();
  }).length;

  function exportCSV() {
    const headers = [
      "Date",
      "Company",
      "Industry",
      "Recipient",
      "Recipient Title",
      "Sales Rep",
      "Employees",
      "Shamel Ind",
      "Shamel Fam",
      "Mini Ind",
      "Mini Fam",
      "Tier",
      "Subtotal (Shamel)",
      "Subtotal (Mini)",
      "Total Annual",
      "Discount %",
      "Final Total",
      "Language",
      "Payment Terms",
      "Offer Validity",
      "Notes",
    ];
    const rows = proposals.map((p) => [
      p.quotation_date || formatDate(p.created_at),
      p.company_name,
      p.industry || "",
      p.recipient_name || "",
      p.recipient_title || "",
      p.sales_name || "",
      p.employee_count,
      p.shamel_individual_count,
      p.shamel_family_count,
      p.mini_individual_count,
      p.mini_family_count,
      p.tier_type || "",
      Math.round(p.shamel_subtotal),
      Math.round(p.mini_subtotal),
      Math.round(p.total_annual),
      p.lump_sum_discount,
      Math.round(p.final_total),
      languageLabel(p.language),
      paymentLabel(p.payment_terms),
      p.offer_validity || "",
      (p.notes || "").replace(/"/g, '""'),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((v) => `"${v}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `shamel-proposals-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  }

  // --- Password gate ---
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-sm"
        >
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg shadow-cyan-200">
              <Lock className="text-white" size={28} />
            </div>
          </div>
          <h1 className="text-xl font-bold text-gray-900 text-center mb-2">Proposals Dashboard</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your password to access the dashboard
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setAuthError(false);
            }}
            placeholder="Password"
            className={`w-full px-4 py-3 rounded-xl border ${
              authError ? "border-red-400 ring-2 ring-red-100" : "border-gray-200"
            } focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-gray-900 placeholder-gray-400 mb-1`}
            autoFocus
          />
          {authError && (
            <p className="text-xs text-red-500 mb-3 mt-1">Incorrect password. Try again.</p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full mt-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 shadow-lg shadow-cyan-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Verifying..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    );
  }

  // --- Dashboard ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-cyan-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Proposals Dashboard</h1>
              <p className="text-xs text-gray-500">Shamel Enterprise by Vezeeta</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                <FileText size={20} className="text-cyan-600" />
              </div>
              <span className="text-sm text-gray-500">Total Proposals</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{proposals.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <DollarSign size={20} className="text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatEGP(totalRevenue)} <span className="text-sm font-normal text-gray-500">EGP</span></p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <TrendingUp size={20} className="text-amber-600" />
              </div>
              <span className="text-sm text-gray-500">Avg Deal Size</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatEGP(avgDealSize)} <span className="text-sm font-normal text-gray-500">EGP</span></p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <CalendarDays size={20} className="text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">This Month</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{thisMonthCount}</p>
          </div>
        </div>

        {/* Search + Export */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by company name..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-gray-900 placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-cyan-600 text-white font-medium hover:bg-cyan-700 transition-colors cursor-pointer"
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  fetchProposals("");
                }}
                className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </form>
          <button
            onClick={exportCSV}
            disabled={proposals.length === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {fetching ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <div className="animate-spin w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full" />
              <span className="ml-3">Loading proposals...</span>
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <FileText size={48} className="mb-3 opacity-50" />
              <p className="text-lg font-medium">No proposals found</p>
              <p className="text-sm">{search ? "Try a different search term" : "Proposals will appear here once created"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-600">
                      <button onClick={() => toggleSort("created_at")} className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                        Date <ArrowUpDown size={14} className={sortField === "created_at" ? "text-cyan-600" : "text-gray-300"} />
                      </button>
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-600">
                      <button onClick={() => toggleSort("company_name")} className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                        Company <ArrowUpDown size={14} className={sortField === "company_name" ? "text-cyan-600" : "text-gray-300"} />
                      </button>
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Recipient</th>
                    <th className="text-right px-5 py-3.5 font-semibold text-gray-600">
                      <button onClick={() => toggleSort("employee_count")} className="flex items-center gap-1 ml-auto cursor-pointer hover:text-gray-900">
                        Employees <ArrowUpDown size={14} className={sortField === "employee_count" ? "text-cyan-600" : "text-gray-300"} />
                      </button>
                    </th>
                    <th className="text-right px-5 py-3.5 font-semibold text-gray-600">Shamel</th>
                    <th className="text-right px-5 py-3.5 font-semibold text-gray-600">Mini</th>
                    <th className="text-right px-5 py-3.5 font-semibold text-gray-600">
                      <button onClick={() => toggleSort("final_total")} className="flex items-center gap-1 ml-auto cursor-pointer hover:text-gray-900">
                        Final Total <ArrowUpDown size={14} className={sortField === "final_total" ? "text-cyan-600" : "text-gray-300"} />
                      </button>
                    </th>
                    <th className="text-center px-5 py-3.5 font-semibold text-gray-600">Lang</th>
                    <th className="px-5 py-3.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((p) => {
                    const isExpanded = expandedId === p.id;
                    const shamelTotal = p.shamel_individual_count + p.shamel_family_count;
                    const miniTotal = p.mini_individual_count + p.mini_family_count;
                    return (
                      <Fragment key={p.id}>
                        <tr
                          className={`border-b border-gray-50 hover:bg-cyan-50/30 transition-colors cursor-pointer ${
                            isExpanded ? "bg-cyan-50/40" : ""
                          }`}
                          onClick={() => setExpandedId(isExpanded ? null : p.id)}
                        >
                          <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                            {p.quotation_date ? formatDate(p.quotation_date) : formatDate(p.created_at)}
                          </td>
                          <td className="px-5 py-3.5 font-medium text-gray-900">{p.company_name}</td>
                          <td className="px-5 py-3.5 text-gray-600">{p.recipient_name || "—"}</td>
                          <td className="px-5 py-3.5 text-right text-gray-700">
                            <span className="inline-flex items-center gap-1">
                              <Users size={14} className="text-gray-400" />
                              {p.employee_count}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right text-gray-700">{shamelTotal || "—"}</td>
                          <td className="px-5 py-3.5 text-right text-gray-700">{miniTotal || "—"}</td>
                          <td className="px-5 py-3.5 text-right font-semibold text-gray-900">
                            {formatEGP(p.final_total)} <span className="text-xs font-normal text-gray-400">EGP</span>
                            {p.lump_sum_discount > 0 && (
                              <span className="ml-1.5 text-xs text-green-600 font-medium">-{p.lump_sum_discount}%</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                              {languageLabel(p.language)}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-gray-400">
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-cyan-50/20">
                            <td colSpan={9} className="px-5 py-5">
                              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Sales Rep</p>
                                  <p className="text-gray-800">{p.sales_name || "—"}</p>
                                  <p className="text-gray-500 text-xs">{p.sales_title || ""}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Recipient</p>
                                  <p className="text-gray-800">{p.recipient_name || "—"}</p>
                                  <p className="text-gray-500 text-xs">{p.recipient_title || ""}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Industry</p>
                                  <p className="text-gray-800">{p.industry || "—"}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Tier</p>
                                  <p className="text-gray-800">{p.tier_type || "—"}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Payment Terms</p>
                                  <p className="text-gray-800">{paymentLabel(p.payment_terms)}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Offer Validity</p>
                                  <p className="text-gray-800">{p.offer_validity || "—"}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Breakdown</p>
                                  <div className="text-gray-800 space-y-0.5">
                                    {p.shamel_individual_count > 0 && <p>Shamel Ind: {p.shamel_individual_count}</p>}
                                    {p.shamel_family_count > 0 && <p>Shamel Fam: {p.shamel_family_count}</p>}
                                    {p.mini_individual_count > 0 && <p>Mini Ind: {p.mini_individual_count}</p>}
                                    {p.mini_family_count > 0 && <p>Mini Fam: {p.mini_family_count}</p>}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Financials</p>
                                  <div className="text-gray-800 space-y-0.5">
                                    {p.shamel_subtotal > 0 && <p>Shamel: {formatEGP(p.shamel_subtotal)} EGP</p>}
                                    {p.mini_subtotal > 0 && <p>Mini: {formatEGP(p.mini_subtotal)} EGP</p>}
                                    <p>Total: {formatEGP(p.total_annual)} EGP</p>
                                    {p.lump_sum_discount > 0 && (
                                      <p className="text-green-600">Discount: {p.lump_sum_discount}% → {formatEGP(p.final_total)} EGP</p>
                                    )}
                                  </div>
                                </div>
                                {p.notes && (
                                  <div className="sm:col-span-2 lg:col-span-1">
                                    <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Notes</p>
                                    <p className="text-gray-800 whitespace-pre-wrap">{p.notes}</p>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="text-center text-xs text-gray-400 mt-8">
          Showing {sorted.length} proposal{sorted.length !== 1 ? "s" : ""}
          {search && <span> matching &quot;{search}&quot;</span>}
        </div>
      </main>
    </div>
  );
}
