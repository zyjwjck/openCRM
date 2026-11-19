import { apiRequest, buildQueryParams, extractPagination } from '$lib/api-helpers.js';
import { fail } from '@sveltejs/kit';

export async function load({ url, locals, cookies }) {
  const org = locals.org;
  if (!org) {
    return { tab: 'policies', policies: [], entries: [], summary: null, products: [] };
  }

  const tab = url.searchParams.get('tab') || 'policies';
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const query = buildQueryParams({ page, limit }).toString();

  const [policiesRes, entriesRes, summaryRes, productsRes] = await Promise.all([
    apiRequest(`/commission/policies/?${query}`, {}, { cookies, org }).catch(() => ({ count: 0, results: [] })),
    apiRequest(`/commission/entries/?${query}`, {}, { cookies, org }).catch(() => ({ count: 0, results: [] })),
    apiRequest('/commission/summary/', {}, { cookies, org }).catch(() => null),
    apiRequest('/invoices/products/?limit=500', {}, { cookies, org }).catch(() => ({ results: [] }))
  ]);

  return {
    tab,
    policies: policiesRes.results || [],
    policiesPagination: extractPagination(policiesRes),
    entries: entriesRes.results || [],
    entriesPagination: extractPagination(entriesRes),
    summary: summaryRes,
    products: productsRes.results || []
  };
}

function toPayload(data) {
  const num = (key) => Number(data.get(key) || 0);
  let tiers = [];
  let creditRules = [];
  try { tiers = JSON.parse(data.get('tiers') || '[]'); } catch { /* ignore */ }
  try { creditRules = JSON.parse(data.get('creditRules') || '[]'); } catch { /* ignore */ }
  return {
    name: data.get('name')?.toString().trim() || '',
    code: data.get('code')?.toString().trim() || '',
    scope: data.get('scope') || 'ALL',
    product: data.get('product') || null,
    category: data.get('category')?.toString().trim() || '',
    base_type: data.get('baseType') || 'NET',
    customer_scope: data.get('customerScope') || 'ALL',
    rate: num('rate'),
    use_tiers: data.get('useTiers') === 'true',
    min_base_amount: num('minBaseAmount'),
    cap_amount: num('capAmount'),
    floor_amount: num('floorAmount'),
    exclude_negative_margin: data.get('excludeNegativeMargin') === 'true',
    priority: num('priority'),
    is_active: data.get('isActive') !== 'false',
    effective_from: data.get('effectiveFrom') || null,
    effective_to: data.get('effectiveTo') || null,
    notes: data.get('notes')?.toString() || '',
    tiers,
    credit_rules: creditRules
  };
}

export const actions = {
  create: async ({ request, locals, cookies }) => {
    if (!locals.org) return fail(400, { error: 'No organization context' });
    try {
      const payload = toPayload(await request.formData());
      await apiRequest('/commission/policies/', { method: 'POST', body: payload }, { cookies, org: locals.org });
      return { success: true };
    } catch (err) {
      return fail(400, { error: err.message || 'Failed to create policy' });
    }
  },

  update: async ({ request, locals, cookies }) => {
    if (!locals.org) return fail(400, { error: 'No organization context' });
    try {
      const data = await request.formData();
      const id = data.get('id')?.toString();
      if (!id) return fail(400, { error: 'Policy id is required' });
      const payload = toPayload(data);
      await apiRequest(`/commission/policies/${id}/`, { method: 'PUT', body: payload }, { cookies, org: locals.org });
      return { success: true };
    } catch (err) {
      return fail(400, { error: err.message || 'Failed to update policy' });
    }
  },

  delete: async ({ request, locals, cookies }) => {
    if (!locals.org) return fail(400, { error: 'No organization context' });
    try {
      const data = await request.formData();
      const id = data.get('id')?.toString();
      if (data.get('confirm') !== 'true') return fail(400, { error: 'confirmRequired' });
      await apiRequest(`/commission/policies/${id}/?confirm=true`, { method: 'DELETE' }, { cookies, org: locals.org });
      return { success: true };
    } catch (err) {
      return fail(400, { error: err.message || 'Failed to delete policy' });
    }
  }
};
