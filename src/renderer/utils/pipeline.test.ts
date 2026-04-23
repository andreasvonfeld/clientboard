import { describe, expect, it } from 'vitest';
import type { Client } from '../../shared/types';
import { groupByStatus, STATUSES } from './pipeline';

const clients: Client[] = [
  {
    id: 1,
    name: 'Charlie',
    email: 'charlie@mail.com',
    phone: null,
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Alice',
    email: 'alice@mail.com',
    phone: null,
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    name: 'Bob',
    email: 'bob@mail.com',
    phone: null,
    status: 'prospect',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

describe('pipeline utils', () => {
  it('définit les statuts dans l’ordre attendu', () => {
    expect(STATUSES).toEqual(['prospect', 'active', 'inactive']);
  });

  it('groupe et trie les clients par statut', () => {
    const grouped = groupByStatus(clients);
    expect(grouped.prospect.map((c) => c.name)).toEqual(['Bob']);
    expect(grouped.active.map((c) => c.name)).toEqual(['Alice', 'Charlie']);
    expect(grouped.inactive).toEqual([]);
  });
});
