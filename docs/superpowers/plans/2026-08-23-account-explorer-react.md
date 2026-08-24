# Account Explorer React Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replicate the `accountExplorer` LWC (search/filter/sort account table with loading/error/empty states and an expand toggle) as a standalone React (JS) app in `account-explorer-react/`, using pnpm, with data served from `Account_Sample_Data.json`.

**Architecture:** Vite-scaffolded React app. Filtering/sorting logic is extracted into a pure, framework-free module (`accountUtils.js`) so it can be unit-tested with Node's built-in test runner. `AccountExplorer.jsx` fetches the JSON file at runtime (mirrors the LWC's async Apex call, including a real error path) and holds UI state with `useState`/`useMemo`. Styling is Tailwind utility classes (v4, via the `@tailwindcss/vite` plugin — no `tailwind.config.js`/PostCSS config needed) approximating the SLDS card/table look; no separate CSS file or component library.

**Tech Stack:** React 18 (JS, not TS), Vite, pnpm, Tailwind CSS v4, Node's built-in `node:test`/`node:assert` for the logic unit tests.

---

## File Structure

- `account-explorer-react/` — new Vite app root
  - `public/Account_Sample_Data.json` — static data mirroring [accounts.csv](../../../account-explorer-dx/accounts.csv), fetched at runtime like the Apex call was
  - `src/accountUtils.js` — pure `filterAccounts`, `sortAccounts`, `getIndustryOptions`, ported from `accountExplorer.js`'s `applyFilters`/`sortData`/`industryOptions`
  - `src/accountUtils.test.js` — Node test-runner unit tests for the above
  - `src/AccountExplorer.jsx` — the ported component (fetch + state + render), styled with Tailwind utility classes
  - `src/App.jsx` — renders `<AccountExplorer />`
  - `src/index.css` — Vite scaffold stylesheet, replaced with a single `@import "tailwindcss";`
  - `vite.config.js` — modified to register the `@tailwindcss/vite` plugin
  - `src/main.jsx` — untouched Vite scaffold entry point

## Task 1: Scaffold the Vite React app

**Files:**
- Create: `account-explorer-react/` (via scaffolding command, not by hand)

- [ ] **Step 1: Scaffold**

Run:
```bash
cd /Users/luis/Documents/vscode/salesforce/Salesforce---VibeCoding
pnpm create vite account-explorer-react --template react
cd account-explorer-react
pnpm install
```
Expected: `account-explorer-react/` created with the standard Vite React template (`package.json`, `index.html`, `vite.config.js`, `src/main.jsx`, `src/App.jsx`, `src/App.css`, `src/index.css`), `node_modules` installed.

- [ ] **Step 2: Strip demo content**

Delete `account-explorer-react/src/assets/react.svg` and `account-explorer-react/public/vite.svg` (unused once the demo UI is replaced).

- [ ] **Step 3: Install and wire up Tailwind CSS v4**

Run:
```bash
cd account-explorer-react
pnpm add tailwindcss @tailwindcss/vite
```

