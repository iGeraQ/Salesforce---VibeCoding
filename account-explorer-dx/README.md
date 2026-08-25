# Account Explorer (Salesforce DX)

A Salesforce DX project containing **Account Explorer**, a Lightning Web Component that lists, searches, filters, and sorts Accounts — backed by a single cacheable Apex controller. All search/filter/sort logic runs client-side, so there are no extra server round-trips after the initial load.

This is one of two Account Explorer implementations in this repo — the sibling `account-explorer-react` folder holds a standalone React version of the same idea. This folder is the Salesforce-native (LWC + Apex) implementation.

## Getting Started

1. **Clone the repo** (this project lives in a subfolder of a larger monorepo):

   ```bash
   git clone https://github.com/iGeraQ/Salesforce---VibeCoding.git
   cd Salesforce---VibeCoding/account-explorer-dx
   ```

2. **Install dependencies** (needed for linting and running the LWC Jest tests):

   ```bash
   npm install
   ```

3. **Authorize an org** — either your own Developer Edition org or a scratch org via Dev Hub:

   ```bash
   sf org login web --alias myOrg --set-default
   ```

4. **Deploy the source** to your authorized org:

   ```bash
   sf project deploy start --source-dir force-app
   ```

5. **Add the component to a page.** In App Builder (or from Setup), drag **Account Explorer** onto an App Page, Record Page, or Home Page — it's exposed to all three (see `accountExplorer.js-meta.xml`).

6. **Run the tests:**

   ```bash
   # LWC unit tests (Jest)
   npm run test:unit

   # Apex tests, against your authorized org
   sf apex run test --tests AccountExplorerControllerTest --result-format human --synchronous
   ```

## Project Structure

```
account-explorer-dx/
├── force-app/main/default/
│   ├── classes/
│   │   ├── AccountExplorerController.cls          # @AuraEnabled(cacheable=true) getAccounts()
│   │   ├── AccountExplorerController.cls-meta.xml
│   │   ├── AccountExplorerControllerTest.cls       # Apex unit tests
│   │   └── AccountExplorerControllerTest.cls-meta.xml
│   └── lwc/accountExplorer/
│       ├── accountExplorer.js                      # component logic: load, search, filter, sort
│       ├── accountExplorer.html                    # template: filter bar + lightning-datatable
│       ├── accountExplorer.css                     # component-scoped styles
│       ├── accountExplorer.js-meta.xml              # exposure + page targets
│       └── __tests__/accountExplorer.test.js       # Jest unit tests
├── config/                 # scratch org definitions
├── scripts/                # sample Apex/SOQL scripts
├── manifest/package.xml    # metadata manifest
├── sfdx-project.json       # project manifest (package dirs, API version, etc.)
└── package.json            # npm scripts (lint, Jest, Prettier)
```

`force-app/main/default/` is the default package directory — everything Salesforce deploys lives under it. Additional package directories, if you add any, are configured in `sfdx-project.json`.

## Prerequisites

Before you start, make sure you have:

- **Salesforce CLI** - Download from [developer.salesforce.com/tools/salesforcecli](https://developer.salesforce.com/tools/salesforcecli). See [Install Salesforce CLI](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_install_cli.htm) for details.
- **Node.js + npm** - required to run the LWC Jest tests and linting (`npm install` above).
- **VS Code with Salesforce Extension Pack** - See [Installation Instructions](https://developer.salesforce.com/docs/platform/sfvscode-extensions/guide/install.html) for details. Includes the Agentforce Vibes extension.
- **A development org** - Sign up for a free Developer Edition org [here](https://developer.salesforce.com/signup).
- **Dev Hub enabled** (optional, required to create scratch orgs) - You can enable Dev Hub in your development org under Setup > Dev Hub. See [Provide Developers Access to Salesforce DX Tools](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_setup_dx_tools.htm).

## Common Salesforce CLI Commands

Here are common CLI commands that you'll use the most:

- `sf org login web`: Authorize an org
- `sf org open`: Open your org in a browser
- `sf org create scratch`: Create a scratch org
- `sf project deploy start`: Deploy metadata to your org
- `sf project retrieve start`: Retrieve metadata from your org
- `sf apex run test`: Run Apex tests
- `sf data <command>`: Work with test data
- `sf alias <command>`: Manage org aliases

## Additional Resources

- [Salesforce CLI Installation Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/)
- [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/)
- [Salesforce VS Code Extensions Documentation](https://developer.salesforce.com/tools/vscode/)
