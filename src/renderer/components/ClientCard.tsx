import type { Client } from '../../shared/types';

type Props = {
  client: Client;
  onDelete?: (id: number) => void;
};

export function ClientCard({ client, onDelete }: Props) {
  return (
    <article
      style={{
        border: '1px solid #2d333b',
        borderRadius: 8,
        padding: '12px 16px',
        background: '#22262e',
      }}
    >
      <header style={{ marginBottom: 8 }}>
        <strong>{client.name}</strong>
      </header>
      <div style={{ fontSize: 14, color: '#9aa0a6' }}>{client.email}</div>
      {client.phone ? (
        <div style={{ fontSize: 14, marginTop: 4 }}>{client.phone}</div>
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
