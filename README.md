# Salesforce Account Explorer — VibeCoding

**Account Explorer** is a small app that lists Accounts and lets you search by name, filter by industry, and sort — with three explicit UI states (loading, empty, error). This repository holds **two implementations of the exact same app**, built to compare a native Salesforce UI against a plain web stack:

- a **Lightning Web Component + Apex** version that runs inside a Salesforce org, and
- a **React** port that runs standalone in the browser against static sample data.

Both share the same behavior and filter/sort/state-machine logic. The point of the repo is the comparison: how the same feature looks and is built on each platform, and how much of the work an AI coding agent (Claude Code) can do end-to-end — from scaffolding through review, iteration, testing, and cleanup.

## Projects

### [account-explorer-dx](account-explorer-dx/) — Lightning Web Component (Salesforce DX)

The original: an `accountExplorer` LWC backed by an Apex controller (`AccountExplorerController`), querying real `Account` records from a Salesforce org. Search, filter by industry, sortable table, loading/error/empty states, client-side search/filter/sort, and a height-capped table with an expand toggle. Covered by Jest (LWC) and Apex unit tests. See [account-explorer-dx/README.md](account-explorer-dx/README.md).

### [account-explorer-react](account-explorer-react/) — React port

A framework-agnostic port of the same UI and behavior, built with React + Vite + Tailwind CSS and pnpm. Reads from a static `Account_Sample_Data.json` (mirroring `account-explorer-dx/accounts.csv`) instead of an Apex call, so it runs standalone with no Salesforce org required. See [account-explorer-react/README.md](account-explorer-react/README.md).

## Getting Started

Clone the monorepo once, then follow whichever version's own Getting Started section you want to run:

```bash
git clone https://github.com/iGeraQ/Salesforce---VibeCoding.git
cd Salesforce---VibeCoding
```

- **LWC version** (needs a Salesforce org) — [account-explorer-dx/README.md § Getting Started](account-explorer-dx/README.md#getting-started)
- **React version** (no org required, runs standalone) — [account-explorer-react/README.md § Getting Started](account-explorer-react/README.md#getting-started)

## Submission Evidence

Screenshots documenting the build and both running apps live in the [`img/`](img/) folder.

| # | Screenshot | What it shows |
|---|------------|---------------|
| 1 | [01_account_badges.jpeg](img/01_account_badges.jpeg) | Trailhead / Trailblazer profile with Salesforce badges. |
| 2 | [02_lwc_deploy.jpeg](img/02_lwc_deploy.jpeg) | `sf project deploy start` pushing the Apex classes and `accountExplorer` LWC bundle to the org. |
| 3 | [03_account_query.jpeg](img/03_account_query.jpeg) | Deploy result plus `sf org display` confirming the connected org. |
| 4 | [04_example_lwc.jpeg](img/04_example_lwc.jpeg) | The Account Explorer LWC running on a Lightning page — table, name search, industry filter, "Show more". |
| 5 | [05_example_react.jpeg](img/05_example_react.jpeg) | The React port running standalone with search, industry, and phone columns. |
| 6 | [06_use_account_json.jpeg](img/06_use_account_json.jpeg) | `AccountExplorer.jsx` fetching the static `Account_Sample_Data.json` instead of Apex. |

## How AI Was Used

Both apps were built with **Claude Code** (Anthropic's CLI coding agent). The LWC/Apex version was scaffolded and iterated interactively; the React version was ported from a written, reviewed plan ([docs/superpowers/plans/2026-08-23-account-explorer-react.md](docs/superpowers/plans/2026-08-23-account-explorer-react.md)). Work was verified by running the actual tests and deploying to a live org — not assumed.

### Short AI work log

| Tool | Important prompt | Problem | Verification / correction |
|------|------------------|---------|---------------------------|
| Claude Code | "Create a Salesforce LWC `accountExplorer` plus its Apex controller…" | Initial scaffold — controller, LWC, meta files. | Wrote and ran Jest (10/10) and Apex tests (4/4 on a live org). |
| Claude Code (review subagent) | "/requesting-code-review" | Reviewer flagged the SOQL enforced record sharing but not field-level security. | Added `WITH USER_MODE` to the query; re-reviewed. |
| Claude Code | "improve the UI, add CSS styles" → "table shouldn't overflow" → "add an expand button" | `slds-gutters` negative margins bled the filter-bar background past the card; a follow-up `overflow-x:hidden` then clipped the combobox dropdown. | Split a padded outer div from the negative-margin inner grid; removed the `overflow-x` clip once the structural fix held. |
| Claude Code | "add clean code principles… error handling" | Wrapping the query in try/catch left the catch block uncovered → deploy failed at 50% Apex coverage. | Added a test that runs as a minimum-access user to exercise the catch, restoring coverage; also caught a `bulk` reserved-keyword compile error earlier. |
| Claude Code | "clean comments that don't add context" | Comments restated the code instead of explaining intent. | Removed section-label/how-comments; kept only business-logic rationale. |
| Claude Code | "port to React" (from the written plan) | Replicate the LWC's exact filter/sort/state behavior without an org. | Ported the filter/sort logic test-first (`node:test`), then verified search/filter/sort/expand in-browser. |
