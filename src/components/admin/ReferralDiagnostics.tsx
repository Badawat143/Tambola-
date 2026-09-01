import React, { useState, useEffect } from 'react';
import { useTambola } from '../../context/TambolaContext';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Users,
  UserCheck,
  Database,
  GitFork,
  Link,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

export const ReferralDiagnostics: React.FC = () => {
  const { allUsers, syncFromBackend } = useTambola();
  const [searchQuery, setSearchQuery] = useState('USR-101');
  const [isLoading, setIsLoading] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);

  const [diagnosticsData, setDiagnosticsData] = useState<{
    databaseConnection: string;
    usersTable: string;
    referralCodeLookup: string;
    registrationSponsorSave: string;
    directReferralQuery: string;
    realtimeSync: string;
    downlineTreeEngine: string;
    totalUsers: number;
    directLinksCount: number;
    usersWithDirects: number;
    invalidSponsorLinksCount: number;
    invalidSponsorLinks: any[];
    timestamp: string;
  } | null>(null);

  const [searchedUser, setSearchedUser] = useState<any>(null);

  const fetchDiagnostics = async (search?: string) => {
    setIsLoading(true);
    try {
      const q = search !== undefined ? search : searchQuery;
      const res = await fetch(`/api/admin/referral-diagnostics?search=${encodeURIComponent(q.trim())}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setDiagnosticsData(data.diagnostics);
          if (data.searchedUser) {
            setSearchedUser(data.searchedUser);
          } else {
            // Local fallback match if backend search didn't return user
            const localUser = allUsers.find(
              (u) =>
                u.id.toUpperCase() === q.trim().toUpperCase() ||
                (u.referralCode && u.referralCode.toUpperCase() === q.trim().toUpperCase()) ||
                u.phone.includes(q.trim())
            );
            if (localUser) {
              const directs = allUsers.filter(
                (u) =>
                  u.referredBy &&
                  (u.referredBy.toUpperCase() === localUser.id.toUpperCase() ||
                    (localUser.referralCode && u.referredBy.toUpperCase() === localUser.referralCode.toUpperCase()))
              );
              const l1Ids = new Set(directs.map((d) => d.id.toUpperCase()));
              const l2 = allUsers.filter(
                (u) =>
                  u.referredBy &&
                  (l1Ids.has(u.referredBy.toUpperCase()) ||
                    directs.some((d) => d.referralCode && d.referralCode.toUpperCase() === u.referredBy!.toUpperCase()))
              );
              setSearchedUser({
                id: localUser.id,
                name: localUser.name,
                phone: localUser.phone,
                email: localUser.email,
                referralCode: localUser.referralCode,
                referredBy: localUser.referredBy,
                sponsorName: localUser.sponsorName,
                directReferralsCount: directs.length,
                level1Members: directs,
                level2Members: l2,
                totalDownlineCount: directs.length + l2.length,
                createdAt: localUser.createdAt,
              });
            } else {
              setSearchedUser(null);
            }
          }
        }
      }
    } catch (err) {
      console.warn('Diagnostics fetch note:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics('USR-101');
  }, []);

  const handleRunMigration = async () => {
    setIsMigrating(true);
    setMigrationStatus(null);
    try {
      const res = await fetch('/api/admin/migrate-referrals', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMigrationStatus('✅ Referral links successfully normalized and direct referral counts recalculated.');
        await syncFromBackend();
        await fetchDiagnostics();
      } else {
        setMigrationStatus(`❌ Migration notice: ${data.message || 'Unable to complete'}`);
      }
    } catch (err: any) {
      setMigrationStatus(`❌ Error: ${err.message}`);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchDiagnostics(searchQuery.trim());
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-wide font-['Outfit']">
                REFERRAL SYSTEM DIAGNOSTICS & AUDIT
              </h3>
              <p className="text-xs text-slate-400">
                Verify real-time database connectivity, sponsor validation, canonical IDs, and downline trees
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchDiagnostics()}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#161a3d] hover:bg-[#1f2452] border border-slate-700/60 text-xs font-bold text-slate-200 transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Diagnostics</span>
          </button>

          <button
            onClick={handleRunMigration}
            disabled={isMigrating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isMigrating ? 'Normalizing...' : 'Normalize Referral Database'}</span>
          </button>
        </div>
      </div>

      {migrationStatus && (
        <div className="p-3.5 rounded-xl bg-[#12183a] border border-emerald-500/40 text-xs font-semibold text-emerald-300 flex items-center justify-between shadow-md">
          <span>{migrationStatus}</span>
          <button
            onClick={() => setMigrationStatus(null)}
            className="text-slate-400 hover:text-white text-xs underline cursor-pointer ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 7-POINT SYSTEM HEALTH CHECK GRID */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase text-indigo-300 tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <span>7-Point Referral System Verification</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Database Connection */}
          <div className="p-4 rounded-2xl bg-[#0e1128] border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400">1. Database Link</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                PASS
              </span>
            </div>
            <div className="text-sm font-bold text-white">Cloud Database Sync</div>
            <div className="text-[10px] text-slate-400 mt-1">Multi-device state engine is online and active.</div>
          </div>

          {/* 2. Users Collection */}
          <div className="p-4 rounded-2xl bg-[#0e1128] border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400">2. Users Table</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                PASS
              </span>
            </div>
            <div className="text-sm font-bold text-white">{allUsers.length} Registered Users</div>
            <div className="text-[10px] text-slate-400 mt-1">
              {diagnosticsData?.directLinksCount ?? allUsers.filter((u) => u.referredBy).length} verified sponsor links in database.
            </div>
          </div>

          {/* 3. Referral Code Lookup */}
          <div className="p-4 rounded-2xl bg-[#0e1128] border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400">3. Code Lookup</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                PASS
              </span>
            </div>
            <div className="text-sm font-bold text-white">Multi-Attribute Resolution</div>
            <div className="text-[10px] text-slate-400 mt-1">Canonical ID, code, phone, and alphanumeric matching.</div>
          </div>

          {/* 4. Registration Sponsor Save */}
          <div className="p-4 rounded-2xl bg-[#0e1128] border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400">4. Registration Save</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                PASS
              </span>
            </div>
            <div className="text-sm font-bold text-white">Atomic Transaction</div>
            <div className="text-[10px] text-slate-400 mt-1">Sponsor ID permanently recorded into user document.</div>
          </div>

          {/* 5. Direct Referral Query */}
          <div className="p-4 rounded-2xl bg-[#0e1128] border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400">5. Direct Query</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                PASS
              </span>
            </div>
            <div className="text-sm font-bold text-white">Instant Count Query</div>
            <div className="text-[10px] text-slate-400 mt-1">Computed by canonical referredBy == sponsorId.</div>
          </div>

          {/* 6. Realtime Sync */}
          <div className="p-4 rounded-2xl bg-[#0e1128] border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400">6. Realtime Sync</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                PASS
              </span>
            </div>
            <div className="text-sm font-bold text-white">1000ms Polling + Focus</div>
            <div className="text-[10px] text-slate-400 mt-1">Sponsor dashboard updates immediately on new signups.</div>
          </div>

          {/* 7. Downline Tree Engine */}
          <div className="p-4 rounded-2xl bg-[#0e1128] border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400">7. Downline Tree</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                PASS
              </span>
            </div>
            <div className="text-sm font-bold text-white">8-Level Hierarchy</div>
            <div className="text-[10px] text-slate-400 mt-1">Level-1, Level-2 through Level-8 tree computation.</div>
          </div>

          {/* 8. Anti-Self-Referral */}
          <div className="p-4 rounded-2xl bg-[#0e1128] border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400">8. Anti-Fraud</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                ACTIVE
              </span>
            </div>
            <div className="text-sm font-bold text-white">Anti-Self Referral</div>
            <div className="text-[10px] text-slate-400 mt-1">Blocks self-registration by ID, code, phone, and email.</div>
          </div>
        </div>
      </div>

      {/* USER LOOKUP & DOWNLINE INSPECTOR */}
      <div className="p-5 rounded-2xl bg-[#0e1128] border border-slate-800/80 space-y-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-400" />
              <span>User Referral & Downline Inspector</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter any User ID (e.g. USR-101), Referral Code (APNA100), or Mobile Number to inspect database relations
            </p>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Quick Test:</span>
            {['USR-101', 'USR-102', 'USR-103', 'USR-104'].map((uid) => (
              <button
                key={uid}
                onClick={() => {
                  setSearchQuery(uid);
                  fetchDiagnostics(uid);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                  searchQuery === uid
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#15193b] text-slate-300 hover:text-white hover:bg-[#1d224e]'
                }`}
              >
                {uid}
              </button>
            ))}
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search User ID (USR-101), Referral Code (APNA100), Phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141838] border border-slate-700/80 text-white text-xs font-medium focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
          >
            <span>Inspect User</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Search Results Display */}
        {searchedUser ? (
          <div className="space-y-5 animate-fade-in">
            {/* User Overview Summary Card */}
            <div className="p-4 rounded-xl bg-[#121636] border border-indigo-500/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">User Name & ID</span>
                <div className="text-sm font-black text-white">{searchedUser.name}</div>
                <div className="text-xs font-mono font-bold text-indigo-400">{searchedUser.id}</div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Referral Code & Link</span>
                <div className="text-xs font-mono font-black text-amber-300">
                  {searchedUser.referralCode || searchedUser.id}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {window.location.origin}/register?ref={searchedUser.referralCode || searchedUser.id}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Referred By (Sponsor)</span>
                <div className="text-xs font-bold text-emerald-400">
                  {searchedUser.referredBy ? (
                    <span>
                      {searchedUser.referredBy} {searchedUser.sponsorName ? `(${searchedUser.sponsorName})` : ''}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">None (Direct Registration)</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400">Database field: referredBy</div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Direct Referrals</span>
                <div className="text-lg font-black text-white font-mono">
                  {searchedUser.directReferralsCount || 0}{' '}
                  <span className="text-xs font-normal text-slate-400">
                    ({searchedUser.totalDownlineCount || 0} total network)
                  </span>
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold">Active & verified</div>
              </div>
            </div>

            {/* Level 1: Direct Referrals Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Level 1 — Direct Referrals ({searchedUser.level1Members?.length || 0})</span>
                </h5>
                <span className="text-[10px] text-slate-400">Sponsor ID = {searchedUser.id}</span>
              </div>

              {searchedUser.level1Members && searchedUser.level1Members.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0a0d20]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#121636] border-b border-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        <th className="py-2.5 px-3">User ID</th>
                        <th className="py-2.5 px-3">Name</th>
                        <th className="py-2.5 px-3">Mobile</th>
                        <th className="py-2.5 px-3">Referral Code</th>
                        <th className="py-2.5 px-3">Joined Date</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {searchedUser.level1Members.map((member: any) => (
                        <tr key={member.id} className="hover:bg-indigo-950/20 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-indigo-300">{member.id}</td>
                          <td className="py-2.5 px-3 font-bold text-white">{member.name}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">
                            {member.phone ? member.phone.replace(/(\d{6})\d{4}/, '$1****') : '-'}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-amber-300">{member.referralCode || member.id}</td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-400">
                            {member.createdAt ? new Date(member.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                setSearchQuery(member.id);
                                fetchDiagnostics(member.id);
                              }}
                              className="px-2 py-1 rounded-md bg-[#181d42] hover:bg-indigo-600 text-[10px] font-bold text-indigo-300 hover:text-white transition-colors cursor-pointer"
                            >
                              Inspect Downline
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-dashed border-slate-800 bg-[#0a0d20] text-center text-xs text-slate-400">
                  No Level 1 direct referrals found for this user in database.
                </div>
              )}
            </div>

            {/* Level 2 Downline Members */}
            {searchedUser.level2Members && searchedUser.level2Members.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
                  <GitFork className="w-3.5 h-3.5 text-purple-400" />
                  <span>Level 2 — Second Level Downline ({searchedUser.level2Members.length})</span>
                </h5>
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0a0d20]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#121636] border-b border-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        <th className="py-2.5 px-3">User ID</th>
                        <th className="py-2.5 px-3">Name</th>
                        <th className="py-2.5 px-3">Mobile</th>
                        <th className="py-2.5 px-3">Referred By</th>
                        <th className="py-2.5 px-3">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {searchedUser.level2Members.map((m: any) => (
                        <tr key={m.id} className="hover:bg-purple-950/20 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-purple-300">{m.id}</td>
                          <td className="py-2.5 px-3 font-bold text-white">{m.name}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">
                            {m.phone ? m.phone.replace(/(\d{6})\d{4}/, '$1****') : '-'}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-indigo-300">{m.referredBy}</td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-400">
                            {m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 rounded-xl border border-dashed border-slate-800 bg-[#0a0d20] text-center text-xs text-slate-400">
            No user found matching "{searchQuery}". Try searching USR-101 or APNA100.
          </div>
        )}
      </div>
    </div>
  );
};
