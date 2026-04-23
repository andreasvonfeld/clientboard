import type { Client, ClientStatus } from '../../shared/types';

export const STATUSES: ClientStatus[] = ['prospect', 'active', 'inactive'];

export function groupByStatus(clients: Client[]): Record<ClientStatus, Client[]> {
  const g: Record<ClientStatus, Client[]> = {
    prospect: [],
    active: [],
    inactive: [],
  };
  for (const c of clients) {
    g[c.status].push(c);
  }
  for (const s of STATUSES) {
    g[s].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  }
  return g;
}
