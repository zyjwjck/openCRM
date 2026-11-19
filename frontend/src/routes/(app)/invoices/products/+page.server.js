/**
 * Products List Page
 *
 * Product catalog for invoice line items.
 * Django endpoint: GET /api/invoices/products/
 */

import { error, fail } from '@sveltejs/kit';
import { apiRequest, buildQueryParams } from '$lib/api-helpers.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, locals, cookies }) {
  const org = locals.org;

  if (!org) {
    throw error(401, 'Organization context required');
  }

  // Parse filter params from URL
  const filters = {
    search: url.searchParams.get('search') || '',
    category: url.searchParams.get('category') || '',
    is_active: url.searchParams.get('is_active') || ''
  };

  try {
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const sort = url.searchParams.get('sort') || '-created_at';

    // Build query parameters for Django
    const queryParams = buildQueryParams({
      page,
      limit,
      sort: sort.startsWith('-') ? sort.substring(1) : sort,
      order: sort.startsWith('-') ? 'desc' : 'asc'
    });

    // Add filter params
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.is_active) queryParams.append('is_active', filters.is_active);

    // Fetch products
    const productsResponse = await apiRequest(
      `/invoices/products/?${queryParams.toString()}`,
      {},
      { cookies, org }
    );

    // Handle Django response format
    let products = [];
    let totalCount = 0;

    if (productsResponse.results) {
      products = productsResponse.results;
      totalCount = productsResponse.count || 0;
    } else if (Array.isArray(productsResponse)) {
      products = productsResponse;
      totalCount = products.length;
    }

    // Transform products to frontend structure
    const transformedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      sku: product.sku || '',
      price: product.price || '0.00',
      currency: product.currency || 'USD',
      category: product.category || '',
      isActive: product.is_active,
      createdAt: product.created_at,
      hasCommissionPolicy: product.has_commission_policy ?? false
    }));

    // Extract unique categories
    const categories = [...new Set(products.map((p) => p.category).filter(Boolean))].map((c) => ({
      value: c,
      label: c
    }));

    return {
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1
      },
      filters,
      categories
    };
  } catch (err) {
    console.error('Error loading products from API:', err);
    throw error(500, `Failed to load products: ${err.message}`);
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  create: async ({ request, locals, cookies }) => {
    try {
      const form = await request.formData();

      const productData = {
        name: form.get('name')?.toString().trim() || '',
        description: form.get('description')?.toString() || '',
        sku: form.get('sku')?.toString() || '',
        price: form.get('price')?.toString() || '0',
        currency: form.get('currency')?.toString() || 'USD',
        category: form.get('category')?.toString() || '',
        is_active: form.get('isActive') === 'true'
      };

      await apiRequest(
        '/invoices/products/',
        {
          method: 'POST',
          body: productData
        },
        { cookies, org: locals.org }
      );

      return { success: true };
    } catch (err) {
      console.error('Error creating product:', err);
      return fail(400, { error: err.message || 'Failed to create product' });
    }
  },

  update: async ({ request, locals, cookies }) => {
    try {
      const form = await request.formData();
      const productId = form.get('productId')?.toString();

      if (!productId) {
        return fail(400, { error: 'Product ID is required' });
      }

      const productData = {
        name: form.get('name')?.toString().trim() || '',
        description: form.get('description')?.toString() || '',
        sku: form.get('sku')?.toString() || '',
        price: form.get('price')?.toString() || '0',
        currency: form.get('currency')?.toString() || 'USD',
        category: form.get('category')?.toString() || '',
        is_active: form.get('isActive') === 'true'
      };

      await apiRequest(
        `/invoices/products/${productId}/`,
        {
          method: 'PUT',
          body: productData
        },
        { cookies, org: locals.org }
      );

      return { success: true };
    } catch (err) {
      console.error('Error updating product:', err);
      return fail(400, { error: err.message || 'Failed to update product' });
    }
  },

  // Toggle the active (on-shelf / off-shelf) status of a single product.
  // The backend PUT supports partial updates, so only is_active is sent.
  toggleActive: async ({ request, locals, cookies }) => {
    try {
      const form = await request.formData();
      const productId = form.get('productId')?.toString();

      if (!productId) {
        return fail(400, { error: 'Product ID is required' });
      }

      await apiRequest(
        `/invoices/products/${productId}/`,
        {
          method: 'PUT',
          body: { is_active: form.get('isActive') === 'true' }
        },
        { cookies, org: locals.org }
      );

      return { success: true };
    } catch (err) {
      console.error('Error toggling product status:', err);
      return fail(400, { error: err.message || 'Failed to update product status' });
    }
  },

  delete: async ({ request, locals, cookies }) => {
    try {
      const form = await request.formData();
      const productId = form.get('productId')?.toString();

      if (!productId) {
        return fail(400, { error: 'Product ID is required' });
      }

      await apiRequest(
        `/invoices/products/${productId}/`,
        { method: 'DELETE' },
        { cookies, org: locals.org }
      );

      return { success: true };
    } catch (err) {
      console.error('Error deleting product:', err);
      return fail(400, { error: err.message || 'Failed to delete product' });
    }
  },

  listAttachments: async ({ request, locals, cookies }) => {
    try {
      const form = await request.formData();
      const productId = form.get('productId')?.toString();
      if (!productId) {
        return fail(400, { error: 'Product ID is required' });
      }

      const response = await apiRequest(
        `/invoices/products/${productId}/attachments/`,
        {},
        { cookies, org: locals.org }
      );
      return { success: true, attachments: response?.attachments || [] };
    } catch (err) {
      console.error('Error listing product attachments:', err);
      return fail(400, { error: err.message || 'Failed to list attachments' });
    }
  },

  uploadAttachment: async ({ request, locals, cookies }) => {
    try {
      const form = await request.formData();
      const productId = form.get('productId')?.toString();
      const file = form.get('file');

      if (!productId) {
        return fail(400, { error: 'Product ID is required' });
      }
      if (!file || typeof file === 'string' || typeof file.arrayBuffer !== 'function' || file.size === 0) {
        return fail(400, { error: 'A file is required' });
      }

      const uploadData = new FormData();
      uploadData.append('file', file);

      const response = await apiRequest(
        `/invoices/products/${productId}/attachments/`,
        { method: 'POST', body: uploadData },
        { cookies, org: locals.org }
      );
      return { success: true, attachment: response?.attachment || null };
    } catch (err) {
      console.error('Error uploading product attachment:', err);
      return fail(400, { error: err.message || 'Failed to upload attachment' });
    }
  },

  deleteAttachment: async ({ request, locals, cookies }) => {
    try {
      const form = await request.formData();
      const attachmentId = form.get('attachmentId')?.toString();
      if (!attachmentId) {
        return fail(400, { error: 'Attachment ID is required' });
      }

      await apiRequest(
        `/invoices/products/attachments/${attachmentId}/`,
        { method: 'DELETE' },
        { cookies, org: locals.org }
      );
      return { success: true };
    } catch (err) {
      console.error('Error deleting product attachment:', err);
      return fail(400, { error: err.message || 'Failed to delete attachment' });
    }
  },

  downloadAttachment: async ({ request, locals, cookies }) => {
    try {
      const form = await request.formData();
      const attachmentId = form.get('attachmentId')?.toString();
      if (!attachmentId) {
        return fail(400, { error: 'Attachment ID is required' });
      }

      const file = await apiRequest(
        `/invoices/products/attachments/${attachmentId}/`,
        { responseType: 'blob' },
        { cookies, org: locals.org }
      );
      return { success: true, file };
    } catch (err) {
      console.error('Error downloading product attachment:', err);
      return fail(400, { error: err.message || 'Failed to download attachment' });
    }
  }
};
