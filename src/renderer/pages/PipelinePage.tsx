import { useMemo, useState } from 'react';
import type { ClientStatus } from '../../shared/types';
import { CLIENT_STATUS_LABELS } from '../../shared/types';
import { useClients } from '../hooks/useClients';
import { groupByStatus, STATUSES } from '../utils/pipeline';

export function PipelinePage() {
  const { clients, loading, error, update } = useClients();
  const [moveError, setMoveError] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const grouped = useMemo(() => groupByStatus(clients), [clients]);

  async function handleDrop(
    columnStatus: ClientStatus,
    e: React.DragEvent<HTMLDivElement>,
  ) {
    e.preventDefault();
    setMoveError(null);
    const raw = e.dataTransfer.getData('text/plain');
    const id = Number(raw);
    if (!Number.isFinite(id)) return;
    const client = clients.find((c) => c.id === id);
    if (!client || client.status === columnStatus) return;
    try {
      await update(id, {
        name: client.name,
        email: client.email,
        phone: client.phone,
        status: columnStatus,
      });
    } catch (err) {
      setMoveError(
        err instanceof Error ? err.message : 'Impossible de mettre à jour le statut',
      );
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  return (
    <div className="flex h-full min-h-0 flex-col p-6">
      <div className="shrink-0">
        <h1 className="mt-0 text-2xl font-bold text-[#e8eaed]">Pipeline</h1>
        <p className="mt-1 max-w-2xl text-sm text-[#9aa0a6]">
          Vue Kanban par statut : fais glisser une carte pour changer le statut
          d’un client (même données que l’onglet Clients).
        </p>
      </div>

      {loading ? (
        <p className="mt-8 text-[#9aa0a6]">Chargement…</p>
      ) : null}
      {error ? (
        <p className="mt-4 text-[#f87171]" role="alert">
          {error}
        </p>
      ) : null}
      {moveError ? (
        <p className="mt-2 text-sm text-[#f87171]" role="alert">
          {moveError}
        </p>
      ) : null}

      {!loading && !error ? (
        <div className="mt-6 flex min-h-0 flex-1 gap-3 overflow-x-auto pb-2">
          {STATUSES.map((status) => (
            <section
              key={status}
              className="flex w-[min(100%,280px)] shrink-0 flex-col rounded-lg border border-[#2d333b] bg-[#16181c]"
              onDragOver={handleDragOver}
              onDrop={(e) => void handleDrop(status, e)}
            >
              <header className="border-b border-[#2d333b] px-3 py-2">
                <h2 className="text-sm font-semibold text-[#e8eaed]">
                  {CLIENT_STATUS_LABELS[status]}
                </h2>
                <p className="text-xs text-[#7d838c]">
                  {grouped[status].length} client
                  {grouped[status].length !== 1 ? 's' : ''}
                </p>
              </header>
              <div className="flex min-h-[120px] flex-1 flex-col gap-2 overflow-y-auto p-2">
                {grouped[status].map((client) => (
                  <article
                    key={client.id}
                    draggable
                    onDragStart={(e) => {
                      setDraggingId(client.id);
                      e.dataTransfer.setData('text/plain', String(client.id));
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragEnd={() => setDraggingId(null)}
                    className={`cursor-grab rounded-md border border-[#2d333b] bg-[#22262e] p-3 text-left active:cursor-grabbing ${
                      draggingId === client.id ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="font-medium text-[#e8eaed]">{client.name}</div>
                    <div className="mt-1 truncate text-xs text-[#9aa0a6]">
                      {client.email}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}
    </div>
  );
}
