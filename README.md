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
