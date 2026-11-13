/**
 * Organization Selection Page - API Version
 *
 * Migrated from Prisma to Django REST API
 * Django endpoint: GET /api/auth/me/ (returns user with organizations array)
 *
 * To activate:
 *   mv +page.server.js +page.server.prisma.js
 *   mv +page.server.api.js +page.server.js
 */

import { env as publicEnv } from '$env/dynamic/public';
import { redirect, fail } from '@sveltejs/kit';
import axios from 'axios';
import { setSessionCookies } from '$lib/api-helpers.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, locals }) {
  const user = locals.user;

  if (!user) {
    return { orgs: [] };
  }

  try {
    const jwtAccess = cookies.get('jwt_access');
    if (!jwtAccess) {
      return { orgs: [] };
    }

    const apiUrl = publicEnv.PUBLIC_DJANGO_API_URL;

    // Fetch current user with organization memberships
    // The /api/auth/me/ endpoint returns user data with organizations array
    const response = await axios.get(`${apiUrl}/api/auth/me/`, {
      headers: {
        Authorization: `Bearer ${jwtAccess}`
      }
    });

    // Extract organizations from the user data
    // Django's MeView returns user with organizations array
    let orgs = [];

    if (response.data.organizations && Array.isArray(response.data.organizations)) {
      orgs = response.data.organizations.map((org) => ({
        id: org.id,
        name: org.name,
        logo: org.logo || null,
        role: org.role || 'USER'
      }));
    }

    return { orgs };
  } catch (error) {
    console.error('Error fetching organizations:', error);
    // Return empty array so user can create a new organization
    return { orgs: [] };
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  selectOrg: async ({ request, cookies }) => {
    const formData = await request.formData();
    const orgId = formData.get('org_id')?.toString();
    const orgName = formData.get('org_name')?.toString();

    if (!orgId) {
      return fail(400, { error: 'Organization ID is required' });
    }

    const jwtAccess = cookies.get('jwt_access');
    if (!jwtAccess) {
      throw redirect(307, '/login');
    }

    const apiUrl = publicEnv.PUBLIC_DJANGO_API_URL;

    try {
      // Call switch-org endpoint to get new tokens with org context
      const response = await axios.post(
        `${apiUrl}/api/auth/switch-org/`,
        { org_id: orgId },
        {
          headers: {
            Authorization: `Bearer ${jwtAccess}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const { access_token, refresh_token } = response.data;

      setSessionCookies(cookies, {
        accessToken: access_token,
        refreshToken: refresh_token,
        orgId
      });

      // Redirect to app
      throw redirect(303, '/');
    } catch (error) {
      if (error.status === 303) {
        throw error; // Re-throw redirect
      }
      console.error('Org switch failed:', error);
      return fail(500, { error: 'Failed to switch organization' });
    }
  }
};
