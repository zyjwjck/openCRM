/**
 * API Helper Functions
 *
 * Shared utilities for making API requests to Django backend.
 * Used by SvelteKit server files during migration from Prisma to API.
 */

import { env } from '$env/dynamic/public';
import { dev } from '$app/environment';

const API_BASE_URL = env.PUBLIC_DJANGO_API_URL
  ? `${env.PUBLIC_DJANGO_API_URL}/api`
  : 'http://localhost:8000/api';

const ACCESS_COOKIE = 'jwt_access';
const REFRESH_COOKIE = 'jwt_refresh';
const ORG_COOKIE = 'org';

const COOKIE_SECURE = !dev;
const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24;
const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 14;

/**
 * Accept either a locals-like object ({ cookies, org }) or the Cookies object itself.
 * @param {{ cookies?: Cookies } | Cookies | undefined} locals
 * @returns {Cookies | undefined}
 */
function resolveCookies(locals) {
  if (!locals) return undefined;
  const nested = /** @type {{ cookies?: Cookies }} */ (locals).cookies;
  return nested || /** @type {Cookies} */ (locals);
}

/**
 * Remove all auth cookies (server-side).
 * @param {Cookies | undefined} cookies
 */
export function clearSessionCookies(cookies) {
  if (!cookies) return;
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE, ORG_COOKIE]) {
    cookies.delete(name, { path: '/' });
  }
}

/**
 * Write auth cookies from the server.
 *
 * Deleting first is important: cookies previously written by document.cookie
 * cannot overwrite httpOnly cookies of the same name, which leaves a stale
 * (invalid) access token in the browser forever.
 *
 * @param {Cookies} cookies
 * @param {{ accessToken: string, refreshToken: string, orgId?: string | null }} session
 */
export function setSessionCookies(cookies, { accessToken, refreshToken, orgId }) {
  cookies.delete(ACCESS_COOKIE, { path: '/' });
  cookies.delete(REFRESH_COOKIE, { path: '/' });

  cookies.set(ACCESS_COOKIE, accessToken, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: COOKIE_SECURE,
    maxAge: ACCESS_COOKIE_MAX_AGE
  });
  cookies.set(REFRESH_COOKIE, refreshToken, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: COOKIE_SECURE,
    maxAge: REFRESH_COOKIE_MAX_AGE
  });

  if (orgId) {
    cookies.delete(ORG_COOKIE, { path: '/' });
    // SvelteKit defaults cookies to httpOnly; org is also read client-side.
    cookies.set(ORG_COOKIE, orgId, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      secure: COOKIE_SECURE,
      maxAge: REFRESH_COOKIE_MAX_AGE
    });
  }
}

/**
 * Exchange the refresh token for a new token pair and update the cookies.
 * Returns the new access token, or null when the session can no longer be recovered.
 * @param {{ cookies?: Cookies } | Cookies | undefined} locals
 * @returns {Promise<string | null>}
 */
export async function refreshSession(locals) {
  const cookies = resolveCookies(locals);
  const refreshToken = cookies?.get?.(REFRESH_COOKIE);
  if (!cookies || !refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken })
    });

    if (!response.ok) {
      console.warn(`Token refresh failed with HTTP ${response.status}`);
      clearSessionCookies(cookies);
      return null;
    }

    const data = await response.json();
    if (!data.access) {
      clearSessionCookies(cookies);
      return null;
    }

    // The backend rotates refresh tokens, so the new one must be stored as well.
    setSessionCookies(cookies, {
      accessToken: data.access,
      refreshToken: data.refresh || refreshToken,
      orgId: cookies.get(ORG_COOKIE)
    });
    return data.access;
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearSessionCookies(cookies);
    return null;
  }
}

/** Raised when the backend rejects the token and the session cannot be refreshed. */
export class AuthenticationError extends Error {
  constructor(message = 'Authentication session expired, please sign in again') {
    super(message);
    this.name = 'AuthenticationError';
    this.status = 401;
  }
}

/**
 * Simple in-memory cache for API responses
 * This helps reduce duplicate API calls for frequently accessed data
 */
class ApiCache {
  constructor() {
    /** @type {Map<string, { data: any, timestamp: number }>} */
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
  }

