import { describe, expect, it } from 'vitest';
import type { Client } from '../../shared/types';
import { countByStatus, toPercent } from './dashboard-stats';

const clients: Client[] = [
  {
    id: 1,
    name: 'A',
    email: 'a@mail.com',
    phone: null,
    status: 'prospect',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'B',
    email: 'b@mail.com',
    phone: null,
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    name: 'C',
    email: 'c@mail.com',
    phone: null,
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

describe('dashboard-stats utils', () => {
  it('compte les clients par statut', () => {
    expect(countByStatus(clients)).toEqual({
      prospect: 1,
      active: 2,
      inactive: 0,
    });
  });

  it('calcule un pourcentage arrondi', () => {
    expect(toPercent(2, 3)).toBe(67);
    expect(toPercent(0, 0)).toBe(0);
  });
});
