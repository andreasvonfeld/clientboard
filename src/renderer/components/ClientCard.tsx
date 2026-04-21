import type { Client, ClientInput, ClientStatus } from '../../shared/types';
import { CLIENT_STATUS_LABELS } from '../../shared/types';

type Props = {
  client: Client;
  onDelete?: (id: number) => void;
  onStatusChange?: (id: number, input: ClientInput) => void;
};

const statusStyle: Record<ClientStatus, string> = {
  prospect: '#64748b',
  active: '#22c55e',
  inactive: '#94a3b8',
};

export function ClientCard({ client, onDelete, onStatusChange }: Props) {
  return (
    <article
      style={{
        border: '1px solid #2d333b',
        borderRadius: 8,
        padding: '12px 16px',
        background: '#22262e',
      }}
    >
      <header
        style={{
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        <strong>{client.name}</strong>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: statusStyle[client.status],
          }}
        >
          {CLIENT_STATUS_LABELS[client.status]}
        </span>
      </header>
      <div style={{ fontSize: 14, color: '#9aa0a6' }}>{client.email}</div>
      {client.phone ? (
        <div style={{ fontSize: 14, marginTop: 4 }}>{client.phone}</div>
      ) : null}
      {onStatusChange ? (
        <div style={{ marginTop: 10 }}>
          <label
            style={{
              fontSize: 12,
              color: '#9aa0a6',
              display: 'block',
              marginBottom: 4,
            }}
          >
            Statut
          </label>
          <select
            value={client.status}
            onChange={(e) => {
              const status = e.target.value as ClientStatus;
              const input: ClientInput = {
                name: client.name,
                email: client.email,
                phone: client.phone,
                status,
              };
              void onStatusChange(client.id, input);
            }}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid #3d4450',
              background: '#1a1d23',
              color: '#e8eaed',
              maxWidth: '100%',
            }}
          >
            {(Object.keys(CLIENT_STATUS_LABELS) as ClientStatus[]).map((s) => (
              <option key={s} value={s}>
                {CLIENT_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      {onDelete ? (
        <button
          type="button"
          onClick={() => onDelete(client.id)}
          style={{
            marginTop: 12,
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid #5c2121',
            background: '#3d1f1f',
            color: '#f5b5b5',
            cursor: 'pointer',
          }}
        >
          Supprimer
        </button>
      ) : null}
    </article>
  );
}
