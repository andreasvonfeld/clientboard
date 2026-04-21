/** Types partagés entre le processus main et le renderer (via preload). */

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

export type ClientInput = Pick<Client, 'name' | 'email' | 'phone'>;

export interface ClientsApi {
  list: () => Promise<Client[]>;
  get: (id: number) => Promise<Client | null>;
  create: (input: ClientInput) => Promise<Client>;
  update: (id: number, input: ClientInput) => Promise<Client | null>;
  remove: (id: number) => Promise<boolean>;
}

export interface AppApi {
  clients: ClientsApi;
}
