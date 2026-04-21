import { useCallback, useEffect, useState } from 'react';
import type { Client, ClientInput } from '../../shared/types';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await window.api.clients.getAll();
      setClients(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur chargement clients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: ClientInput) => {
      const created = await window.api.clients.create(input);
      setClients((prev) => [created, ...prev]);
      return created;
    },
    [],
  );

  const update = useCallback(async (id: number, input: ClientInput) => {
    const updated = await window.api.clients.update(id, input);
    if (updated) {
      setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));
    }
    return updated;
  }, []);

  const remove = useCallback(async (id: number) => {
    const ok = await window.api.clients.remove(id);
    if (ok) setClients((prev) => prev.filter((c) => c.id !== id));
    return ok;
  }, []);

  return {
    clients,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
  };
}
