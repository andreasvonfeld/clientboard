import type { Client } from '../../../shared/types';

export function csvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function rowToLine(c: Client): string {
  return [
    String(c.id),
    c.name,
    c.email,
    c.phone ?? '',
    c.status,
    c.createdAt,
  ]
    .map(csvCell)
    .join(',');
}

export function toCsv(lines: string[]): string {
  return lines.join('\r\n');
}
