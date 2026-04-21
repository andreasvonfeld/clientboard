import { useState } from 'react';
import { ClientsPage } from './pages/ClientsPage';
import { DashboardPage } from './pages/DashboardPage';
import { PipelinePage } from './pages/PipelinePage';
import { RelancesPage } from './pages/RelancesPage';

export type AppSection = 'clients' | 'pipeline' | 'relances' | 'dashboard';

const nav: { id: AppSection; label: string; hint: string }[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    hint: 'Totaux, répartition par statut, barres %',
  },
  { id: 'clients', label: 'Clients', hint: 'Liste et fiches' },
  {
    id: 'pipeline',
    label: 'Pipeline',
    hint: 'Kanban par statut · glisser-déposer',
  },
  { id: 'relances', label: 'Relances', hint: 'À venir' },
];

export function App() {
  const [section, setSection] = useState<AppSection>('dashboard');

  return (
    <div className="flex h-screen min-h-0 bg-[#1a1d23] text-[#e8eaed]">
      <aside className="flex w-[200px] shrink-0 flex-col border-r border-[#2d333b] bg-[#16181c] px-2 py-4">
        <div className="mb-4 px-2 text-sm font-semibold tracking-tight text-[#9aa0a6]">
          ClientBoard
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`rounded-md px-3 py-2 text-left text-sm transition-colors ${
                section === item.id
                  ? 'bg-[#2d333b] text-white'
                  : 'text-[#c4c7cc] hover:bg-[#22262e]'
              }`}
            >
              <span className="block font-medium">{item.label}</span>
              <span className="block text-xs text-[#7d838c]">{item.hint}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <div key={section} className="app-section-enter">
          {section === 'clients' ? <ClientsPage /> : null}
          {section === 'pipeline' ? <PipelinePage /> : null}
          {section === 'relances' ? <RelancesPage /> : null}
          {section === 'dashboard' ? <DashboardPage /> : null}
        </div>
      </main>
    </div>
  );
}
