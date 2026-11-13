/**
 * SvelteKit Server Hooks with JWT Authentication
 *
 * Authentication Flow:
 * 1. JWT tokens stored in cookies (httpOnly for security)
 * 2. Decode JWT locally to check org context (no API call needed)
 * 3. Only call switch-org if token doesn't have correct org
 * 4. Routes protected based on authentication and org membership
 */

import { redirect } from '@sveltejs/kit';
import axios from 'axios';
import { env } from '$env/dynamic/public';
import { refreshSession, clearSessionCookies, setSessionCookies } from '$lib/api-helpers.js';

const API_BASE_URL = env.PUBLIC_DJANGO_API_URL
  ? `${env.PUBLIC_DJANGO_API_URL}/api`
  : 'http://localhost:8000/api';

/**
 * @typedef {{ default_currency?: string, currency_symbol?: string, default_country?: string|null }} OrgSettingsPayload
 * @typedef {{ org_id?: string, org_name?: string, role?: string, user_id?: string, user_name?: string, user_email?: string, user_profile_pic?: string, exp?: number, iat?: number, org_settings?: OrgSettingsPayload }} JWTPayload
 * @typedef {{ id: string, name: string }} OrgInfo
 * @typedef {{ org: OrgInfo, role?: string }} ProfileInfo
 * @typedef {{ id?: string, organizations?: Array<{ id: string, name: string }> }} UserInfo
 * @typedef {{ access_token: string, refresh_token: string, current_org?: OrgInfo }} SwitchOrgResult
 */

/**
 * Decode JWT payload without verification (for reading claims only)
 * @param {string} token - JWT token
 * @returns {JWTPayload|null} Decoded payload or null if invalid
 */
function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    // Handle base64url encoding
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return /** @type {JWTPayload} */ (JSON.parse(jsonPayload));
  } catch (error) {
    return null;
  }
}

/**
 * Check if JWT token has the specified org_id in its payload
 * @param {string} token - JWT token
 * @param {string} orgId - Organization UUID to check
 * @returns {boolean} True if token has the org context
 */
function tokenHasOrgContext(token, orgId) {
  const payload = decodeJwtPayload(token);
  return Boolean(payload && payload.org_id === orgId);
}

/**
 * Verify JWT token locally by checking expiration
 * @param {string} accessToken - JWT access token
 * @returns {JWTPayload|null} JWT payload or null if expired/invalid
 */
function verifyTokenLocally(accessToken) {
  const payload = decodeJwtPayload(accessToken);
  if (!payload) return null;

  // Check if token is expired
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    return null;
  }

  return payload;
}

const TOKEN_VERIFICATION_TTL = 5 * 60 * 1000;
/** @type {Map<string, number>} */
const verifiedTokens = new Map();

/**
 * Confirm with Django that the token is signed by the current backend.
 *
 * verifyTokenLocally() only base64-decodes the payload, so it also accepts
 * tokens signed with an old SECRET_KEY or otherwise rejected by Django. Those
 * tokens render the UI as "logged in" while every API call returns 401.
 *
 * @param {string} token
 * @returns {Promise<'valid' | 'invalid' | 'unknown'>}
 */
