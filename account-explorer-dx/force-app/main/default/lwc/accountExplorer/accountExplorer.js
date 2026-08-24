import { LightningElement } from 'lwc';
import getAccounts from '@salesforce/apex/AccountExplorerController.getAccounts';

const ALL_INDUSTRIES = '__ALL__';

export default class AccountExplorer extends LightningElement {
    isLoading = true;
    hasError = false;
    errorMessage = '';

    searchTerm = '';
    selectedIndustry = ALL_INDUSTRIES;

    // Full copy of server data (never mutated by filtering) + the filtered view shown in the table.
    allAccounts = [];
    filteredAccounts = [];

    sortBy = 'Name';
    sortDirection = 'asc';

    // Table starts height-capped (see CSS); this button lets the user expand it to full height.
    isExpanded = false;

    columns = [
        { label: 'Name', fieldName: 'Name', sortable: true },
        { label: 'Industry', fieldName: 'Industry', sortable: true },
        { label: 'Phone', fieldName: 'Phone', type: 'phone', sortable: true }
    ];

    connectedCallback() {
        this.loadAccounts();
    }

    // Imperative load (not @wire) so loading/error states are explicit and easy to reason about.
    loadAccounts() {
        this.isLoading = true;
        this.hasError = false;

        getAccounts()
            .then((data) => {
                this.allAccounts = data;
                this.applyFilters();
            })
            .catch((error) => {
                this.hasError = true;
                this.errorMessage =
                    error?.body?.message || 'An error occurred while loading accounts.';
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    handleSearchChange(event) {
        this.searchTerm = event.target.value;
        this.applyFilters();
    }

    handleIndustryChange(event) {
        this.selectedIndustry = event.detail.value;
        this.applyFilters();
    }

    toggleExpand() {
        this.isExpanded = !this.isExpanded;
    }

    handleSort(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData();
    }

    applyFilters() {
        const term = this.searchTerm.trim().toLowerCase();

        this.filteredAccounts = this.allAccounts.filter((account) => {
            const matchesName = !term || (account.Name || '').toLowerCase().includes(term);
            const matchesIndustry =
                this.selectedIndustry === ALL_INDUSTRIES ||
                account.Industry === this.selectedIndustry;
            return matchesName && matchesIndustry;
        });

        this.sortData();
    }

    sortData() {
        const field = this.sortBy;
        const direction = this.sortDirection === 'asc' ? 1 : -1;

        this.filteredAccounts = [...this.filteredAccounts].sort((a, b) => {
            const valA = String(a[field] ?? '');
            const valB = String(b[field] ?? '');
            return valA.localeCompare(valB) * direction;
        });
    }

    get industryOptions() {
        const industries = new Set(
            this.allAccounts.map((account) => account.Industry).filter((industry) => !!industry)
        );
        const options = [{ label: 'All industries', value: ALL_INDUSTRIES }];
        [...industries].sort().forEach((industry) => {
            options.push({ label: industry, value: industry });
        });
        return options;
    }

    get hasResults() {
        return this.filteredAccounts.length > 0;
    }

    get showEmptyState() {
        return !this.isLoading && !this.hasError && !this.hasResults;
    }

    get tableWrapperClass() {
        return this.isExpanded ? 'slds-p-around_medium table-wrapper is-expanded' : 'slds-p-around_medium table-wrapper';
    }

    get expandButtonLabel() {
        return this.isExpanded ? 'Show less' : 'Show more';
    }

    get ariaExpanded() {
        return String(this.isExpanded);
    }
}
