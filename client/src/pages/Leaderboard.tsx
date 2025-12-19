import React, { useEffect, useState } from 'react'
import AuthGuard from '@/components/AuthGuard'
import './leaderboard.css'

// Prefer a runtime-injected backend URL (window.__BACKEND_URL__), then Vite env var.
const RUNTIME_BACKEND = (typeof window !== 'undefined' && (window as any).__BACKEND_URL__) || undefined
const BACKEND_BASE = RUNTIME_BACKEND || ((import.meta as any).env?.VITE_BACKEND_URL as string) || ''

function buildUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path
  const base = (BACKEND_BASE || '').replace(/\/+$/g, '')
  const p = path.replace(/^\/+/, '')
  return `${base}/${p}`
}

type Entry = {
  _id: string
  username: string
  avatar?: string
  display_name?: string
  xp: number
  level: number
}

export default function Leaderboard() {
  const [list, setList] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Leaderboard'
    let mounted = true
    setLoading(true)
    fetch(buildUrl('/api/leaderboard'))
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data: any) => {
        if (!mounted) return
        const entries = data?.leaderboardInfo?.leaderboardByXp || data?.leaderboard || []
        setList(entries)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message || 'Failed to load leaderboard')
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const vectors = [
    '/leaderboard-assets/vector4556-bf2l.svg',
    '/leaderboard-assets/vector4556-vgzt.svg',
    '/leaderboard-assets/vector4556-p8.svg',
    '/leaderboard-assets/vector4556-739.svg',
    '/leaderboard-assets/vector4556-xff.svg',
    '/leaderboard-assets/vector4556-2zei.svg',
  ]

  const medalAssets = {
    gold: '/leaderboard-assets/gold72x15852-yld-200w.png',
    silver: '/leaderboard-assets/silver72x15852-wqrf-200w.png',
    bronze: '/leaderboard-assets/bronze72x15852-hwq-200w.png',
  }

  if (loading)
    return (
      <AuthGuard>
        <div className="min-h-screen bg-black text-white overflow-auto p-6">
          <div className="max-w-4xl mx-auto text-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-white/60">Loading leaderboard...</p>
          </div>
        </div>
      </AuthGuard>
    )

  if (error)
    return (
      <AuthGuard>
        <div className="min-h-screen bg-black text-white overflow-auto p-6">
          <div className="max-w-4xl mx-auto text-center py-24">Error loading leaderboard: {error}</div>
        </div>
      </AuthGuard>
    )

  const topThree = [0, 1, 2].map((i) => list[i] || { _id: `pad-${i}`, username: '—', xp: 0, level: 1 })

  return (
    <AuthGuard>
      <div className="campaign-container1 min-h-screen bg-black text-white">
        <div className="campaign-thq-campaign-elm">
          <div className="campaign-thq-frame2147224486-elm">
            <span className="campaign-thq-text-elm10">Place</span>
            <span className="campaign-thq-text-elm11">Username</span>
            <img src="/leaderboard-assets/xpiconfill72x15673-5a3-200h.png" alt="XP" className="campaign-thq-xpiconfill72x1-elm1" />
          </div>

          <div className="campaign-thq-frame2147224504-elm1">
            {list.slice(0, 50).map((entry, idx) => {
              const vec = vectors[idx % vectors.length]
              return (
                <div key={entry._id || idx} className={`campaign-row thq-row-${idx}`}>
                  <div className="campaign-thq-frame2147224488-elm12">
                    <img src={vec} alt="v" className={`campaign-thq-vector-elm${idx % 30}`} />
                  </div>
                  <span className={`campaign-username`}>{entry.username || entry.display_name || 'Anonymous'}</span>
                  <span className={`campaign-xp`}>{entry.xp || 0}</span>
                </div>
              )
            })}
          </div>

          <div className="campaign-thq-group11-elm">
            <div className="campaign-thq-frame2147224480-elm">
              <div className="campaign-thq-group7-elm">
                <img src="/leaderboard-assets/rectangle400114554-49pb-200h.png" alt="rect" className="campaign-thq-rectangle40011-elm1" />
                <img src="/leaderboard-assets/rectangle400124554-3be9.svg" alt="rect" className="campaign-thq-rectangle40012-elm1" />
                <img src="/leaderboard-assets/line12894554-j15.svg" alt="line" className="campaign-thq-line1289-elm1" />
                <img src="/leaderboard-assets/rectangle400134554-uyxg-200h.png" alt="rect" className="campaign-thq-rectangle40013-elm" />
              </div>
              <span className="campaign-thq-text-elm61">2nd</span>
              <div className="campaign-thq-frame2147224552-elm">
                <img src={medalAssets.silver} alt="silver" className="campaign-thq-silver72x1-elm" />
                <div className="campaign-thq-frame2147224551-elm1">
                  <span className="campaign-thq-text-elm62">{topThree[1].xp || 0}</span>
                  <img src="/leaderboard-assets/xpiconfill72x15676-du9f-200h.png" alt="xp" className="campaign-thq-xpiconfill72x1-elm2" />
                </div>
              </div>
            </div>

            <div className="campaign-thq-frame2147224484-elm">
              <div className="campaign-thq-frame2147224474-elm"></div>
              <span className="campaign-thq-text-elm63">{topThree[0].username || '—'}</span>
            </div>

            <div className="campaign-thq-frame2147224485-elm">
              <div className="campaign-thq-frame2147224476-elm"></div>
              <span className="campaign-thq-text-elm64">{topThree[0].username || '—'}</span>
            </div>

            <div className="campaign-thq-frame2147224483-elm">
              <div className="campaign-thq-frame2147224475-elm"></div>
              <span className="campaign-thq-text-elm65">{topThree[2].username || '—'}</span>
            </div>

            <div className="campaign-thq-frame2147224481-elm">
              <div className="campaign-thq-group8-elm">
                <img src="/leaderboard-assets/rectangle400114554-ng2-200h.png" alt="rect" className="campaign-thq-rectangle40011-elm2" />
                <img src="/leaderboard-assets/rectangle400124554-z7h.svg" alt="rect" className="campaign-thq-rectangle40012-elm2" />
                <img src="/leaderboard-assets/line12894554-kavq.svg" alt="line" className="campaign-thq-line1289-elm2" />
                <img src="/leaderboard-assets/rectangle400144554-l83-200h.png" alt="rect" className="campaign-thq-rectangle40014-elm" />
              </div>
              <span className="campaign-thq-text-elm66">1st</span>
              <div className="campaign-thq-frame2147224553-elm">
                <img src={medalAssets.gold} alt="gold" className="campaign-thq-gold72x1-elm" />
                <div className="campaign-thq-frame2147224551-elm2">
                  <span className="campaign-thq-text-elm67">{topThree[0].xp || 0}</span>
                  <img src="/leaderboard-assets/xpiconfill72x15675-jtq-200h.png" alt="xp" className="campaign-thq-xpiconfill72x1-elm3" />
                </div>
              </div>
            </div>

            <div className="campaign-thq-frame2147224482-elm">
              <div className="campaign-thq-group9-elm">
                <img src="/leaderboard-assets/rectangle400114554-xm5-200h.png" alt="rect" className="campaign-thq-rectangle40011-elm3" />
                <img src="/leaderboard-assets/rectangle400124554-0jvr.svg" alt="rect" className="campaign-thq-rectangle40012-elm3" />
                <img src="/leaderboard-assets/line12894554-c4wb.svg" alt="line" className="campaign-thq-line1289-elm3" />
                <img src="/leaderboard-assets/rectangle400154554-fnq7-300w.png" alt="rect" className="campaign-thq-rectangle40015-elm" />
              </div>
              <span className="campaign-thq-text-elm68">3rd</span>
              <div className="campaign-thq-frame2147224554-elm">
                <img src={medalAssets.bronze} alt="bronze" className="campaign-thq-bronze72x1-elm" />
                <div className="campaign-thq-frame2147224551-elm3">
                  <span className="campaign-thq-text-elm69">{topThree[2].xp || 0}</span>
                  <img src="/leaderboard-assets/xpiconfill72x15675-zs5c-200h.png" alt="xp" className="campaign-thq-xpiconfill72x1-elm4" />
                </div>
              </div>
            </div>
          </div>

          <span className="campaign-thq-text-elm70">Top Performers</span>

          <div className="campaign-thq-frame2147224493-elm">
            <div className="campaign-thq-frame2147224488-elm28">
              <img src="/leaderboard-assets/vector5261-vi5.svg" alt="v" className="campaign-thq-vector-elm28" />
              <span className="campaign-thq-text-elm71">{list.length}</span>
            </div>
            <span className="campaign-thq-text-elm72">
              <span>{list[0]?.username || '—'}</span>
              <br />
              <span>Your Ranking</span>
            </span>
            <span className="campaign-thq-text-elm75">{list[0]?.xp || 0}</span>
          </div>

          <div className="campaign-thq-dashboard-nav-bar-elm">
            <img src="/leaderboard-assets/image114553-k1v-200h.png" alt="image" className="campaign-thq-image11-elm" />
            <div className="campaign-thq-frame2147224393-elm">
              <div className="campaign-thq-frame2147224386-elm">
                <div className="campaign-thq-frame2147224342-elm">
                  <img src="/leaderboard-assets/vector4553-yxem.svg" alt="v" className="campaign-thq-vector-elm29" />
                  <span className="campaign-thq-text-elm76">Learn</span>
                </div>
              </div>
              <div className="campaign-thq-frame2147224387-elm">
                <div className="campaign-thq-frame2147224343-elm">
                  <img src="/leaderboard-assets/vector4553-s4wo.svg" alt="v" className="campaign-thq-vector-elm30" />
                  <span className="campaign-thq-text-elm77">Explore</span>
                </div>
              </div>
              <div className="campaign-thq-frame2147224388-elm">
                <div className="campaign-thq-frame2147224344-elm">
                  <img src="/leaderboard-assets/vector4554-ywr.svg" alt="v" className="campaign-thq-vector-elm31" />
                  <span className="campaign-thq-text-elm78">Referrals</span>
                </div>
              </div>
              <div className="campaign-thq-frame2147224389-elm">
                <div className="campaign-thq-frame2147224345-elm">
                  <img src="/leaderboard-assets/vector4554-qbi.svg" alt="v" className="campaign-thq-vector-elm32" />
                  <span className="campaign-thq-text-elm79">Quests</span>
                </div>
              </div>
              <div className="campaign-thq-learn-elm">
                <div className="campaign-thq-frame2147224346-elm">
                  <img src="/leaderboard-assets/vector4554-fbh.svg" alt="v" className="campaign-thq-vector-elm33" />
                  <span className="campaign-thq-text-elm80">Campaign</span>
                </div>
              </div>
              <div className="campaign-thq-frame2147224390-elm">
                <div className="campaign-thq-frame2147224347-elm">
                  <img src="/leaderboard-assets/vector4554-asf.svg" alt="v" className="campaign-thq-vector-elm34" />
                  <span className="campaign-thq-text-elm81">Ecosystem Dapps</span>
                </div>
              </div>
              <div className="campaign-thq-frame2147224391-elm">
                <div className="campaign-thq-frame2147224348-elm">
                  <img src="/leaderboard-assets/vector4554-hs6.svg" alt="v" className="campaign-thq-vector-elm35" />
                  <span className="campaign-thq-text-elm82">Trade</span>
                </div>
              </div>
              <div className="campaign-thq-frame2147224392-elm">
                <div className="campaign-thq-frame2147224349-elm">
                  <img src="/leaderboard-assets/vector4554-efb8.svg" alt="v" className="campaign-thq-vector-elm36" />
                  <span className="campaign-thq-text-elm83">Leaderboard</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a href="https://play.teleporthq.io/signup" className="campaign-link">
          <div aria-label="Sign up to TeleportHQ" className="campaign-container2">
            <svg width="24" height="24" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="campaign-icon1">
              <path d="M9.1017 4.64355H2.17867C0.711684 4.64355 -0.477539 5.79975 -0.477539 7.22599V13.9567C-0.477539 15.3829 0.711684 16.5391 2.17867 16.5391H9.1017C10.5687 16.5391 11.7579 15.3829 11.7579 13.9567V7.22599C11.7579 5.79975 10.5687 4.64355 9.1017 4.64355Z" fill="#B23ADE"></path>
              <path d="M10.9733 12.7878C14.4208 12.7878 17.2156 10.0706 17.2156 6.71886C17.2156 3.3671 14.4208 0.649963 10.9733 0.649963C7.52573 0.649963 4.73096 3.3671 4.73096 6.71886C4.73096 10.0706 7.52573 12.7878 10.9733 12.7878Z" fill="#FF5C5C"></path>
              <path d="M17.7373 13.3654C19.1497 14.1588 19.1497 15.4634 17.7373 16.2493L10.0865 20.5387C8.67402 21.332 7.51855 20.6836 7.51855 19.0968V10.5141C7.51855 8.92916 8.67402 8.2807 10.0865 9.07221L17.7373 13.3654Z" fill="#2874DE"></path>
            </svg>
            <span className="campaign-text2">Built in TeleportHQ</span>
          </div>
        </a>
      </div>
    </AuthGuard>
  )
}
import React, { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import AnimatedBackground from "@/components/AnimatedBackground";
import './leaderboard.css';

// Prefer a runtime-injected backend URL (window.__BACKEND_URL__), then Vite env var.
// Do not default to localhost here — if no backend is configured the app will
// make relative requests to the current origin.
const RUNTIME_BACKEND = (typeof window !== 'undefined' && (window as any).__BACKEND_URL__) || undefined;
const BACKEND_BASE = RUNTIME_BACKEND || ((import.meta as any).env?.VITE_BACKEND_URL as string) || "";

function buildUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  const base = (BACKEND_BASE || "").replace(/\/+$/g, "");
  const p = path.replace(/^\/+/, "");
  return `${base}/${p}`;
}

