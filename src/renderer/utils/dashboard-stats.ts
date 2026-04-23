import type { Client, ClientStatus } from '../../shared/types';

export function countByStatus(clients: Client[]): Record<ClientStatus, number> {
  const base: Record<ClientStatus, number> = {
    prospect: 0,
    active: 0,
    inactive: 0,
  };
  for (const c of clients) {
    base[c.status] += 1;
  }
  return base;
}

export function toPercent(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}
