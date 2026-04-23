import { describe, expect, it } from 'vitest';
import type { Client } from '../../../shared/types';
import { csvCell, rowToLine, toCsv } from './csv';

const sample: Client = {
  id: 1,
  name: 'Alice "QA"',
  email: 'alice@mail.com',
  phone: null,
  status: 'prospect',
  createdAt: '2026-04-23T10:00:00.000Z',
};

describe('csv utils', () => {
  it('échappe les valeurs contenant des caractères spéciaux', () => {
    expect(csvCell('simple')).toBe('simple');
    expect(csvCell('a,b')).toBe('"a,b"');
    expect(csvCell('a"b')).toBe('"a""b"');
  });

  it('construit une ligne CSV cohérente', () => {
    expect(rowToLine(sample)).toContain('"Alice ""QA"""');
    expect(rowToLine(sample)).toContain('prospect');
  });

  it('joint les lignes au format CRLF', () => {
    expect(toCsv(['h1,h2', 'a,b'])).toBe('h1,h2\r\na,b');
  });
});
