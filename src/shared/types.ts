/** Types partagés entre le processus main et le renderer (via preload). */

export type ClientStatus = 'prospect' | 'active' | 'inactive';

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  prospect: 'Prospect',
  active: 'Actif',
  inactive: 'Inactif',
};

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status: ClientStatus;
  createdAt: string;
}

export type ClientInput = Pick<Client, 'name' | 'email' | 'phone' | 'status'>;

export type ExportCsvResult =
  | { ok: true; path: string }
  | { ok: false; canceled?: boolean; error?: string };

export interface ClientsApi {
  /** Équivalent cours / PDF : `clients:getAll`. */
  getAll: () => Promise<Client[]>;
  get: (id: number) => Promise<Client | null>;
  create: (input: ClientInput) => Promise<Client>;
  update: (id: number, input: ClientInput) => Promise<Client | null>;
  /** Canal IPC : `clients:delete` (mot réservé JS → méthode `remove` côté API). */
  remove: (id: number) => Promise<boolean>;
  /** Export CSV — dialogue « Enregistrer sous » côté main. */
  exportCsv: () => Promise<ExportCsvResult>;
}

export interface AppApi {
  clients: ClientsApi;
}
