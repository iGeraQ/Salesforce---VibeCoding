/**
 * Controller backing the accountExplorer LWC.
 * Read-only, cacheable list load; search/filter/sort happen client-side.
 */
public with sharing class AccountExplorerController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [
            SELECT Id, Name, Industry, Phone
            FROM Account
            WITH USER_MODE
            ORDER BY Name ASC
            LIMIT 200
        ];
    }
}
