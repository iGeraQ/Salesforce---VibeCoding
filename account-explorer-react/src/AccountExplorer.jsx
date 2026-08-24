import { useEffect, useMemo, useState } from 'react';
import { ALL_INDUSTRIES, filterAccounts, sortAccounts, getIndustryOptions, getIndustryTag } from './accountUtils';

export default function AccountExplorer() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [allAccounts, setAllAccounts] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState(ALL_INDUSTRIES);
  const [sortBy, setSortBy] = useState('Name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    fetch('/Account_Sample_Data.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load accounts (${res.status})`);
        return res.json();
      })
      .then(setAllAccounts)
      .catch((error) => {
        setHasError(true);
        setErrorMessage(error.message || 'An error occurred while loading accounts.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const industryOptions = useMemo(() => getIndustryOptions(allAccounts), [allAccounts]);

  const filteredAccounts = useMemo(() => {
    const filtered = filterAccounts(allAccounts, searchTerm, selectedIndustry);
    return sortAccounts(filtered, sortBy, sortDirection);
  }, [allAccounts, searchTerm, selectedIndustry, sortBy, sortDirection]);

  const hasResults = filteredAccounts.length > 0;
  const showEmptyState = !isLoading && !hasError && !hasResults;

  function handleSort(field) {
    if (field === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  }

  function sortIndicator(field) {
    if (field !== sortBy) return '';
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  }

  const thClass = 'cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-steel sticky top-0 bg-white';
  const inputClass =
    'rounded-lg border border-hairline-strong bg-white px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';

  return (
    <div className="overflow-hidden rounded-xl border border-hairline bg-white text-left font-sans shadow-sm">
      <div className="flex flex-wrap gap-4 border-b border-hairline bg-surface-soft px-5 py-4">
        <div className="flex flex-1 basis-60 flex-col gap-1">
          <label htmlFor="search-input" className="text-xs font-semibold text-steel">
            Search by name
          </label>
          <input
            id="search-input"
            type="search"
            className={inputClass}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-1 basis-60 flex-col gap-1">
          <label htmlFor="industry-select" className="text-xs font-semibold text-steel">
            Industry
          </label>
          <select
            id="industry-select"
            className={inputClass}
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
          >
            {industryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center p-10">
          <span
            role="status"
            aria-label="Loading accounts"
            className="h-8 w-8 animate-spin rounded-full border-4 border-hairline border-t-primary"
          />
        </div>
      )}

      {hasError && (
        <div className="flex flex-col items-center p-10 text-center">
          <p className="text-error">{errorMessage}</p>
        </div>
      )}

      {showEmptyState && (
        <div className="flex flex-col items-center p-10 text-center">
          <p className="text-stone">No accounts match your search.</p>
        </div>
      )}

      {hasResults && (
        <>
          <div className={`overflow-x-auto ${isExpanded ? '' : 'max-h-96 overflow-y-auto'}`}>
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr>
                  {['Name', 'Industry', 'Phone'].map((field) => (
                    <th key={field} className={thClass} onClick={() => handleSort(field)}>
                      {field}
                      {sortIndicator(field)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => {
                  const tag = getIndustryTag(account.Industry);
                  return (
                    <tr key={account.Id} className="border-b border-hairline last:border-0 hover:bg-surface-soft">
                      <td className="px-4 py-3 font-medium text-ink">{account.Name}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${tag.bg} ${tag.text}`}>
                          {account.Industry}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-charcoal">{account.Phone}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-hairline px-5 py-3 text-center">
            <button
              type="button"
              aria-expanded={isExpanded}
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-lg border border-hairline-strong bg-white px-4 py-1.5 text-sm font-medium text-ink hover:bg-surface-soft"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
