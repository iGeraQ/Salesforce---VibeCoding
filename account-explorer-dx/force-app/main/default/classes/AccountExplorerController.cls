/**
 * Controller backing the accountExplorer LWC.
 * Read-only, cacheable list load; search/filter/sort happen client-side.
 */
public with sharing class AccountExplorerController {
    private static final Integer MAX_RESULTS = 200;

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        try {
            return [
                SELECT Id, Name, Industry, Phone
                FROM Account
                WITH USER_MODE
                ORDER BY Name ASC
                LIMIT :MAX_RESULTS
            ];
        } catch (Exception e) {
            System.debug(LoggingLevel.ERROR, 'AccountExplorerController.getAccounts failed: ' + e);

            String errormessage = 'Unable to load accounts. Please try again or contact your administrator.';
            AuraHandledException ex = new AuraHandledException(errormessage);
            ex.setMessage(errormessage);
            throw ex;
        }
    }
}
