import type { CSSProperties } from 'react';
import { FormEvent, useState } from 'react';
import { ClientCard } from '../components/ClientCard';
import { useClients } from '../hooks/useClients';
import type { ClientInput } from '../../shared/types';

export function ClientsPage() {
  const { clients, loading, error, create, remove } = useClients();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const input: ClientInput = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
    };
    if (!input.name || !input.email) return;
    setSaving(true);
    try {
      await create(input);
      setName('');
      setEmail('');
      setPhone('');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ marginTop: 0 }}>Clients</h1>

      <form
        onSubmit={(e) => void onSubmit(e)}
        style={{
          display: 'grid',
          gap: 12,
          marginBottom: 28,
          padding: 16,
          border: '1px solid #2d333b',
          borderRadius: 8,
          background: '#22262e',
        }}
      >
        <input
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          placeholder="Téléphone (optionnel)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: '10px 16px',
            borderRadius: 6,
            border: 'none',
            background: '#3b82f6',
            color: '#fff',
            cursor: saving ? 'wait' : 'pointer',
          }}
        >
          {saving ? 'Enregistrement…' : 'Ajouter'}
        </button>
      </form>

      {loading ? <p>Chargement…</p> : null}
      {error ? <p style={{ color: '#f87171' }}>{error}</p> : null}

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {clients.map((c) => (
          <li key={c.id}>
            <ClientCard client={c} onDelete={(id) => void remove(id)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

const inputStyle: CSSProperties = {
  padding: '10px 12px',
  borderRadius: 6,
  border: '1px solid #3d4450',
  background: '#1a1d23',
  color: '#e8eaed',
};
