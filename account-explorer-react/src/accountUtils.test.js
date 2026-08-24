import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterAccounts, sortAccounts, getIndustryOptions, getIndustryTag, ALL_INDUSTRIES } from './accountUtils.js';

const accounts = [
  { Id: 'a1', Name: 'Alux Studio', Industry: 'Design', Phone: '+52 999 000 1001' },
  { Id: 'a2', Name: 'Cenote Systems', Industry: 'Technology', Phone: '+52 999 000 1002' },
  { Id: 'a3', Name: 'Ceiba Market', Industry: 'Retail', Phone: '+52 999 000 1003' }
];

test('filterAccounts matches name case-insensitively', () => {
  const result = filterAccounts(accounts, 'ce', ALL_INDUSTRIES);
  assert.deepEqual(result.map((a) => a.Name), ['Cenote Systems', 'Ceiba Market']);
});

test('filterAccounts matches industry exactly', () => {
  const result = filterAccounts(accounts, '', 'Retail');
  assert.deepEqual(result.map((a) => a.Name), ['Ceiba Market']);
});

test('filterAccounts combines name and industry', () => {
  const result = filterAccounts(accounts, 'ce', 'Retail');
  assert.deepEqual(result.map((a) => a.Name), ['Ceiba Market']);
});

test('sortAccounts sorts ascending and descending', () => {
  const asc = sortAccounts(accounts, 'Name', 'asc').map((a) => a.Name);
  assert.deepEqual(asc, ['Alux Studio', 'Ceiba Market', 'Cenote Systems']);
  const desc = sortAccounts(accounts, 'Name', 'desc').map((a) => a.Name);
  assert.deepEqual(desc, ['Cenote Systems', 'Ceiba Market', 'Alux Studio']);
});

test('getIndustryOptions builds a sorted, deduped list with an All option first', () => {
  const options = getIndustryOptions(accounts);
  assert.deepEqual(options, [
    { label: 'All industries', value: ALL_INDUSTRIES },
    { label: 'Design', value: 'Design' },
    { label: 'Retail', value: 'Retail' },
    { label: 'Technology', value: 'Technology' }
  ]);
});

test('getIndustryTag returns a known tint for a known industry and falls back for unknown ones', () => {
  assert.deepEqual(getIndustryTag('Design'), { bg: 'bg-tint-lavender', text: 'text-tag-purple' });
  assert.deepEqual(getIndustryTag('Nonexistent Industry'), { bg: 'bg-tint-gray', text: 'text-steel' });
});