Edit `account-explorer-react/vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Replace the entire contents of `account-explorer-react/src/index.css` with:
```css
@import "tailwindcss";
```

- [ ] **Step 4: Commit**

```bash
cd /Users/luis/Documents/vscode/salesforce/Salesforce---VibeCoding
git add account-explorer-react
git commit -m "chore: scaffold account-explorer-react with Vite + React + Tailwind"
```

## Task 2: Sample data JSON

**Files:**
- Create: `account-explorer-react/public/Account_Sample_Data.json`

- [ ] **Step 1: Write the data file**

```json
[
  { "Id": "a001", "Name": "Alux Studio", "Industry": "Design", "Phone": "+52 999 000 1001" },
  { "Id": "a002", "Name": "Cenote Systems", "Industry": "Technology", "Phone": "+52 999 000 1002" },
  { "Id": "a003", "Name": "Ceiba Market", "Industry": "Retail", "Phone": "+52 999 000 1003" },
  { "Id": "a004", "Name": "Henequen Works", "Industry": "Manufacturing", "Phone": "+52 999 000 1004" },
  { "Id": "a005", "Name": "Itza Logistics", "Industry": "Transportation", "Phone": "+52 999 000 1005" },
  { "Id": "a006", "Name": "Jade Health", "Industry": "Healthcare", "Phone": "+52 999 000 1006" },
  { "Id": "a007", "Name": "Kukulkan Learning", "Industry": "Education", "Phone": "+52 999 000 1007" },
  { "Id": "a008", "Name": "Maya Solar", "Industry": "Energy", "Phone": "+52 999 000 1008" }
]
```

`Id` is synthesized (the CSV has none) since the table needs a stable key, matching the `Id` field the LWC's Apex `SELECT` also returns.

- [ ] **Step 2: Verify it's valid JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('account-explorer-react/public/Account_Sample_Data.json'))" && echo OK`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add account-explorer-react/public/Account_Sample_Data.json
git commit -m "feat: add Account_Sample_Data.json mirroring accounts.csv"
```

## Task 3: Pure filter/sort/options utils (TDD)

**Files:**
- Create: `account-explorer-react/src/accountUtils.test.js`
- Create: `account-explorer-react/src/accountUtils.js`

- [ ] **Step 1: Write the failing test**

```javascript
// account-explorer-react/src/accountUtils.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterAccounts, sortAccounts, getIndustryOptions, ALL_INDUSTRIES } from './accountUtils.js';

const accounts = [
  { Id: 'a1', Name: 'Alux Studio', Industry: 'Design', Phone: '+52 999 000 1001' },
  { Id: 'a2', Name: 'Cenote Systems', Industry: 'Technology', Phone: '+52 999 000 1002' },
  { Id: 'a3', Name: 'Ceiba Market', Industry: 'Retail', Phone: '+52 999 000 1003' }
];

test('filterAccounts matches name case-insensitively', () => {
  const result = filterAccounts(accounts, 'ce', ALL_INDUSTRIES);
  assert.deepEqual(result.map((a) => a.Name), ['Cenote Systems', 'Ceiba Market']);
});

test('filterAccounts matches industry exactly', () => {
  const result = filterAccounts(accounts, '', 'Retail');
  assert.deepEqual(result.map((a) => a.Name), ['Ceiba Market']);
});

test('filterAccounts combines name and industry', () => {
  const result = filterAccounts(accounts, 'ce', 'Retail');
  assert.deepEqual(result.map((a) => a.Name), ['Ceiba Market']);
});

test('sortAccounts sorts ascending and descending', () => {
  const asc = sortAccounts(accounts, 'Name', 'asc').map((a) => a.Name);
  assert.deepEqual(asc, ['Alux Studio', 'Ceiba Market', 'Cenote Systems']);
  const desc = sortAccounts(accounts, 'Name', 'desc').map((a) => a.Name);
  assert.deepEqual(desc, ['Cenote Systems', 'Ceiba Market', 'Alux Studio']);
});

