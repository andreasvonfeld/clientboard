import { describe, expect, it } from 'vitest';
import type { Client } from '../../shared/types';
import { filterClients, normalize } from './client-search';

const clients: Client[] = [
  {
    id: 1,
    name: 'Alice Dupont',
    email: 'alice@mail.com',
    phone: null,
    status: 'prospect',
    createdAt: '2026-04-20T10:00:00.000Z',
  },
  {
    id: 2,
    name: 'Bob Martin',
    email: 'contact@bob.fr',
    phone: null,
    status: 'active',
    createdAt: '2026-04-21T10:00:00.000Z',
  },
];

describe('client-search utils', () => {
  it('normalise avec trim + lower-case', () => {
    expect(normalize('  ALIce  ')).toBe('alice');
  });

  it('retourne tout si la recherche est vide', () => {
    expect(filterClients(clients, '   ')).toEqual(clients);
  });

  it('filtre sur le nom et l’email en insensible à la casse', () => {
    expect(filterClients(clients, 'dupont')).toHaveLength(1);
    expect(filterClients(clients, 'BOB.FR')).toHaveLength(1);
  });
});