  /**
   * Generate cache key from endpoint and options
   * @param {string} endpoint
   * @param {{ method?: string, body?: Record<string, unknown> }} options
   * @param {string} [tokenKey] - Fingerprint of the access token (cache must be per session)
   * @returns {string}
   */
  generateKey(endpoint, options = {}, tokenKey = '') {
    const { method = 'GET' } = options;
    // Only cache GET requests
    if (method !== 'GET') return null;
    // Include the token fingerprint so responses are never shared across users/orgs
    return `${tokenKey}|${endpoint}`;
  }

  /**
   * Get data from cache
   * @param {string} key
   * @returns {any | null}
   */
  get(key) {
    if (!key) return null;
    const item = this.cache.get(key);
    if (!item) return null;
    // Check if item is expired
    if (Date.now() - item.timestamp > this.defaultTTL) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  /**
   * Set data in cache
   * @param {string} key
   * @param {any} data
   */
  set(key, data) {
    if (!key) return;
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Clear cache
   * @param {string} [key]
   */
  clear(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

// Create singleton instance
const apiCache = new ApiCache();

/**
 * @typedef {import('@sveltejs/kit').Cookies} Cookies
 */

/**
 * Make authenticated API request to Django backend
 *
 * This helper is designed for SvelteKit server-side use, where cookies
 * are managed by hooks and locals contains the user and org context.
 *
 * @param {string} endpoint - API endpoint (e.g., '/accounts/', '/leads/123/')
 * @param {{ method?: string, body?: Record<string, unknown>, headers?: Record<string, string> }} options - Fetch options
 * @param {{ cookies?: Cookies, org?: { id: string } } | Cookies} locals - SvelteKit locals object or cookies directly
 * @returns {Promise<any>} Response data
 * @throws {Error} If request fails
 */
export async function apiRequest(endpoint, options = {}, locals) {
  const { method = 'GET', body, headers = {} } = options;
  const cookies = resolveCookies(locals);

  /** @returns {string | undefined} */
  const readAccessToken = () =>
    // Support both naming conventions (jwt_access from login, access_token from legacy)
    cookies?.get?.(ACCESS_COOKIE) || cookies?.get?.('access_token') || undefined;

  let accessToken = readAccessToken();
  const cacheKey = apiCache.generateKey(endpoint, options, accessToken?.slice(-32));
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) {
    console.log(`Cache hit for ${endpoint}`);
    return cachedData;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  /**
   * @param {string | undefined} token
   * @returns {Promise<Response>}
   */
  const performRequest = async (token) => {
    /** @type {Record<string, string>} */
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };

    // Organization context is embedded in the JWT, no extra header needed.
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    /** @type {RequestInit} */
    const requestOptions = { method, headers: requestHeaders };
    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }
    return fetch(url, requestOptions);
  };

  try {
    let response = await performRequest(accessToken);

    // An invalid access token is recoverable: refresh the token pair once and retry.
    if (response.status === 401 && cookies?.get?.(REFRESH_COOKIE)) {
      const refreshedToken = await refreshSession(cookies);
      if (refreshedToken) {
        accessToken = refreshedToken;
        response = await performRequest(refreshedToken);
      }
    }

    if (response.status === 401) {
      clearSessionCookies(cookies);
      throw new AuthenticationError();
    }

    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Extract meaningful error message from various Django error formats
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.error && typeof errorData.error === 'string') {
        errorMessage = errorData.error;
      } else if (errorData.errors && typeof errorData.errors === 'object') {
        // Handle field-level errors
        const fieldErrors = Object.entries(errorData.errors)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('; ');
        errorMessage = fieldErrors || errorMessage;
      } else if (errorData.non_field_errors) {
        errorMessage = Array.isArray(errorData.non_field_errors)
          ? errorData.non_field_errors.join(', ')
          : errorData.non_field_errors;
      } else if (typeof errorData === 'object' && Object.keys(errorData).length > 0) {
        // Handle field-level validation errors from DRF serializers
        const fieldErrors = Object.entries(errorData)
          .filter(([key, value]) => key !== 'error' || typeof value === 'string')
          .map(([field, msgs]) => {
            if (Array.isArray(msgs)) {
              return `${field}: ${msgs.join(', ')}`;
            } else if (typeof msgs === 'string') {
              return `${field}: ${msgs}`;
            }
            return null;
          })
          .filter(Boolean)
          .join('; ');
        if (fieldErrors) {
          errorMessage = fieldErrors;
        }
      }

      console.error(`API Error Response:`, errorData);
      throw new Error(errorMessage);
    }

    // A successful mutation must invalidate the cached GET responses.
    // apiCache is a server-side singleton with a 5-minute TTL, so without this
    // every load() after a PATCH/POST/DELETE (including invalidateAll() and a
    // full page reload) keeps serving the stale snapshot until the TTL expires.
    // Clear the whole cache: keys are per-session but a mutation can affect
    // list AND detail endpoints across several query strings, so a targeted
    // delete would risk leaving a stale entry behind.
    if (method !== 'GET') {
      apiCache.clear();
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    // Return JSON response
    const data = await response.json();

    // Cache GET responses under the token that actually served the request
    const finalCacheKey = apiCache.generateKey(endpoint, options, accessToken?.slice(-32));
    if (finalCacheKey) {
      apiCache.set(finalCacheKey, data);
    }

    return data;
  } catch (error) {
    console.error(`API request failed: ${method} ${endpoint}`, error);
    throw error;
  }
}

/**
 * Transform Django field names to camelCase for SvelteKit
 *
 * @param {any} obj - Django object with snake_case fields
 * @returns {any} Object with camelCase fields
 */
export function transformFromDjango(obj) {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(transformFromDjango);
  if (typeof obj !== 'object') return obj;

  /** @type {Record<string, unknown>} */
  const transformed = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    transformed[camelKey] = typeof value === 'object' ? transformFromDjango(value) : value;
  }
  return transformed;
}

