import { useEffect, useState } from 'react';
import { checkSupabaseConnection } from '@/integrations/supabase/client';

type Status = 'checking' | 'connected' | 'error';

interface SupabaseStatusProps {
  compact?: boolean;
}

export default function SupabaseStatus({ compact = false }: SupabaseStatusProps) {
  const [status, setStatus]   = useState<Status>('checking');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    checkSupabaseConnection().then(({ connected, error }) => {
      if (connected) setStatus('connected');
      else { setStatus('error'); setErrorMsg(error ?? 'Unknown error'); }
    });
  }, []);

  const dot   = { checking: '🟡', connected: '🟢', error: '🔴' }[status];
  const label = { checking: 'Checking Supabase…', connected: 'Supabase Connected', error: 'Supabase Error' }[status];

  if (compact) {
    return (
      <span title={status === 'error' ? errorMsg : label}
        style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        {dot} {label}
      </span>
    );
  }

  return (
    <div className="supabase-status-card">
      <div className="supabase-status-header">
        <span className="supabase-status-dot" data-status={status} />
        <span className="supabase-status-label">{label}</span>
        {status === 'checking' && <span className="supabase-status-spinner" />}
      </div>
      {status === 'error'     && <p className="supabase-status-error">{errorMsg}</p>}
      {status === 'connected' && <p className="supabase-status-ok">Successfully reached <code>dfxghnjkyzsxdnrezoxf.supabase.co</code></p>}
      <style>{`
        .supabase-status-card{display:inline-flex;flex-direction:column;gap:6px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:10px 16px;font-size:.85rem}
        .supabase-status-header{display:flex;align-items:center;gap:8px;font-weight:600}
        .supabase-status-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
        .supabase-status-dot[data-status="checking"]{background:#facc15}
        .supabase-status-dot[data-status="connected"]{background:#22c55e;box-shadow:0 0 6px #22c55e88}
        .supabase-status-dot[data-status="error"]{background:#ef4444;box-shadow:0 0 6px #ef444488}
        .supabase-status-spinner{width:12px;height:12px;border:2px solid rgba(255,255,255,0.2);border-top-color:#facc15;border-radius:50%;animation:spin .8s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .supabase-status-ok{margin:0;color:#86efac;font-size:.78rem}
        .supabase-status-ok code{font-size:.75rem;opacity:.75}
        .supabase-status-error{margin:0;color:#fca5a5;font-size:.78rem;word-break:break-all}
      `}</style>
    </div>
  );
}
