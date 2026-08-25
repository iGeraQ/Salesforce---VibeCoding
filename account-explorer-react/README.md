# Account Explorer (React)

A standalone web app containing **Account Explorer**, built with React + Vite + Tailwind CSS — it lists, searches, filters, and sorts Accounts, with all search/filter/sort logic running client-side. Instead of an Apex call it reads from a static `Account_Sample_Data.json`, so it runs with no Salesforce org required.

This is one of two Account Explorer implementations in this repo — the sibling `account-explorer-dx` folder holds the Salesforce-native (LWC + Apex) version of the same idea. This folder is the framework-agnostic React port.

## Getting Started

1. **Clone the repo** (this project lives in a subfolder of a larger monorepo):

   ```bash
   git clone https://github.com/iGeraQ/Salesforce---VibeCoding.git
   cd Salesforce---VibeCoding/account-explorer-react
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Run it (development):**

   ```bash
   pnpm dev
   ```

   Open the printed local URL in your browser. No Salesforce org needed — it reads from the static `Account_Sample_Data.json` in `public/`.

4. **Run the unit tests:**

   ```bash
   node --test
   ```

5. **Build for production:**

   ```bash
   pnpm build
   ```

   Output goes to `dist/`.

## Project Structure

```
account-explorer-react/
├── public/
│   └── Account_Sample_Data.json   # sample data (mirrors ../account-explorer-dx/accounts.csv), fetched at runtime
├── src/
│   ├── accountUtils.js            # pure filter/sort/industry-options logic, ported from the LWC
│   ├── accountUtils.test.js       # unit tests for the above (node:test)
│   ├── AccountExplorer.jsx        # the component: fetch, state, render (Tailwind styling)
│   └── App.jsx                    # renders <AccountExplorer />
├── index.html                    # Vite entry point
├── vite.config.js                # Vite + Tailwind config
└── package.json                  # scripts (dev, build, preview)
```

## Prerequisites

Before you start, make sure you have:

- **Node.js** (v18+) - Download from [nodejs.org](https://nodejs.org).
- **pnpm** - Install with `npm install -g pnpm`, or see [pnpm.io/installation](https://pnpm.io/installation).

## Common Commands

Here are the commands you'll use the most:

- `pnpm install`: Install dependencies
- `pnpm dev`: Start the Vite dev server
- `pnpm build`: Build for production into `dist/`
- `pnpm preview`: Serve the production build locally
- `node --test`: Run the unit tests

## Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vite.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [pnpm Documentation](https://pnpm.io/motivation)
