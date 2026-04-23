import type { CSSProperties } from 'react';
import { FormEvent, useMemo, useState } from 'react';
import { ClientCard } from '../components/ClientCard';
import { useClients } from '../hooks/useClients';
import type { ClientInput, ClientStatus } from '../../shared/types';
import { CLIENT_STATUS_LABELS } from '../../shared/types';
import type { FieldErrors } from '../utils/client-form';
import { isFormValid, validateForm } from '../utils/client-form';
import { filterClients } from '../utils/client-search';

export function ClientsPage() {
  const { clients, loading, error, create, update, remove } = useClients();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<ClientStatus>('prospect');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [exportMsg, setExportMsg] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const filtered = useMemo(() => filterClients(clients, search), [clients, search]);

  const formValid = isFormValid(name, email);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errors = validateForm(name, email);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const input: ClientInput = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      status,
    };
    setSaving(true);
    try {
      await create(input);
      setName('');
      setEmail('');
      setPhone('');
      setStatus('prospect');
      setFieldErrors({});
    } finally {
      setSaving(false);
    }
  }

  async function handleExportCsv() {
    setExportMsg(null);
    setExporting(true);
    try {
      const result = await window.api.clients.exportCsv();
      if (result.ok) {
        setExportMsg(`Export enregistré : ${result.path}`);
      } else if (result.canceled) {
        setExportMsg(null);
      } else {
        setExportMsg(result.error ?? "Export impossible.");
      }
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="mt-0 text-2xl font-bold">Clients</h1>
        <button
          type="button"
          disabled={exporting || loading}
          onClick={() => void handleExportCsv()}
          className="rounded-md border border-[#3d4450] bg-[#22262e] px-3 py-2 text-sm text-[#e8eaed] hover:bg-[#2a2f38] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {exporting ? 'Export…' : 'Exporter CSV'}
        </button>
      </div>
      {exportMsg ? (
        <p className="mb-3 text-sm text-[#86efac]" role="status">
          {exportMsg}
        </p>
      ) : null}

      <div className="mb-4">
        <input
          type="search"
          placeholder="Rechercher un client…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-[#3d4450] bg-[#1a1d23] px-3 py-2 text-[#e8eaed] placeholder:text-[#6b7280] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
          aria-label="Rechercher un client"
        />
      </div>

      <form
        onSubmit={(e) => void onSubmit(e)}
        noValidate
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
        <div>
          <input
            placeholder="Nom"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (fieldErrors.name) setFieldErrors((f) => ({ ...f, name: undefined }));
            }}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? 'err-name' : undefined}
            style={{
              ...inputStyle,
              borderColor: fieldErrors.name ? '#b91c1c' : '#3d4450',
            }}
          />
          {fieldErrors.name ? (
            <p id="err-name" className="mt-1 text-sm text-[#f87171]">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: undefined }));
            }}
            autoComplete="email"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'err-email' : undefined}
            style={{
              ...inputStyle,
              borderColor: fieldErrors.email ? '#b91c1c' : '#3d4450',
            }}
          />
          {fieldErrors.email ? (
            <p id="err-email" className="mt-1 text-sm text-[#f87171]">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>
        <input
          placeholder="Téléphone (optionnel)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#9aa0a6' }}>Statut</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ClientStatus)}
            style={inputStyle}
          >
            {(Object.keys(CLIENT_STATUS_LABELS) as ClientStatus[]).map((s) => (
              <option key={s} value={s}>
                {CLIENT_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={saving || !formValid}
          style={{
            padding: '10px 16px',
            borderRadius: 6,
            border: 'none',
            background: formValid ? '#3b82f6' : '#3d4a5c',
            color: '#fff',
            cursor: saving ? 'wait' : formValid ? 'pointer' : 'not-allowed',
          }}
        >
          {saving ? 'Enregistrement…' : 'Ajouter'}
        </button>
      </form>

      {loading ? <p>Chargement…</p> : null}
      {error ? <p style={{ color: '#f87171' }}>{error}</p> : null}

      {!loading && filtered.length === 0 && clients.length > 0 ? (
        <p className="text-[#9aa0a6]">Aucun client ne correspond à la recherche.</p>
      ) : null}
      {!loading && clients.length === 0 ? (
        <p className="text-[#9aa0a6]">Aucun client pour l’instant.</p>
      ) : null}

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
        {filtered.map((c) => (
          <li key={c.id}>
            <ClientCard
              client={c}
              onDelete={(id) => void remove(id)}
              onStatusChange={(id, input) => void update(id, input)}
            />
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
  width: '100%',
  boxSizing: 'border-box',
};
