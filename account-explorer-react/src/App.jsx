import { useState } from 'react';
import AccountExplorer from './AccountExplorer';

const NAV_ITEMS = ['Dashboard', 'Accounts', 'Contacts', 'Deals', 'Reports', 'Settings'];

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-surface font-sans text-ink">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 shrink-0 flex-col bg-brand-navy text-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 px-5 py-5 text-sm font-semibold">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-xs">V</span>
          Vibe CRM
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive = item === 'Accounts';
            return (
              <span
                key={item}
                onClick={() => setSidebarOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm ${
                  isActive ? 'bg-white/10 font-medium text-white' : 'text-white/60'
                }`}
              >
                {item}
              </span>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-hairline bg-white px-4 sm:h-16 sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink hover:bg-surface-soft lg:hidden"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M2.5 5.5h15a1 1 0 0 0 0-2h-15a1 1 0 0 0 0 2Zm15 3.5h-15a1 1 0 0 0 0 2h15a1 1 0 0 0 0-2Zm0 5.5h-15a1 1 0 0 0 0 2h15a1 1 0 0 0 0-2Z" />
            </svg>
          </button>
          <div className="flex-1" />
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            AE
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-1 text-xl font-semibold text-ink sm:text-2xl">Accounts</h1>
            <p className="mb-6 text-sm text-steel">Browse, search, and sort the accounts in your CRM.</p>
            <AccountExplorer />
          </div>
        </main>
      </div>
    </div>
  );
}
