'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Submission, SubmissionStatus, HistoryEntry } from '@/lib/submissions';

// ─── Constants ────────────────────────────────────────────────────────────────

const SERVICES = [
  'Marine Warranty Survey', 'Rig Positioning & Moving', 'Cargo & Damage Survey',
  'Marine Casualties', 'Project Management', 'Technical Due Diligence',
  'eCMID Audits', 'Dispute & Litigation Support', 'Offshore Survey',
  'Hull & Machinery Survey', 'Other',
];

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  open:        'Open',
  in_progress: 'In Progress',
  closed:      'Closed',
};

const STATUS_COLORS: Record<SubmissionStatus, { bg: string; color: string }> = {
  open:        { bg: '#FFF3E0', color: '#E65100' },
  in_progress: { bg: '#FFF9C4', color: '#827717' },
  closed:      { bg: '#E8F5E9', color: '#1B5E20' },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrendPoint { date: string; count: number }

interface MetricsData {
  total: number; open: number; in_progress: number;
  closed: number; thisWeek: number; last30: number;
  trend: TrendPoint[];
}

interface EnquiriesResponse {
  submissions: Submission[];
  total: number; page: number; pages: number;
}

interface Filters {
  status: string; service: string; search: string;
  sort: string; from: string; to: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function fmtDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ─── Chart: Donut ─────────────────────────────────────────────────────────────

function DonutChart({ metrics }: { metrics: MetricsData }) {
  const { open, in_progress, closed, total } = metrics;
  if (total === 0) {
    return <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>No data yet</p>;
  }

  const segments = [
    { value: open,        color: '#E65100', label: 'Open' },
    { value: in_progress, color: '#F9A825', label: 'In Progress' },
    { value: closed,      color: '#2E7D32', label: 'Closed' },
  ].filter((s) => s.value > 0);

  const cx = 64, cy = 64, r = 52, ir = 32;
  let angle = -Math.PI / 2;

  const paths = segments.map(({ value, color }) => {
    const sweep = (value / total) * Math.PI * 2;
    const ea    = angle + sweep;
    const la    = sweep > Math.PI ? 1 : 0;
    const x1 = cx + r  * Math.cos(angle), y1 = cy + r  * Math.sin(angle);
    const x2 = cx + r  * Math.cos(ea),    y2 = cy + r  * Math.sin(ea);
    const i1 = cx + ir * Math.cos(angle), j1 = cy + ir * Math.sin(angle);
    const i2 = cx + ir * Math.cos(ea),    j2 = cy + ir * Math.sin(ea);
    const d  = `M${x1},${y1} A${r},${r} 0 ${la},1 ${x2},${y2} L${i2},${j2} A${ir},${ir} 0 ${la},0 ${i1},${j1}Z`;
    angle = ea;
    return <path key={color} d={d} fill={color} />;
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <svg viewBox="0 0 128 128" width={128} height={128} style={{ flexShrink: 0 }}>
        {paths}
        <text x="64" y="61" textAnchor="middle" fontSize="20" fontWeight="800" fill="#0B2545">{total}</text>
        <text x="64" y="76" textAnchor="middle" fontSize="10" fill="#9ca3af">total</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {[
          { label: 'Open',        value: open,        color: '#E65100' },
          { label: 'In Progress', value: in_progress, color: '#F9A825' },
          { label: 'Closed',      value: closed,      color: '#2E7D32' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <span style={{ width: 9, height: 9, borderRadius: 2, background: color, flexShrink: 0 }} />
            <span style={{ color: '#374151', minWidth: 82 }}>{label}</span>
            <span style={{ fontWeight: 700, color: '#0B2545', minWidth: 24, textAlign: 'right' }}>{value}</span>
            <span style={{ color: '#9ca3af', fontSize: 11 }}>
              {total > 0 ? Math.round((value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Chart: Bar (30-day trend) ────────────────────────────────────────────────

function BarChart({ trend }: { trend: TrendPoint[] }) {
  if (!trend.length) return null;

  const max    = Math.max(...trend.map((d) => d.count), 1);
  const W      = 340;
  const H      = 80;
  const n      = trend.length;
  const barW   = Math.max(1, Math.floor((W - (n - 1)) / n));
  const gap    = 1;

  return (
    <svg
      viewBox={`0 0 ${W} ${H + 18}`}
      width="100%"
      height={H + 18}
      style={{ display: 'block' }}
      aria-label="30-day enquiry trend chart"
    >
      {trend.map(({ date, count }, i) => {
        const barH = count === 0 ? 2 : Math.max(4, (count / max) * H);
        const x    = i * (barW + gap);
        const y    = H - barH;
        const showLabel = i === 0 || i === Math.floor(n / 2) || i === n - 1;
        return (
          <g key={date}>
            <rect
              x={x} y={y} width={barW} height={barH}
              fill={count === 0 ? '#e2e8f0' : '#1CA7A6'}
              rx={2}
            />
            {showLabel && (
              <text
                x={x + barW / 2} y={H + 14}
                textAnchor="middle" fontSize={9} fill="#9ca3af"
              >
                {date.slice(5)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 10, padding: '14px 16px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderTop: `3px solid ${color}`,
    }}>
      <p style={{ margin: '0 0 3px', fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0B2545' }}>{value}</p>
    </div>
  );
}

// ─── Status Badge (dropdown) ──────────────────────────────────────────────────

function StatusBadge({ status, onChange }: { status: SubmissionStatus; onChange: (s: SubmissionStatus) => void }) {
  const { bg, color } = STATUS_COLORS[status];
  const [open, setOpen]   = useState(false);
  const [pos,  setPos]    = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleToggle() {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.left });
    }
    setOpen((o) => !o);
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        ref={btnRef}
        onClick={handleToggle}
        style={{
          background: bg, color, border: 'none', borderRadius: 20,
          padding: '3px 10px', fontSize: 12, fontWeight: 700,
          cursor: 'pointer', whiteSpace: 'nowrap',
        }}
      >
        {STATUS_LABELS[status]} ▾
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 200 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'fixed', top: pos.top, left: pos.left, zIndex: 201,
            background: '#fff', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            border: '1px solid #e2e8f0', minWidth: 130, overflow: 'hidden',
          }}>
            {(Object.keys(STATUS_LABELS) as SubmissionStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => { onChange(s); setOpen(false); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '8px 14px', border: 'none', cursor: 'pointer', fontSize: 13,
                  background: s === status ? '#F0F4F8' : '#fff',
                  color: STATUS_COLORS[s].color, fontWeight: s === status ? 700 : 400,
                }}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── History Popover (inline in table row) ────────────────────────────────────

function HistoryPopover({ history }: { history: HistoryEntry[] }) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleToggle() {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      // Try to open to the left so it doesn't fall off-screen
      setPos({ top: r.bottom + 4, left: Math.max(8, r.right - 280) });
    }
    setOpen((o) => !o);
  }

  const count = history.length;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        ref={btnRef}
        onClick={handleToggle}
        title="View status history"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: count > 0 ? '#EFF6FF' : '#F8FAFC',
          color: count > 0 ? '#1E5A8A' : '#9ca3af',
          border: `1px solid ${count > 0 ? '#BFDBFE' : '#e2e8f0'}`,
          borderRadius: 6, padding: '3px 8px',
          fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
        }}
      >
        {/* Clock icon (SVG) */}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        {count > 0 ? count : '—'}
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 200 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'fixed', top: pos.top, left: pos.left, zIndex: 201,
            background: '#fff', borderRadius: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,0.14)', border: '1px solid #e2e8f0',
            width: 280, maxHeight: 320, overflowY: 'auto',
          }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Status History
              </span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{count} change{count !== 1 ? 's' : ''}</span>
            </div>

            {count === 0 ? (
              <div style={{ padding: '18px 14px', textAlign: 'center', color: '#9ca3af', fontSize: 12 }}>
                No changes recorded yet.
              </div>
            ) : (
              <div style={{ padding: '8px 14px' }}>
                {[...history].reverse().map((entry, i) => {
                  const { bg, color } = STATUS_COLORS[entry.status];
                  return (
                    <div key={i} style={{
                      padding: '8px 0',
                      borderBottom: i < history.length - 1 ? '1px solid #f8fafc' : 'none',
                    }}>
                      {/* Status badge */}
                      <span style={{
                        display: 'inline-block', background: bg, color,
                        borderRadius: 10, padding: '2px 8px',
                        fontSize: 11, fontWeight: 700, marginBottom: 4,
                      }}>
                        {STATUS_LABELS[entry.status]}
                      </span>
                      {/* Admin + timestamp */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{
                          background: '#F0F4F8', color: '#1E5A8A',
                          borderRadius: 4, padding: '1px 6px',
                          fontSize: 11, fontWeight: 700, fontFamily: 'monospace',
                        }}>
                          {entry.adminId}
                        </span>
                        <span style={{ fontSize: 11, color: '#9ca3af' }}>
                          {fmtDate(entry.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Detail Panel (with Details / History tabs) ───────────────────────────────

function DetailPanel({ submission, onClose, onStatusChange }: {
  submission: Submission;
  onClose: () => void;
  onStatusChange: (id: string, status: SubmissionStatus) => void;
}) {
  const [tab, setTab] = useState<'details' | 'history'>('details');

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 100 }}
        onClick={onClose}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 480, maxWidth: '95vw',
        background: '#fff', zIndex: 101, overflowY: 'auto',
        boxShadow: '-4px 0 40px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column',
      }}>
        {/* Panel header */}
        <div style={{ background: '#0B2545', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <p style={{ margin: 0, color: '#1CA7A6', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Enquiry Details
            </p>
            <p style={{ margin: '2px 0 0', color: '#fff', fontSize: 13, fontFamily: 'monospace' }}>
              {submission.id.slice(0, 18)}…
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', fontSize: 18 }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
          {(['details', 'history'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '11px 0', border: 'none', background: 'none',
                cursor: 'pointer', fontSize: 13,
                fontWeight: tab === t ? 700 : 400,
                color: tab === t ? '#0B2545' : '#6b7280',
                borderBottom: tab === t ? '2px solid #1CA7A6' : '2px solid transparent',
              }}
            >
              {t === 'details' ? 'Details' : `History (${(submission.history ?? []).length})`}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: 24, flex: 1, overflowY: 'auto' }}>
          {tab === 'details' ? (
            <>
              {/* Status */}
              <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>Status:</span>
                <StatusBadge
                  status={submission.status}
                  onChange={(s) => onStatusChange(submission.id, s)}
                />
              </div>

              {/* Key fields */}
              {[
                { label: 'Name',      value: submission.name },
                { label: 'Company',   value: submission.company || '—' },
                { label: 'Email',     value: submission.email,  href: `mailto:${submission.email}` },
                { label: 'Phone',     value: submission.phone || '—', href: submission.phone ? `tel:${submission.phone.replace(/\s/g, '')}` : undefined },
                { label: 'Location',  value: submission.location || '—' },
                { label: 'Service',   value: submission.service || '—' },
                { label: 'Source',    value: submission.source },
                { label: 'Submitted', value: fmtDate(submission.timestamp) },
                { label: 'Updated',   value: fmtDate(submission.updatedAt) },
                { label: 'IP',        value: submission.ip },
              ].map(({ label, value, href }) => (
                <div key={label} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                  <span style={{ minWidth: 80, fontSize: 12, color: '#9ca3af', fontWeight: 600, paddingTop: 1 }}>{label}</span>
                  {href
                    ? <a href={href} style={{ fontSize: 14, color: '#1E5A8A', wordBreak: 'break-all' }}>{value}</a>
                    : <span style={{ fontSize: 14, color: '#1f2937', wordBreak: 'break-all' }}>{value}</span>
                  }
                </div>
              ))}

              {/* Message */}
              <div style={{ marginTop: 8 }}>
                <p style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, marginBottom: 8 }}>MESSAGE</p>
                <div style={{
                  background: '#F8FAFC', border: '1px solid #e2e8f0', borderRadius: 8,
                  padding: 14, fontSize: 14, color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-wrap',
                }}>
                  {submission.message}
                </div>
              </div>
            </>
          ) : (
            /* History tab */
            <HistoryTab history={submission.history ?? []} />
          )}
        </div>
      </div>
    </>
  );
}

// ─── History Tab ──────────────────────────────────────────────────────────────

function HistoryTab({ history }: { history: HistoryEntry[] }) {
  if (history.length === 0) {
    return (
      <div style={{ padding: '32px 0', textAlign: 'center' }}>
        <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>No status changes recorded yet.</p>
        <p style={{ color: '#c4c9d4', fontSize: 12, margin: '6px 0 0' }}>
          Changes will appear here once an admin updates the status.
        </p>
      </div>
    );
  }

  // Show newest first
  const sorted = [...history].reverse();

  return (
    <div>
      <p style={{ margin: '0 0 16px', fontSize: 12, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Status Change Log
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {sorted.map((entry, i) => {
          const { bg, color } = STATUS_COLORS[entry.status];
          return (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '12px 0',
                borderBottom: i < sorted.length - 1 ? '1px solid #f1f5f9' : 'none',
              }}
            >
              {/* Timeline dot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, marginTop: 3 }} />
                {i < sorted.length - 1 && (
                  <div style={{ width: 1, flex: 1, background: '#e2e8f0', minHeight: 24 }} />
                )}
              </div>

              <div style={{ flex: 1 }}>
                {/* Status badge */}
                <span style={{
                  display: 'inline-block',
                  background: bg, color, borderRadius: 12,
                  padding: '2px 9px', fontSize: 11, fontWeight: 700, marginBottom: 5,
                }}>
                  {STATUS_LABELS[entry.status]}
                </span>

                {/* Admin ID + timestamp */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: '#F0F4F8', borderRadius: 6, padding: '2px 8px',
                    fontSize: 12, color: '#1E5A8A', fontWeight: 600, fontFamily: 'monospace',
                  }}>
                    {entry.adminId}
                  </span>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>
                    {fmtDate(entry.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 25;

export default function EnquiriesClient({ adminId }: { adminId: string }) {
  const [data,       setData]       = useState<EnquiriesResponse | null>(null);
  const [metrics,    setMetrics]    = useState<MetricsData | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected,   setSelected]   = useState<Submission | null>(null);
  const [page,       setPage]       = useState(1);
  const [filters,    setFilters]    = useState<Filters>({
    status: '', service: '', search: '', sort: 'desc', from: '', to: '',
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-dismiss error after 5s
  useEffect(() => {
    if (!errorMsg) return;
    const t = setTimeout(() => setErrorMsg(null), 5000);
    return () => clearTimeout(t);
  }, [errorMsg]);

  const fetchData = useCallback(async (pg: number, f: Filters, isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const q = new URLSearchParams({
        page: String(pg), limit: String(ITEMS_PER_PAGE),
        status: f.status, service: f.service, search: f.search,
        sort: f.sort, from: f.from, to: f.to,
      });
      const [enqRes, metRes] = await Promise.all([
        fetch(`/api/dashboard/enquiries?${q}`),
        fetch('/api/dashboard/metrics'),
      ]);
      if (!enqRes.ok || !metRes.ok) throw new Error('Fetch failed');
      const [enqData, metData] = await Promise.all([enqRes.json(), metRes.json()]);
      setData(enqData);
      setMetrics(metData);
    } catch {
      setErrorMsg('Failed to load data. Check your connection and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(page, filters); }, [fetchData, page, filters]);

  function handleFilterChange(key: keyof Filters, value: string) {
    setPage(1);
    setFilters((f) => ({ ...f, [key]: value }));
  }

  async function handleStatusChange(id: string, status: SubmissionStatus) {
    try {
      await fetch(`/api/dashboard/enquiries/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      });
      const now = new Date().toISOString();
      // Optimistically update local state
      const updateSub = (s: Submission): Submission =>
        s.id === id
          ? { ...s, status, updatedAt: now, history: [...(s.history ?? []), { adminId, status, timestamp: now }] }
          : s;
      setData((prev) => prev ? { ...prev, submissions: prev.submissions.map(updateSub) } : prev);
      if (selected?.id === id) setSelected((s) => s ? updateSub(s) : s);
      // Refresh metrics in background
      fetch('/api/dashboard/metrics').then((r) => r.json()).then(setMetrics).catch(() => {});
    } catch {
      setErrorMsg('Failed to update status. Please try again.');
    }
  }

  // ── Styles ──────────────────────────────────────────────────────────────────

  const hdrStyle: React.CSSProperties = {
    background: '#0B2545', padding: '0 24px', height: 56,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    position: 'sticky', top: 0, zIndex: 50,
  };

  const btnStyle = (variant: 'primary' | 'ghost' = 'ghost'): React.CSSProperties => ({
    padding: '7px 14px', borderRadius: 8,
    border: variant === 'primary' ? 'none' : '1px solid rgba(255,255,255,0.2)',
    background: variant === 'primary' ? '#1CA7A6' : 'transparent',
    color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
  });

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px', borderRadius: 8,
    border: '1px solid #e2e8f0', background: '#fff',
    fontSize: 13, color: '#374151', outline: 'none',
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8' }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={hdrStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#1CA7A6', fontSize: 18, fontWeight: 800 }}>⚓</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Constellation Marine</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>|</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{adminId}</span>
          <button
            style={btnStyle('ghost')}
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              window.location.href = '/dashboard/login';
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

        {/* Error banner */}
        {errorMsg && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
            padding: '12px 16px', marginBottom: 16, color: '#991B1B', fontSize: 13,
          }}>
            <span>⚠ {errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B', fontSize: 16, lineHeight: 1, padding: '0 0 0 12px' }}
              aria-label="Dismiss error"
            >×</button>
          </div>
        )}

        {/* Page title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0B2545' }}>Enquiries</h1>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>Manage and track all website enquiries</p>
          </div>
          <button
            style={{ ...btnStyle('primary'), display: 'flex', alignItems: 'center', gap: 6, opacity: refreshing ? 0.7 : 1 }}
            onClick={() => fetchData(page, filters, true)}
            disabled={refreshing}
          >
            <span style={{ display: 'inline-block', animation: refreshing ? 'spin 1s linear infinite' : 'none' }}>↻</span>
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {/* ── Analytics: metrics + charts ─────────────────────────────────── */}
        {metrics && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20, alignItems: 'stretch' }}>

            {/* Metric cards */}
            <div style={{ flex: '1 1 360px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <MetricCard label="Total"       value={metrics.total}       color="#0B2545" />
                <MetricCard label="This Week"   value={metrics.thisWeek}    color="#1CA7A6" />
                <MetricCard label="Last 30 Days" value={metrics.last30}     color="#5C6BC0" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <MetricCard label="Open"        value={metrics.open}        color="#E65100" />
                <MetricCard label="In Progress" value={metrics.in_progress} color="#F9A825" />
                <MetricCard label="Closed"      value={metrics.closed}      color="#2E7D32" />
              </div>
            </div>

            {/* Donut chart */}
            <div style={{
              flex: '0 0 auto', background: '#fff', borderRadius: 12,
              padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Status Breakdown
              </p>
              <DonutChart metrics={metrics} />
            </div>

            {/* Bar chart (trend) */}
            <div style={{
              flex: '1 1 260px', background: '#fff', borderRadius: 12,
              padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              display: 'flex', flexDirection: 'column',
            }}>
              <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                30-Day Activity
              </p>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                <BarChart trend={metrics.trend} />
              </div>
            </div>

          </div>
        )}

        {/* ── Filters ─────────────────────────────────────────────────────── */}
        <div style={{
          background: '#fff', borderRadius: 12, padding: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16,
          display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
        }}>
          <input
            type="search"
            placeholder="Search name, company, email…"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={{ ...inputStyle, minWidth: 200, flex: '1 1 200px' }}
          />
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={filters.service}
            onChange={(e) => handleFilterChange('service', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer', maxWidth: 220 }}
          >
            <option value="">All Services</option>
            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
          <input type="date" value={filters.from} onChange={(e) => handleFilterChange('from', e.target.value)} style={inputStyle} title="From date" />
          <input type="date" value={filters.to}   onChange={(e) => handleFilterChange('to',   e.target.value)} style={inputStyle} title="To date" />
          {(filters.status || filters.service || filters.search || filters.from || filters.to) && (
            <button
              onClick={() => { setPage(1); setFilters({ status: '', service: '', search: '', sort: 'desc', from: '', to: '' }); }}
              style={{ ...inputStyle, cursor: 'pointer', color: '#6b7280', border: '1px dashed #d0d7e2' }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ── Table ───────────────────────────────────────────────────────── */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>Loading enquiries…</div>
          ) : !data || data.submissions.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>No enquiries match the current filters.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #e2e8f0' }}>
                    {['Date', 'Name', 'Company', 'Location', 'Service', 'Status', 'History', ''].map((h) => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#6b7280', whiteSpace: 'nowrap', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.submissions.map((s) => (
                    <tr
                      key={s.id}
                      className="enquiry-row"
                      style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                      tabIndex={0}
                      onClick={() => setSelected(s)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(s); } }}
                    >
                      <td style={{ padding: '12px 14px', color: '#6b7280', whiteSpace: 'nowrap' }}>{fmtDateShort(s.timestamp)}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#1f2937', whiteSpace: 'nowrap' }}>{s.name}</td>
                      <td style={{ padding: '12px 14px', color: '#6b7280' }}>{s.company || '—'}</td>
                      <td style={{ padding: '12px 14px', color: '#6b7280' }}>{s.location || '—'}</td>
                      <td style={{ padding: '12px 14px', color: '#374151', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.service || '—'}
                      </td>
                      <td style={{ padding: '12px 14px' }} onClick={(e) => e.stopPropagation()}>
                        <StatusBadge status={s.status} onChange={(status) => handleStatusChange(s.id, status)} />
                      </td>
                      <td style={{ padding: '12px 14px' }} onClick={(e) => e.stopPropagation()}>
                        <HistoryPopover history={s.history ?? []} />
                      </td>
                      <td style={{ padding: '12px 14px', color: '#9ca3af', fontSize: 18 }}>›</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {data && data.pages > 1 && (
            <div style={{
              padding: '12px 16px', borderTop: '1px solid #f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontSize: 13, color: '#6b7280',
            }}>
              <span>
                Showing {((data.page - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(data.page * ITEMS_PER_PAGE, data.total)} of {data.total}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button disabled={data.page <= 1} onClick={() => setPage((p) => p - 1)}
                  style={{ ...inputStyle, cursor: data.page <= 1 ? 'not-allowed' : 'pointer', opacity: data.page <= 1 ? 0.5 : 1 }}>
                  ← Prev
                </button>
                <span style={{ padding: '8px 12px', background: '#F0F4F8', borderRadius: 8 }}>
                  {data.page} / {data.pages}
                </span>
                <button disabled={data.page >= data.pages} onClick={() => setPage((p) => p + 1)}
                  style={{ ...inputStyle, cursor: data.page >= data.pages ? 'not-allowed' : 'pointer', opacity: data.page >= data.pages ? 0.5 : 1 }}>
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <DetailPanel
          submission={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        tr.enquiry-row:hover { background: #F8FAFC; }
        tr.enquiry-row:focus { background: #EDF2F7; outline: 2px solid #1CA7A6; outline-offset: -2px; }
      `}</style>
    </div>
  );
}