type Entry = {
  _id: string;
  username: string;
  avatar?: string;
  display_name?: string;
  address?: string;
  xp: number;
  level: number;
  questsCompleted?: number;
  campaignsCompleted?: number;
};

export default function Leaderboard() {
  const [list, setList] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(buildUrl("/api/leaderboard"))
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: any) => {
        if (!mounted) return;
        // Data is already sorted by XP from backend
        setList(data.leaderboardInfo.leaderboardByXp);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to load leaderboard");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">Leaderboard</h1>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-white/60">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
  
  if (error) return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">Leaderboard</h1>
          <div className="p-6 text-center text-white/60">Error loading leaderboard: {error}</div>
        </div>
      </div>
    </AuthGuard>
  );
  
  if (!list || list.length === 0) return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">Leaderboard</h1>
          <div className="p-6 text-center text-white/60">No leaderboard data yet. Complete quests to get on the board!</div>
        </div>
      </div>
    </AuthGuard>
  );

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white overflow-auto p-6 relative">
        <AnimatedBackground />
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">Leaderboard</h1>
            <Badge variant="outline" className="text-sm border-white/20 text-white">{list.length} Players</Badge>
          </div>
          
          <div className="space-y-3">
            {list.map((entry, idx) => {
              import React, { useEffect, useState } from 'react'
              import AuthGuard from '@/components/AuthGuard'
              import './leaderboard.css'

              // Keep using the runtime backend pattern from the project
              const RUNTIME_BACKEND = (typeof window !== 'undefined' && (window as any).__BACKEND_URL__) || undefined
              const BACKEND_BASE = RUNTIME_BACKEND || ((import.meta as any).env?.VITE_BACKEND_URL as string) || ''

              function buildUrl(path: string) {
                if (/^https?:\/\//i.test(path)) return path
                const base = (BACKEND_BASE || '').replace(/\/+$/g, '')
                const p = path.replace(/^\/+/, '')
                return `${base}/${p}`
              }

              type Entry = {
                _id: string
                username: string
                avatar?: string
                display_name?: string
                xp: number
                level: number
              }

              export default function Leaderboard() {
                const [list, setList] = useState<Entry[]>([])
                const [loading, setLoading] = useState(true)
                const [error, setError] = useState<string | null>(null)

                useEffect(() => {
                  document.title = 'Leaderboard'
                  let mounted = true
                  setLoading(true)
                  fetch(buildUrl('/api/leaderboard'))
                    .then((r) => {
                      if (!r.ok) throw new Error(`HTTP ${r.status}`)
                      return r.json()
                    })
                    .then((data: any) => {
                      if (!mounted) return
                      // backend returns leaderboardInfo.leaderboardByXp in upstream
                      const entries = data?.leaderboardInfo?.leaderboardByXp || data?.leaderboard || []
                      setList(entries)
                    })
                    .catch((err) => {
                      if (!mounted) return
                      setError(err.message || 'Failed to load leaderboard')
                    })
                    .finally(() => {
                      if (!mounted) return
                      setLoading(false)
                    })
                  return () => {
                    mounted = false
                  }
                }, [])

                const vectors = [
                  '/leaderboard-assets/vector4556-bf2l.svg',
                  '/leaderboard-assets/vector4556-vgzt.svg',
                  '/leaderboard-assets/vector4556-p8.svg',
                  '/leaderboard-assets/vector4556-739.svg',
                  '/leaderboard-assets/vector4556-xff.svg',
                  '/leaderboard-assets/vector4556-2zei.svg',
                ]

                const medalAssets = {
                  gold: '/leaderboard-assets/gold72x15852-yld-200w.png',
                  silver: '/leaderboard-assets/silver72x15852-wqrf-200w.png',
                  bronze: '/leaderboard-assets/bronze72x15852-hwq-200w.png',
                }

                if (loading)
                  return (
                    <AuthGuard>
                      <div className="min-h-screen bg-black text-white overflow-auto p-6">
                        <div className="max-w-4xl mx-auto text-center py-24">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                          <p className="text-white/60">Loading leaderboard...</p>
                        </div>
                      </div>
                    </AuthGuard>
                  )

                if (error)
                  return (
                    <AuthGuard>
                      <div className="min-h-screen bg-black text-white overflow-auto p-6">
                        <div className="max-w-4xl mx-auto text-center py-24">Error loading leaderboard: {error}</div>
                      </div>
                    </AuthGuard>
                  )

                // build top performers (pad if needed)
                const topThree = [0, 1, 2].map((i) => list[i] || { _id: `pad-${i}`, username: i === 0 ? '---' : '---', xp: 0, level: 1 })
                const rest = list.slice(3)

                return (
                  <AuthGuard>
                    <div className="campaign-container1 min-h-screen bg-black text-white">
                      <div className="campaign-thq-campaign-elm">
                        {/* Header row: Place / Username / XP icon */}
                        <div className="campaign-thq-frame2147224486-elm">
                          <span className="campaign-thq-text-elm10">Place</span>
                          <span className="campaign-thq-text-elm11">Username</span>
                          <img src="/leaderboard-assets/xpiconfill72x15673-5a3-200h.png" alt="XP" className="campaign-thq-xpiconfill72x1-elm1" />
                        </div>

                        {/* Top list preview (first 21 rows in the TeleportHQ export) */}
                        <div className="campaign-thq-frame2147224504-elm1">
                          {/* Render rest of the board dynamically (limit 50) */}
                          {list.slice(0, 50).map((entry, idx) => {
                            const vec = vectors[idx % vectors.length]
                            return (
                              <div key={entry._id || idx} className={`campaign-thq-frame2147224488-elm${idx + 10}`}>
                                <div className="campaign-thq-frame2147224488-elm12">
                                  <img src={vec} alt="v" className={`campaign-thq-vector-elm${idx % 30}`} />
                                </div>
                                <span className={`campaign-thq-text-elm${12 + (idx % 70)}`}>{entry.username || entry.display_name || 'Anonymous'}</span>
                                <span className={`campaign-thq-text-elm${13 + (idx % 70)}`}>{entry.xp || 0}</span>
                              </div>
                            )
                          })}
                        </div>

                        {/* Top performers spotlight */}
                        <div className="campaign-thq-group11-elm">
                          {/* 2nd */}
                          <div className="campaign-thq-frame2147224480-elm">
                            <div className="campaign-thq-group7-elm">
                              <img src="/leaderboard-assets/rectangle400114554-49pb-200h.png" alt="rect" className="campaign-thq-rectangle40011-elm1" />
                              <img src="/leaderboard-assets/rectangle400124554-3be9.svg" alt="rect" className="campaign-thq-rectangle40012-elm1" />
                              <img src="/leaderboard-assets/line12894554-j15.svg" alt="line" className="campaign-thq-line1289-elm1" />
                              <img src="/leaderboard-assets/rectangle400134554-uyxg-200h.png" alt="rect" className="campaign-thq-rectangle40013-elm" />
                            </div>
                            <span className="campaign-thq-text-elm61">2nd</span>
                            <div className="campaign-thq-frame2147224552-elm">
                              <img src={medalAssets.silver} alt="silver" className="campaign-thq-silver72x1-elm" />
                              <div className="campaign-thq-frame2147224551-elm1">
                                <span className="campaign-thq-text-elm62">{topThree[1].xp || 0}</span>
                                <img src="/leaderboard-assets/xpiconfill72x15676-du9f-200h.png" alt="xp" className="campaign-thq-xpiconfill72x1-elm2" />
                              </div>
                            </div>
                          </div>

                          {/* center big card (1st) */}
                          <div className="campaign-thq-frame2147224484-elm">
                            <div className="campaign-thq-frame2147224474-elm"></div>
                            <span className="campaign-thq-text-elm63">{topThree[0].username || '—'}</span>
                          </div>

                          <div className="campaign-thq-frame2147224485-elm">
                            <div className="campaign-thq-frame2147224476-elm"></div>
                            <span className="campaign-thq-text-elm64">{topThree[0].username || '—'}</span>
                          </div>

                          <div className="campaign-thq-frame2147224483-elm">
                            <div className="campaign-thq-frame2147224475-elm"></div>
                            <span className="campaign-thq-text-elm65">{topThree[2].username || '—'}</span>
                          </div>

                          {/* 1st */}
                          <div className="campaign-thq-frame2147224481-elm">
                            <div className="campaign-thq-group8-elm">
                              <img src="/leaderboard-assets/rectangle400114554-ng2-200h.png" alt="rect" className="campaign-thq-rectangle40011-elm2" />
                              <img src="/leaderboard-assets/rectangle400124554-z7h.svg" alt="rect" className="campaign-thq-rectangle40012-elm2" />
                              <img src="/leaderboard-assets/line12894554-kavq.svg" alt="line" className="campaign-thq-line1289-elm2" />
                              <img src="/leaderboard-assets/rectangle400144554-l83-200h.png" alt="rect" className="campaign-thq-rectangle40014-elm" />
                            </div>
                            <span className="campaign-thq-text-elm66">1st</span>
                            <div className="campaign-thq-frame2147224553-elm">
                              <img src={medalAssets.gold} alt="gold" className="campaign-thq-gold72x1-elm" />
                              <div className="campaign-thq-frame2147224551-elm2">
                                <span className="campaign-thq-text-elm67">{topThree[0].xp || 0}</span>
                                <img src="/leaderboard-assets/xpiconfill72x15675-jtq-200h.png" alt="xp" className="campaign-thq-xpiconfill72x1-elm3" />
                              </div>
                            </div>
                          </div>

                          {/* 3rd */}
                          <div className="campaign-thq-frame2147224482-elm">
                            <div className="campaign-thq-group9-elm">
                              <img src="/leaderboard-assets/rectangle400114554-xm5-200h.png" alt="rect" className="campaign-thq-rectangle40011-elm3" />
                              <img src="/leaderboard-assets/rectangle400124554-0jvr.svg" alt="rect" className="campaign-thq-rectangle40012-elm3" />
                              <img src="/leaderboard-assets/line12894554-c4wb.svg" alt="line" className="campaign-thq-line1289-elm3" />
                              <img src="/leaderboard-assets/rectangle400154554-fnq7-300w.png" alt="rect" className="campaign-thq-rectangle40015-elm" />
                            </div>
                            <span className="campaign-thq-text-elm68">3rd</span>
                            <div className="campaign-thq-frame2147224554-elm">
                              <img src={medalAssets.bronze} alt="bronze" className="campaign-thq-bronze72x1-elm" />
                              <div className="campaign-thq-frame2147224551-elm3">
                                <span className="campaign-thq-text-elm69">{topThree[2].xp || 0}</span>
                                <img src="/leaderboard-assets/xpiconfill72x15675-zs5c-200h.png" alt="xp" className="campaign-thq-xpiconfill72x1-elm4" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <span className="campaign-thq-text-elm70">Top Performers</span>

                        <div className="campaign-thq-frame2147224493-elm">
                          <div className="campaign-thq-frame2147224488-elm28">
                            <img src="/leaderboard-assets/vector5261-vi5.svg" alt="v" className="campaign-thq-vector-elm28" />
                            <span className="campaign-thq-text-elm71">{list.length}</span>
                          </div>
                          <span className="campaign-thq-text-elm72">
                            <span>{list[0]?.username || '—'}</span>
                            <br />
                            <span>Your Ranking</span>
                          </span>
                          <span className="campaign-thq-text-elm75">{list[0]?.xp || 0}</span>
                        </div>

                        <div className="campaign-thq-dashboard-nav-bar-elm">
                          <img src="/leaderboard-assets/image114553-k1v-200h.png" alt="image" className="campaign-thq-image11-elm" />
                          <div className="campaign-thq-frame2147224393-elm">
                            {/* Nav items left as static visuals from export */}
                            <div className="campaign-thq-frame2147224386-elm">
                              <div className="campaign-thq-frame2147224342-elm">
                                <img src="/leaderboard-assets/vector4553-yxem.svg" alt="v" className="campaign-thq-vector-elm29" />
                                <span className="campaign-thq-text-elm76">Learn</span>
                              </div>
                            </div>
                            <div className="campaign-thq-frame2147224387-elm">
                              <div className="campaign-thq-frame2147224343-elm">
                                <img src="/leaderboard-assets/vector4553-s4wo.svg" alt="v" className="campaign-thq-vector-elm30" />
                                <span className="campaign-thq-text-elm77">Explore</span>
                              </div>
                            </div>
                            <div className="campaign-thq-frame2147224388-elm">
                              <div className="campaign-thq-frame2147224344-elm">
                                <img src="/leaderboard-assets/vector4554-ywr.svg" alt="v" className="campaign-thq-vector-elm31" />
                                <span className="campaign-thq-text-elm78">Referrals</span>
                              </div>
                            </div>
                            <div className="campaign-thq-frame2147224389-elm">
                              <div className="campaign-thq-frame2147224345-elm">
                                <img src="/leaderboard-assets/vector4554-qbi.svg" alt="v" className="campaign-thq-vector-elm32" />
                                <span className="campaign-thq-text-elm79">Quests</span>
                              </div>
                            </div>
                            <div className="campaign-thq-learn-elm">
                              <div className="campaign-thq-frame2147224346-elm">
                                <img src="/leaderboard-assets/vector4554-fbh.svg" alt="v" className="campaign-thq-vector-elm33" />
                                <span className="campaign-thq-text-elm80">Campaign</span>
                              </div>
                            </div>
                            <div className="campaign-thq-frame2147224390-elm">
                              <div className="campaign-thq-frame2147224347-elm">
                                <img src="/leaderboard-assets/vector4554-asf.svg" alt="v" className="campaign-thq-vector-elm34" />
                                <span className="campaign-thq-text-elm81">Ecosystem Dapps</span>
                              </div>
                            </div>
                            <div className="campaign-thq-frame2147224391-elm">
                              <div className="campaign-thq-frame2147224348-elm">
                                <img src="/leaderboard-assets/vector4554-hs6.svg" alt="v" className="campaign-thq-vector-elm35" />
                                <span className="campaign-thq-text-elm82">Trade</span>
                              </div>
                            </div>
                            <div className="campaign-thq-frame2147224392-elm">
                              <div className="campaign-thq-frame2147224349-elm">
                                <img src="/leaderboard-assets/vector4554-efb8.svg" alt="v" className="campaign-thq-vector-elm36" />
                                <span className="campaign-thq-text-elm83">Leaderboard</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <a href="https://play.teleporthq.io/signup" className="campaign-link">
                        <div aria-label="Sign up to TeleportHQ" className="campaign-container2">
                          <svg width="24" height="24" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="campaign-icon1">
                            <path d="M9.1017 4.64355H2.17867C0.711684 4.64355 -0.477539 5.79975 -0.477539 7.22599V13.9567C-0.477539 15.3829 0.711684 16.5391 2.17867 16.5391H9.1017C10.5687 16.5391 11.7579 15.3829 11.7579 13.9567V7.22599C11.7579 5.79975 10.5687 4.64355 9.1017 4.64355Z" fill="#B23ADE"></path>
                            <path d="M10.9733 12.7878C14.4208 12.7878 17.2156 10.0706 17.2156 6.71886C17.2156 3.3671 14.4208 0.649963 10.9733 0.649963C7.52573 0.649963 4.73096 3.3671 4.73096 6.71886C4.73096 10.0706 7.52573 12.7878 10.9733 12.7878Z" fill="#FF5C5C"></path>
                            <path d="M17.7373 13.3654C19.1497 14.1588 19.1497 15.4634 17.7373 16.2493L10.0865 20.5387C8.67402 21.332 7.51855 20.6836 7.51855 19.0968V10.5141C7.51855 8.92916 8.67402 8.2807 10.0865 9.07221L17.7373 13.3654Z" fill="#2874DE"></path>
                          </svg>
                          <span className="campaign-text2">Built in TeleportHQ</span>
                        </div>
                      </a>
                    </div>
                  </AuthGuard>
                )
              }
