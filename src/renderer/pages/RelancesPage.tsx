import { useMemo, useState } from 'react';
import type { Client, ClientInput } from '../../shared/types';
import { CLIENT_STATUS_LABELS } from '../../shared/types';
import { useClients } from '../hooks/useClients';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function sortByCreatedAsc(a: Client, b: Client): number {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}

export function RelancesPage() {
  const { clients, loading, error, update } = useClients();
  const [busyId, setBusyId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const prospects = useMemo(
    () => clients.filter((c) => c.status === 'prospect').sort(sortByCreatedAsc),
    [clients],
  );
  const inactifs = useMemo(
    () => clients.filter((c) => c.status === 'inactive').sort(sortByCreatedAsc),
    [clients],
  );

  async function setStatus(client: Client, status: ClientInput['status']) {
    setActionError(null);
    setBusyId(client.id);
    try {
      const input: ClientInput = {
        name: client.name,
        email: client.email,
        phone: client.phone,
        status,
      };
      await update(client.id, input);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Mise à jour impossible');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="p-6">
      <h1 className="mt-0 text-2xl font-bold text-[#e8eaed]">Relances</h1>
      <p className="mt-1 max-w-2xl text-sm text-[#9aa0a6]">
        Priorise les <strong className="text-[#c4c7cc]">prospects</strong> (pistes à
        qualifier) et les <strong className="text-[#c4c7cc]">inactifs</strong> à
        réactiver — sans date de rappel dédiée pour l’instant.
      </p>

      {loading ? <p className="mt-8 text-[#9aa0a6]">Chargement…</p> : null}
      {error ? (
        <p className="mt-4 text-[#f87171]" role="alert">
          {error}
        </p>
      ) : null}
      {actionError ? (
        <p className="mt-2 text-sm text-[#f87171]" role="alert">
          {actionError}
        </p>
      ) : null}

      {!loading && !error ? (
        <div className="mt-8 flex flex-col gap-10">
          <section>
            <h2 className="mt-0 text-sm font-semibold uppercase tracking-wide text-[#9aa0a6]">
              {CLIENT_STATUS_LABELS.prospect} — à relancer en priorité
            </h2>
            <p className="mt-1 text-xs text-[#7d838c]">
              Tri du plus ancien au plus récent (inscription).
            </p>
            {prospects.length === 0 ? (
              <p className="mt-4 text-sm text-[#9aa0a6]">
                Aucun prospect pour l’instant. Ajoute des clients depuis l’onglet
                Clients.
              </p>
            ) : (
              <ul className="mt-4 flex list-none flex-col gap-3 p-0">
                {prospects.map((c) => (
                  <li key={c.id}>
                    <RelanceCard
                      client={c}
                      busy={busyId === c.id}
                      primaryAction={{
                        label: 'Marquer comme actif',
                        onClick: () => void setStatus(c, 'active'),
                      }}
                      secondaryAction={{
                        label: 'Mettre en inactif',
                        onClick: () => void setStatus(c, 'inactive'),
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="mt-0 text-sm font-semibold uppercase tracking-wide text-[#9aa0a6]">
              {CLIENT_STATUS_LABELS.inactive} — suivi réactivation
            </h2>
            <p className="mt-1 text-xs text-[#7d838c]">
              Clients marqués inactifs : repasser en prospect ou actif après contact.
            </p>
            {inactifs.length === 0 ? (
              <p className="mt-4 text-sm text-[#9aa0a6]">Aucun client inactif.</p>
            ) : (
              <ul className="mt-4 flex list-none flex-col gap-3 p-0">
                {inactifs.map((c) => (
                  <li key={c.id}>
                    <RelanceCard
                      client={c}
                      busy={busyId === c.id}
                      primaryAction={{
                        label: 'Repasser en prospect',
                        onClick: () => void setStatus(c, 'prospect'),
                      }}
                      secondaryAction={{
                        label: 'Marquer comme actif',
                        onClick: () => void setStatus(c, 'active'),
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}

function RelanceCard(props: {
  client: Client;
  busy: boolean;
  primaryAction: { label: string; onClick: () => void };
  secondaryAction: { label: string; onClick: () => void };
}) {
  const { client, busy } = props;
  return (
    <article className="rounded-lg border border-[#2d333b] bg-[#22262e] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium text-[#e8eaed]">{client.name}</div>
          <div className="mt-0.5 truncate text-sm text-[#9aa0a6]">{client.email}</div>
          <div className="mt-2 text-xs text-[#7d838c]">
            Ajouté le {formatDate(client.createdAt)}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={props.primaryAction.onClick}
            className="rounded-md bg-[#3b82f6] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#2563eb] disabled:cursor-wait disabled:opacity-60"
          >
            {busy ? '…' : props.primaryAction.label}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={props.secondaryAction.onClick}
            className="rounded-md border border-[#3d4450] bg-[#1a1d23] px-3 py-1.5 text-xs text-[#e8eaed] hover:bg-[#2a2f38] disabled:cursor-wait disabled:opacity-60"
          >
            {props.secondaryAction.label}
          </button>
        </div>
      </div>
    </article>
  );
}
