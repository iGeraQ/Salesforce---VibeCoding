// Pure filter/sort/options helpers ported from the accountExplorer LWC
// (applyFilters / sortData / industryOptions in accountExplorer.js).
export const ALL_INDUSTRIES = '__ALL__';

export function filterAccounts(accounts, term, industry) {
  const needle = (term || '').trim().toLowerCase();
  return accounts.filter((account) => {
    const matchesName = !needle || (account.Name || '').toLowerCase().includes(needle);
    const matchesIndustry = industry === ALL_INDUSTRIES || account.Industry === industry;
    return matchesName && matchesIndustry;
  });
}

export function sortAccounts(accounts, field, direction) {
  const dir = direction === 'asc' ? 1 : -1;
  return [...accounts].sort((a, b) => {
    const valA = String(a[field] ?? '');
    const valB = String(b[field] ?? '');
    return valA.localeCompare(valB) * dir;
  });
}

export function getIndustryOptions(accounts) {
  const industries = new Set(accounts.map((a) => a.Industry).filter(Boolean));
  return [
    { label: 'All industries', value: ALL_INDUSTRIES },
    ...[...industries].sort().map((industry) => ({ label: industry, value: industry }))
  ];
}

// Color-codes the Industry column like Notion's tinted database properties.
// Fixed lookup (not a hash) since the sample dataset has a known, small set of industries.
const INDUSTRY_TAGS = {
  Design: { bg: 'bg-tint-lavender', text: 'text-tag-purple' },
  Technology: { bg: 'bg-tint-sky', text: 'text-tag-blue' },
  Retail: { bg: 'bg-tint-peach', text: 'text-tag-orange' },
  Manufacturing: { bg: 'bg-tint-mint', text: 'text-tag-green' },
  Transportation: { bg: 'bg-tint-rose', text: 'text-tag-pink' },
  Healthcare: { bg: 'bg-tint-yellow', text: 'text-tag-brown' },
  Education: { bg: 'bg-tint-cream', text: 'text-charcoal' },
  Energy: { bg: 'bg-tint-gray', text: 'text-steel' }
};
const DEFAULT_INDUSTRY_TAG = { bg: 'bg-tint-gray', text: 'text-steel' };

export function getIndustryTag(industry) {
  return INDUSTRY_TAGS[industry] || DEFAULT_INDUSTRY_TAG;
}
