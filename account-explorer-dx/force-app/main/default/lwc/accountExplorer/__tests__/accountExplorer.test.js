import { createElement } from 'lwc';
import AccountExplorer from 'c/accountExplorer';
import getAccounts from '@salesforce/apex/AccountExplorerController.getAccounts';

jest.mock(
    '@salesforce/apex/AccountExplorerController.getAccounts',
    () => ({ default: jest.fn() }),
    { virtual: true }
);

const MOCK_ACCOUNTS = [
    { Id: '001A', Name: 'Acme Inc', Industry: 'Technology', Phone: '111' },
    { Id: '001B', Name: 'Beta LLC', Industry: 'Finance', Phone: '222' },
    { Id: '001C', Name: 'Gamma Corp', Industry: 'Technology', Phone: '333' }
];

function flushPromises() {
    return new Promise((resolve) => setTimeout(resolve));
}

function createComponent() {
    const element = createElement('c-account-explorer', { is: AccountExplorer });
    document.body.appendChild(element);
    return element;
}

afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
});

describe('c-account-explorer', () => {
    it('shows the spinner while the Apex call is in flight', () => {
        getAccounts.mockResolvedValue(MOCK_ACCOUNTS);
        const element = createComponent();

        expect(element.shadowRoot.querySelector('lightning-spinner')).not.toBeNull();
        expect(element.shadowRoot.querySelector('lightning-datatable')).toBeNull();
    });

    it('renders the loaded accounts in the datatable once the call resolves', async () => {
        getAccounts.mockResolvedValue(MOCK_ACCOUNTS);
        const element = createComponent();
        await flushPromises();

        expect(element.shadowRoot.querySelector('lightning-spinner')).toBeNull();
        const datatable = element.shadowRoot.querySelector('lightning-datatable');
        expect(datatable).not.toBeNull();
        expect(datatable.data).toHaveLength(3);
    });

    it('shows the error message and no table when the Apex call fails', async () => {
        getAccounts.mockRejectedValue({ body: { message: 'Insufficient access' } });
        const element = createComponent();
        await flushPromises();

        expect(element.shadowRoot.querySelector('lightning-spinner')).toBeNull();
        expect(element.shadowRoot.querySelector('lightning-datatable')).toBeNull();
        const error = element.shadowRoot.querySelector('.slds-text-color_error');
        expect(error.textContent).toBe('Insufficient access');
    });

    it('falls back to a generic error message when the Apex error has no body', async () => {
        getAccounts.mockRejectedValue(new Error('network down'));
        const element = createComponent();
        await flushPromises();

        const error = element.shadowRoot.querySelector('.slds-text-color_error');
        expect(error.textContent).toBe('An error occurred while loading accounts.');
    });

    it('filters by name case-insensitively without mutating the source data', async () => {
        getAccounts.mockResolvedValue(MOCK_ACCOUNTS);
        const element = createComponent();
        await flushPromises();

        const searchInput = element.shadowRoot.querySelector('lightning-input');
        searchInput.value = 'gamma';
        searchInput.dispatchEvent(new CustomEvent('change'));
        await flushPromises();

        const datatable = element.shadowRoot.querySelector('lightning-datatable');
        expect(datatable.data).toHaveLength(1);
        expect(datatable.data[0].Name).toBe('Gamma Corp');
        expect(MOCK_ACCOUNTS).toHaveLength(3); // source array untouched by the filter
    });

    it('shows the empty state when no account matches the search', async () => {
        getAccounts.mockResolvedValue(MOCK_ACCOUNTS);
        const element = createComponent();
        await flushPromises();

        const searchInput = element.shadowRoot.querySelector('lightning-input');
        searchInput.value = 'no-such-account';
        searchInput.dispatchEvent(new CustomEvent('change'));
        await flushPromises();

        expect(element.shadowRoot.querySelector('lightning-datatable')).toBeNull();
        expect(element.shadowRoot.textContent).toContain('No accounts match your search');
    });

    it('builds industry options dynamically from the loaded data, with an All industries option', async () => {
        getAccounts.mockResolvedValue(MOCK_ACCOUNTS);
        const element = createComponent();
        await flushPromises();

        const combobox = element.shadowRoot.querySelector('lightning-combobox');
        expect(combobox.options).toEqual([
            { label: 'All industries', value: '__ALL__' },
            { label: 'Finance', value: 'Finance' },
            { label: 'Technology', value: 'Technology' }
        ]);
    });

    it('combines the search term and industry filter', async () => {
        getAccounts.mockResolvedValue(MOCK_ACCOUNTS);
        const element = createComponent();
        await flushPromises();

        const searchInput = element.shadowRoot.querySelector('lightning-input');
        searchInput.value = 'a'; // matches Acme Inc and Gamma Corp by name
        searchInput.dispatchEvent(new CustomEvent('change'));

        const combobox = element.shadowRoot.querySelector('lightning-combobox');
        combobox.dispatchEvent(new CustomEvent('change', { detail: { value: 'Technology' } }));
        await flushPromises();

        const datatable = element.shadowRoot.querySelector('lightning-datatable');
        expect(datatable.data.map((acc) => acc.Name).sort()).toEqual(['Acme Inc', 'Gamma Corp']);
    });

    it('re-sorts the filtered rows when the datatable fires onsort', async () => {
        getAccounts.mockResolvedValue(MOCK_ACCOUNTS);
        const element = createComponent();
        await flushPromises();

        const datatable = element.shadowRoot.querySelector('lightning-datatable');
        datatable.dispatchEvent(
            new CustomEvent('sort', { detail: { fieldName: 'Name', sortDirection: 'desc' } })
        );
        await flushPromises();

        expect(datatable.sortedBy).toBe('Name');
        expect(datatable.sortedDirection).toBe('desc');
        expect(datatable.data[0].Name).toBe('Gamma Corp');
    });

    it('toggles the expand button label and aria-expanded state on click', async () => {
        getAccounts.mockResolvedValue(MOCK_ACCOUNTS);
        const element = createComponent();
        await flushPromises();

        const button = element.shadowRoot.querySelector('lightning-button');
        expect(button.label).toBe('Show more');
        expect(button.getAttribute('aria-expanded')).toBe('false');

        button.click();
        await flushPromises();

        expect(button.label).toBe('Show less');
        expect(button.getAttribute('aria-expanded')).toBe('true');
    });
});