/**
 * Transform camelCase field names to Django snake_case
 *
 * @param {any} obj - SvelteKit object with camelCase fields
 * @returns {any} Object with snake_case fields
 */
export function transformToDjango(obj) {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(transformToDjango);
  if (typeof obj !== 'object') return obj;

  /** @type {Record<string, unknown>} */
  const transformed = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    transformed[snakeKey] = typeof value === 'object' ? transformToDjango(value) : value;
  }
  return transformed;
}

/**
 * Build Django query parameters from filter object
 *
 * @param {Object} filters - Filter object
 * @param {number} [filters.page] - Page number (1-indexed)
 * @param {number} [filters.limit] - Items per page
 * @param {string} [filters.sort] - Sort field name
 * @param {string} [filters.order] - Sort order ('asc' or 'desc')
 * @returns {URLSearchParams} Query parameters for Django API
 */
export function buildQueryParams(filters = {}) {
  const { page = 1, limit = 10, sort, order = 'asc', ...otherFilters } = filters;

  const params = new URLSearchParams();

  // Pagination
  params.append('limit', limit.toString());
  params.append('offset', ((page - 1) * limit).toString());

  // Sorting (Django uses - prefix for descending)
  if (sort) {
    const ordering = order === 'desc' ? `-${sort}` : sort;
    params.append('ordering', ordering);
  }

  // Other filters
  for (const [key, value] of Object.entries(otherFilters)) {
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  }

  return params;
}

/**
 * Extract pagination info from Django response
 *
 * @param {{ count?: number, next?: string | null, previous?: string | null, results?: unknown[] }} response - Django paginated response
 * @param {number} [limit=10] - Items per page
 * @returns {{ page: number, limit: number, total: number, totalPages: number, hasNext: boolean, hasPrevious: boolean }} Pagination info compatible with SvelteKit
 */
export function extractPagination(response, limit = 10) {
  const total = response.count || 0;
  const totalPages = Math.ceil(total / limit);

  // Determine current page from offset in next/previous URLs
  let currentPage = 1;
  if (response.next) {
    const url = new URL(response.next, 'http://localhost');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    currentPage = Math.floor(offset / limit);
  } else if (response.previous) {
    const url = new URL(response.previous, 'http://localhost');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    currentPage = Math.floor(offset / limit) + 2;
  }

  return {
    page: currentPage,
    limit,
    total,
    totalPages,
    hasNext: response.next !== null,
    hasPrevious: response.previous !== null
  };
}