test('getIndustryOptions builds a sorted, deduped list with an All option first', () => {
  const options = getIndustryOptions(accounts);
  assert.deepEqual(options, [
    { label: 'All industries', value: ALL_INDUSTRIES },
    { label: 'Design', value: 'Design' },
    { label: 'Retail', value: 'Retail' },
    { label: 'Technology', value: 'Technology' }
  ]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd account-explorer-react && node --test src/accountUtils.test.js`
Expected: FAIL — `Cannot find module './accountUtils.js'`

- [ ] **Step 3: Write minimal implementation**

```javascript
// account-explorer-react/src/accountUtils.js
// Pure filter/sort/options helpers ported from the accountExplorer LWC
// (applyFilters / sortData / industryOptions in accountExplorer.js).
export const ALL_INDUSTRIES = '__ALL__';

export function filterAccounts(accounts, term, industry) {
  const needle = (term || '').trim().toLowerCase();
  return accounts.filter((account) => {
    const matchesName = !needle || (account.Name || '').toLowerCase().includes(needle);
    const matchesIndustry = industry === ALL_INDUSTRIES || account.Industry === industry;
    return matchesName && matchesIndustry;
  });
}

export function sortAccounts(accounts, field, direction) {
  const dir = direction === 'asc' ? 1 : -1;
  return [...accounts].sort((a, b) => {
    const valA = String(a[field] ?? '');
    const valB = String(b[field] ?? '');
    return valA.localeCompare(valB) * dir;
  });
}

export function getIndustryOptions(accounts) {
  const industries = new Set(accounts.map((a) => a.Industry).filter(Boolean));
  return [
    { label: 'All industries', value: ALL_INDUSTRIES },
    ...[...industries].sort().map((industry) => ({ label: industry, value: industry }))
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/accountUtils.test.js`
Expected: PASS — 5 tests, 0 failures

- [ ] **Step 5: Commit**

```bash
git add account-explorer-react/src/accountUtils.js account-explorer-react/src/accountUtils.test.js
git commit -m "feat: add pure filter/sort/industry-options utils with tests"
```

## Task 4: AccountExplorer component

**Files:**
- Create: `account-explorer-react/src/AccountExplorer.jsx`

- [ ] **Step 1: Write the component**

```jsx
// account-explorer-react/src/AccountExplorer.jsx
import { useEffect, useMemo, useState } from 'react';
import { ALL_INDUSTRIES, filterAccounts, sortAccounts, getIndustryOptions } from './accountUtils';

export default function AccountExplorer() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [allAccounts, setAllAccounts] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState(ALL_INDUSTRIES);
  const [sortBy, setSortBy] = useState('Name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    fetch('/Account_Sample_Data.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load accounts (${res.status})`);
        return res.json();
      })
      .then(setAllAccounts)
      .catch((error) => {
        setHasError(true);
        setErrorMessage(error.message || 'An error occurred while loading accounts.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const industryOptions = useMemo(() => getIndustryOptions(allAccounts), [allAccounts]);

  const filteredAccounts = useMemo(() => {
    const filtered = filterAccounts(allAccounts, searchTerm, selectedIndustry);
    return sortAccounts(filtered, sortBy, sortDirection);
  }, [allAccounts, searchTerm, selectedIndustry, sortBy, sortDirection]);

  const hasResults = filteredAccounts.length > 0;
  const showEmptyState = !isLoading && !hasError && !hasResults;

  function handleSort(field) {
    if (field === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  }

  function sortIndicator(field) {
    if (field !== sortBy) return '';
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  }

  const thClass = 'cursor-pointer select-none px-3 py-2.5 text-left text-neutral-700 sticky top-0 bg-white';
  const inputClass = 'rounded border border-neutral-300 px-2 py-1.5 text-sm';

  return (
    <div className="mx-auto my-8 max-w-3xl rounded border border-neutral-300 bg-white text-left font-sans shadow">
      <div className="flex items-center gap-2 border-b border-neutral-300 px-4 py-3">
        <span aria-hidden="true">🏢</span>
        <h2 className="m-0 text-lg font-semibold">Account Explorer</h2>
      </div>

      <div className="flex flex-wrap gap-4 border-b border-neutral-300 bg-neutral-50 px-4 py-3">
        <div className="flex flex-1 basis-60 flex-col gap-1">
          <label htmlFor="search-input" className="text-xs font-semibold text-neutral-600">
            Search by name
          </label>
          <input
            id="search-input"
            type="search"
            className={inputClass}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-1 basis-60 flex-col gap-1">
          <label htmlFor="industry-select" className="text-xs font-semibold text-neutral-600">
            Industry
          </label>
          <select
            id="industry-select"
            className={inputClass}
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
          >
            {industryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center p-8">
          <span
            role="status"
            aria-label="Loading accounts"
            className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-blue-600"
          />
        </div>
      )}

      {hasError && (
        <div className="flex flex-col items-center p-8 text-center">
          <p className="text-red-700">{errorMessage}</p>
        </div>
      )}

      {showEmptyState && (
        <div className="flex flex-col items-center p-8 text-center">
          <p className="text-neutral-500">No accounts match your search.</p>
        </div>
      )}

      {hasResults && (
        <>
          <div className={`px-4 ${isExpanded ? '' : 'max-h-96 overflow-y-auto'}`}>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {['Name', 'Industry', 'Phone'].map((field) => (
                    <th key={field} className={thClass} onClick={() => handleSort(field)}>
                      {field}
                      {sortIndicator(field)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <tr key={account.Id} className="border-b border-neutral-200">
                    <td className="px-3 py-2.5">{account.Name}</td>
                    <td className="px-3 py-2.5">{account.Industry}</td>
                    <td className="px-3 py-2.5">{account.Phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 pb-4 pt-2 text-center">
            <button
              type="button"
              aria-expanded={isExpanded}
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded border border-neutral-300 bg-white px-4 py-1.5 text-sm hover:bg-neutral-100"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add account-explorer-react/src/AccountExplorer.jsx
git commit -m "feat: add AccountExplorer component styled with Tailwind"
```

## Task 5: Wire into the app

**Files:**
- Modify: `account-explorer-react/src/App.jsx`

- [ ] **Step 1: Replace the scaffold App**

```jsx
// account-explorer-react/src/App.jsx
import AccountExplorer from './AccountExplorer';

export default function App() {
  return <AccountExplorer />;
}
```

Delete `account-explorer-react/src/App.css` (the scaffold's demo styling; Tailwind utility classes on `AccountExplorer.jsx` now own all the visuals) — it's unused once `App.jsx` no longer imports it.

- [ ] **Step 2: Commit**

```bash
git add account-explorer-react/src/App.jsx
git rm -f account-explorer-react/src/App.css 2>/dev/null || true
git commit -m "feat: render AccountExplorer from App"
```

## Task 6: Verify end-to-end

**Files:** none (verification only)

- [ ] **Step 1: Run the unit tests**

Run: `cd account-explorer-react && node --test src`
Expected: PASS — all 5 tests green

- [ ] **Step 2: Run the dev server and check in the browser**

Run: `pnpm dev` (in `account-explorer-react/`)
Then open the printed local URL and confirm:
- The 8 sample accounts render in a table on load (loading spinner flashes briefly first)
- Typing in "Search by name" filters rows live
- Picking an industry from the dropdown filters rows
- Clicking a column header toggles sort direction (▲/▼ indicator updates)
- "Show more"/"Show less" toggles the table's height cap

- [ ] **Step 3: Production build sanity check**

Run: `pnpm build` (in `account-explorer-react/`)
Expected: builds without errors into `account-explorer-react/dist/`

## Task 7: READMEs

**Files:**
- Create: `account-explorer-react/README.md`
- Modify: `README.md` (repo root)

- [ ] **Step 1: Write the account-explorer-react README**

```markdown
# Account Explorer (React)

A React port of the Salesforce `accountExplorer` Lightning Web Component (see [../account-explorer-dx](../account-explorer-dx/)) — same search/filter/sort/loading/error/empty-state behavior, running as a standalone web app against static sample data instead of a Salesforce org.

## Tech Stack

- React 18 (JavaScript)
- Vite
- Tailwind CSS v4
- pnpm
- Node's built-in test runner (`node:test`) for the filter/sort/industry-options logic

## Setup

\`\`\`bash
pnpm install
\`\`\`

## Run (development)

\`\`\`bash
pnpm dev
\`\`\`

Open the printed local URL in your browser.

## Run the unit tests

\`\`\`bash
node --test src
\`\`\`

## Build for production

\`\`\`bash
pnpm build
\`\`\`

Output goes to `dist/`.

## Project Structure

- `public/Account_Sample_Data.json` — sample account data (mirrors `../account-explorer-dx/accounts.csv`), fetched at runtime
- `src/accountUtils.js` — pure filter/sort/industry-options logic, ported from the LWC's `applyFilters`/`sortData`
- `src/accountUtils.test.js` — unit tests for the above
- `src/AccountExplorer.jsx` — the component (fetch, state, render), styled with Tailwind utility classes
- `src/App.jsx` — renders `<AccountExplorer />`

## How AI Was Used

This app was scaffolded and implemented with Claude Code from a written plan (see [../docs/superpowers/plans/2026-08-23-account-explorer-react.md](../docs/superpowers/plans/2026-08-23-account-explorer-react.md)), which was reviewed before implementation. The filter/sort logic was ported test-first (failing test → implementation → passing test) directly from the original LWC's JavaScript.
```

- [ ] **Step 2: Replace the repo-root README**

The current root `README.md` is a one-line title placeholder. Replace its entire contents with:

```markdown
# Salesforce Account Explorer — VibeCoding

Two versions of the same "Account Explorer" app, built to compare a native Salesforce UI against a plain web stack.

## Projects

### [account-explorer-dx](account-explorer-dx/) — Lightning Web Component (Salesforce DX)

The original: an `accountExplorer` LWC backed by an Apex controller (`AccountExplorerController`), querying real `Account` records from a Salesforce org. Search, filter by industry, sortable table, loading/error/empty states. See [account-explorer-dx/README.md](account-explorer-dx/README.md) for org setup and deployment.

### [account-explorer-react](account-explorer-react/) — React port

A framework-agnostic port of the same UI and behavior, built with React + Vite + Tailwind CSS and pnpm. Reads from a static `Account_Sample_Data.json` (mirroring `account-explorer-dx/accounts.csv`) instead of an Apex call, so it runs standalone with no Salesforce org required. See [account-explorer-react/README.md](account-explorer-react/README.md) for setup and run instructions.

## How AI Was Used

Both the implementation plan and the code for `account-explorer-react` were produced with Claude Code:
- The LWC's JS/HTML/CSS/Apex were read and analyzed to extract the exact filter/sort/state-machine behavior to replicate.
- A written, reviewable implementation plan (`docs/superpowers/plans/2026-08-23-account-explorer-react.md`) was drafted before any code, breaking the port into small, testable tasks (TDD for the filter/sort logic, then the component, then styling, then verification).
- The plan and generated code were reviewed and adjusted interactively (e.g., switching styling to Tailwind CSS) before being applied.
```

- [ ] **Step 3: Commit**

```bash
cd /Users/luis/Documents/vscode/salesforce/Salesforce---VibeCoding
git add README.md account-explorer-react/README.md
git commit -m "docs: add root and account-explorer-react READMEs"
```

## Self-Review Notes

- **Spec coverage:** JS + pnpm ✅ (Task 1), replicates LWC's search/filter/sort/loading/error/empty/expand behavior ✅ (Task 4), lives in `account-explorer-react/` ✅ (Task 1), `Account_Sample_Data.json` mirroring `accounts.csv` ✅ (Task 2), per-project README with setup/run instructions ✅ (Task 7 Step 1), root README describing both project versions with links and an AI-usage section ✅ (Task 7 Step 2).
- **Placeholder scan:** none — every step has runnable code/commands.
- **Tailwind:** added per explicit user request (v4 via `@tailwindcss/vite`, no config file needed); component uses utility classes directly instead of a separate CSS file.
- **Type/name consistency:** `ALL_INDUSTRIES`, `filterAccounts`, `sortAccounts`, `getIndustryOptions` are defined once in Task 3 and used with identical names/signatures in Task 4's component — verified consistent.
