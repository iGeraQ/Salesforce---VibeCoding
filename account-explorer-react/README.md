# Account Explorer (React)

A React port of the Salesforce `accountExplorer` Lightning Web Component (see [../account-explorer-dx](../account-explorer-dx/)) — same search/filter/sort/loading/error/empty-state behavior, running as a standalone web app against static sample data instead of a Salesforce org.

## Tech Stack

- React (JavaScript)
- Vite
- Tailwind CSS v4
- pnpm
- Node's built-in test runner (`node:test`) for the filter/sort/industry-options logic

## Setup

```bash
pnpm install
```

## Run (development)

```bash
pnpm dev
```

Open the printed local URL in your browser.

## Run the unit tests

```bash
node --test
```

## Build for production

```bash
pnpm build
```

Output goes to `dist/`.

## Project Structure

- `public/Account_Sample_Data.json` — sample account data (mirrors `../account-explorer-dx/accounts.csv`), fetched at runtime
- `src/accountUtils.js` — pure filter/sort/industry-options logic, ported from the LWC's `applyFilters`/`sortData`
- `src/accountUtils.test.js` — unit tests for the above
- `src/AccountExplorer.jsx` — the component (fetch, state, render), styled with Tailwind utility classes
- `src/App.jsx` — renders `<AccountExplorer />`

## How AI Was Used

This app was scaffolded and implemented with Claude Code from a written plan (see [../docs/superpowers/plans/2026-08-23-account-explorer-react.md](../docs/superpowers/plans/2026-08-23-account-explorer-react.md)), which was reviewed before implementation. The filter/sort logic was ported test-first (failing test → implementation → passing test) directly from the original LWC's JavaScript, and the running app was verified in-browser (search, filter, sort, expand/collapse) before being handed off for review.