async function verifyTokenWithBackend(token) {
  const cachedUntil = verifiedTokens.get(token);
  if (cachedUntil && cachedUntil > Date.now()) {
    return 'valid';
  }
  verifiedTokens.delete(token);
  if (verifiedTokens.size > 500) {
    verifiedTokens.clear();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me/`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.ok) {
      verifiedTokens.set(token, Date.now() + TOKEN_VERIFICATION_TTL);
      return 'valid';
    }

    // Only an explicit 401 means the token itself is unusable. A 5xx or a
    // network failure must not invalidate the session.
    return response.status === 401 ? 'invalid' : 'unknown';
  } catch (error) {
    console.error('Token verification request failed:', error);
    return 'unknown';
  }
}

// Profile info is now embedded in JWT - no API call needed

/**
 * Switch organization and get new tokens with org context
 * @param {string} accessToken - Current JWT access token
 * @param {string} orgId - Organization UUID to switch to
 * @returns {Promise<SwitchOrgResult|null>} New tokens and org data or null if failed
 */
async function switchOrg(accessToken, orgId) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/switch-org/`,
      { org_id: orgId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Org switch failed:', error);
    return null;
  }
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Get tokens from cookies
  /** @type {string | undefined} */
  let accessToken = event.cookies.get('jwt_access');
  const refreshToken = event.cookies.get('jwt_refresh');
  const orgId = event.cookies.get('org');
  const isSessionRoute = event.url.pathname.startsWith('/login/session');

  /** @type {JWTPayload | null} */
  let jwtPayload = null;

  // Try to authenticate user (LOCAL JWT DECODE - no API call!)
  if (accessToken && !isSessionRoute) {
    jwtPayload = verifyTokenLocally(accessToken);

    if (jwtPayload && (await verifyTokenWithBackend(accessToken)) === 'invalid') {
      console.warn('Access token rejected by Django, refreshing session');
      jwtPayload = null;
    }

    // If access token expired, try to refresh
    if (!jwtPayload && refreshToken) {
      const newAccessToken = await refreshSession(event.cookies);
      if (newAccessToken) {
        accessToken = newAccessToken;
        jwtPayload = verifyTokenLocally(newAccessToken);
      } else {
        clearSessionCookies(event.cookies);
        accessToken = undefined;
      }
    }
  }

  // Set user in locals from JWT payload (no API call needed!)
  if (jwtPayload) {
    // Build user object from JWT claims
    event.locals.user = {
      id: jwtPayload.user_id,
      name: jwtPayload.user_name || '',
      email: jwtPayload.user_email || '',
      profilePhoto: jwtPayload.user_profile_pic || ''
    };

    // Check if org cookie is set and token has org context
    if (orgId) {
      const token = /** @type {string} */ (accessToken);

      if (tokenHasOrgContext(token, orgId)) {
        // Token has org context - extract org info from JWT (no API call!)
        event.locals.org = {
          id: jwtPayload.org_id || orgId,
          name: jwtPayload.org_name || 'Organization'
        };
        /** @type {any} */ (event.locals).profile = {
          org: event.locals.org,
          role: jwtPayload.role || 'USER'
        };
        event.locals.org_name = jwtPayload.org_name || 'Organization';
        // Extract org settings for currency/locale
        event.locals.org_settings = jwtPayload.org_settings || {
          default_currency: 'USD',
          currency_symbol: '$',
          default_country: null
        };
      } else {
        // Token doesn't have org context, need to switch (1 API call)
        const switchResult = await switchOrg(token, orgId);

        if (switchResult) {
          setSessionCookies(event.cookies, {
            accessToken: switchResult.access_token,
            refreshToken: switchResult.refresh_token,
            orgId
          });
          accessToken = switchResult.access_token;

          // Extract org info from switch result (no additional API call!)
          event.locals.org = switchResult.current_org;
          /** @type {any} */ (event.locals).profile = {
            org: switchResult.current_org,
            role: 'USER' // Will be in new JWT
          };
          event.locals.org_name = switchResult.current_org?.name || 'Organization';
          // Decode new token to get org_settings
          const newPayload = decodeJwtPayload(switchResult.access_token);
          event.locals.org_settings = newPayload?.org_settings || {
            default_currency: 'USD',
            currency_symbol: '$',
            default_country: null
          };
        } else {
          // Org switch failed, clear org cookie and redirect
          event.cookies.delete('org', { path: '/' });
          throw redirect(307, '/org');
        }
      }
    } else {
      // No org cookie set, redirect to org selection page
      throw redirect(307, '/org');
    }
  } else {
    // No valid token, redirect to login page
    const pathname = event.url.pathname;
    const isPublicRoute = ['/login', '/logout', '/bounce'].some(
      (route) => pathname === route || pathname.startsWith(route + '/')
    );
    if (!isPublicRoute) {
      throw redirect(307, '/login');
    }
  }

  // Route protection
  const pathname = event.url.pathname;

  // Define public routes (no auth required)
  const PUBLIC_ROUTES = ['/login', '/logout', '/bounce'];

  // Define semi-protected routes (auth required, but no org)
  const AUTH_ONLY_ROUTES = ['/org'];

  // Check if public route
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // Check if auth-only route
  const isAuthOnlyRoute = AUTH_ONLY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if (isAuthOnlyRoute) {
    // Auth-only route - require user
    if (!jwtPayload) {
      throw redirect(307, '/login');
    }
  } else if (!isPublicRoute) {
    // Protected route - require user + org
    if (!jwtPayload) {
      throw redirect(307, '/login');
    }
    if (!event.locals.org) {
      throw redirect(307, '/org');
    }
  }

  return resolve(event);
}
