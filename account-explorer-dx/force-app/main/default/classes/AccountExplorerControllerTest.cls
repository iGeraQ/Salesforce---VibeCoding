@isTest
private class AccountExplorerControllerTest {
    @TestSetup
    static void setup() {
        insert new List<Account>{
            new Account(Name = 'Gamma Corp', Industry = 'Technology', Phone = '333'),
            new Account(Name = 'Acme Inc', Industry = 'Technology', Phone = '111'),
            new Account(Name = 'Beta LLC', Industry = 'Finance', Phone = '222')
        };
    }

    @isTest
    static void returnsAccountsOrderedByNameAscending() {
        Test.startTest();
        List<Account> results = AccountExplorerController.getAccounts();
        Test.stopTest();

        System.assertEquals(3, results.size(), 'Expected all three test accounts to be returned');
        System.assertEquals('Acme Inc', results[0].Name);
        System.assertEquals('Beta LLC', results[1].Name);
        System.assertEquals('Gamma Corp', results[2].Name);
    }

    @isTest
    static void returnsTheFieldsTheComponentNeeds() {
        Test.startTest();
        List<Account> results = AccountExplorerController.getAccounts();
        Test.stopTest();

        Account first = results[0];
        System.assertNotEquals(null, first.Id, 'Id should be populated');
        System.assertNotEquals(null, first.Name, 'Name should be populated');
        System.assertNotEquals(null, first.Industry, 'Industry should be populated');
        System.assertNotEquals(null, first.Phone, 'Phone should be populated');
    }

    @isTest
    static void capsResultsAtTwoHundredRows() {
        List<Account> extraAccounts = new List<Account>();
        for (Integer i = 0; i < 250; i++) {
            extraAccounts.add(new Account(Name = 'Bulk Account ' + i));
        }
        insert extraAccounts;

        Test.startTest();
        List<Account> results = AccountExplorerController.getAccounts();
        Test.stopTest();

        System.assertEquals(200, results.size(), 'Query should cap at the 200-row LIMIT');
    }

    @isTest
    static void throwsAuraHandledExceptionWhenUserLacksAccountAccess() {
        // "Minimum Access - Salesforce" has no object permissions on Account, so
        // WITH USER_MODE rejects the query and the catch block in getAccounts()
        // must translate that into a friendly AuraHandledException for the LWC.
        Profile minimalProfile = [SELECT Id FROM Profile WHERE Name = 'Minimum Access - Salesforce' LIMIT 1];
        User restrictedUser = new User(
            FirstName = 'Restricted',
            LastName = 'Tester',
            Alias = 'rtestr',
            Email = 'restricted.tester@example.com.invalid',
            Username = 'restricted.tester.' + DateTime.now().getTime() + '@example.com.invalid',
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            ProfileId = minimalProfile.Id
        );
        insert restrictedUser;

        System.runAs(restrictedUser) {
            Boolean exceptionThrown = false;

            Test.startTest();
            try {
                AccountExplorerController.getAccounts();
            } catch (AuraHandledException e) {
                exceptionThrown = true;
                System.assertEquals(
                    'Unable to load accounts. Please try again or contact your administrator.',
                    e.getMessage()
                );
            }
            Test.stopTest();

            System.assert(exceptionThrown, 'Expected an AuraHandledException when the user lacks Account access');
        }
    }
}
