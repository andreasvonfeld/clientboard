import type { Client } from '../../shared/types';

export function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function filterClients(clients: Client[], query: string): Client[] {
  const q = normalize(query);
  if (!q) return clients;
  return clients.filter((c) => {
    const inName = normalize(c.name).includes(q);
    const inEmail = normalize(c.email).includes(q);
    return inName || inEmail;
  });
}
