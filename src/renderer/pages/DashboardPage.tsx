import { useEffect, useMemo, useState } from 'react';
import type { Client, ClientStatus } from '../../shared/types';
import { CLIENT_STATUS_LABELS } from '../../shared/types';
import { countByStatus, toPercent } from '../utils/dashboard-stats';

export function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    window.api.clients
      .getAll()
      .then((list) => {
        if (!cancelled) setClients(list);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Impossible de charger les données');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => countByStatus(clients), [clients]);
  const total = clients.length;
  const pctActive = toPercent(stats.active, total);

  return (
    <div className="p-6">
      <h1 className="mt-0 text-2xl font-bold text-[#e8eaed]">Dashboard</h1>
      <p className="mt-1 text-sm text-[#9aa0a6]">
        Vue d’ensemble de ta base clients — hors suivi financier (prévu en
        produit).
      </p>

      {loading ? (
        <p className="mt-8 text-[#9aa0a6]">Chargement…</p>
      ) : null}
      {error ? (
        <p className="mt-8 text-[#f87171]" role="alert">
          {error}
        </p>
      ) : null}

      {!loading && !error ? (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Clients"
              value={total}
              hint="Total enregistrés"
              accent="border-l-[#3b82f6]"
            />
            <StatCard
              label={CLIENT_STATUS_LABELS.prospect}
              value={stats.prospect}
              hint="À qualifier / relancer"
              accent="border-l-[#64748b]"
            />
            <StatCard
              label={CLIENT_STATUS_LABELS.active}
              value={stats.active}
              hint={`${pctActive}% du total`}
              accent="border-l-[#22c55e]"
            />
            <StatCard
              label={CLIENT_STATUS_LABELS.inactive}
              value={stats.inactive}
              hint="Dormants ou archivés"
              accent="border-l-[#94a3b8]"
            />
          </div>

          <div className="mt-10 rounded-lg border border-[#2d333b] bg-[#22262e] p-5">
            <h2 className="mt-0 text-sm font-semibold uppercase tracking-wide text-[#9aa0a6]">
              Répartition
            </h2>
            <div className="mt-4 space-y-3">
              {(Object.keys(CLIENT_STATUS_LABELS) as ClientStatus[]).map((s) => (
                <StatusBar
                  key={s}
                  label={CLIENT_STATUS_LABELS[s]}
                  count={stats[s]}
                  total={total}
                  color={
                    s === 'active'
                      ? 'bg-[#22c55e]'
                      : s === 'prospect'
                        ? 'bg-[#64748b]'
                        : 'bg-[#64748b]/60'
                  }
                />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function StatCard(props: {
  label: string;
  value: number;
  hint: string;
  accent: string;
}) {
  return (
    <div
      className={`rounded-lg border border-[#2d333b] bg-[#22262e] p-4 ${props.accent} border-l-4`}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-[#9aa0a6]">
        {props.label}
      </div>
      <div className="mt-1 text-3xl font-semibold tabular-nums text-[#e8eaed]">
        {props.value}
      </div>
      <div className="mt-1 text-xs text-[#7d838c]">{props.hint}</div>
    </div>
  );
}

function StatusBar(props: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = toPercent(props.count, props.total);
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm text-[#c4c7cc]">
        <span>{props.label}</span>
        <span className="tabular-nums text-[#9aa0a6]">
          {props.count} ({pct}%)
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#1a1d23]">
        <div
          className={`h-full rounded-full transition-all ${props.color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
