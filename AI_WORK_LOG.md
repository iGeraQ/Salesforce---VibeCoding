# AI Work Log

**Tool:** [Claude Code](https://claude.com/claude-code) (Anthropic's CLI coding agent) was used to build both apps — the LWC/Apex version interactively, the React port from a written, reviewed plan.

Each entry below is one important prompt, a problem it caused, and how I checked or fixed it. No full transcripts.

| Important prompt | Problem it caused | How I checked / fixed it |
|------------------|-------------------|--------------------------|
| "Create a Salesforce LWC `accountExplorer` plus its Apex controller…" | First draft had no field-level security — the SOQL enforced record sharing (`with sharing`) but any user could still read `Industry`/`Phone`. | A code review flagged it; added `WITH USER_MODE` to the query and re-reviewed. |
| "improve the UI, add CSS styles" → "table shouldn't overflow" → "add an expand button" | The `slds-gutters` negative margins bled the filter-bar background past the card; a follow-up `overflow-x:hidden` then clipped the industry dropdown. | Split a padded outer div from the negative-margin inner grid, and removed the `overflow-x` clip once the structural fix held. Verified in the browser. |
| "add clean code principles… error handling" | Wrapping the query in `try/catch` left the catch block untested → the deploy failed at 50% Apex coverage (75% required). | Added a test that runs as a minimum-access user to exercise the catch block; re-deployed to a live org — 4/4 tests passing, coverage restored. |
| "add tests for the component and class" | An Apex test variable named `bulk` wouldn't compile — `bulk` is a reserved keyword. | The deploy error pointed at it; renamed to `extraAccounts` and re-ran. Jest: 10/10, Apex: 4/4. |
| "port to React" (from the written plan) | Needed to replicate the LWC's exact filter/sort/state behavior without a Salesforce org. | Ported the filter/sort logic test-first (`node:test`), reading from a static `Account_Sample_Data.json`; verified search/filter/sort in the browser. |

All results were verified by actually running the tests (`npm run test:unit`, `sf apex run test`, `node --test`) and deploying to a live org not assumed.
