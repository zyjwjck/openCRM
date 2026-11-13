import { json } from '@sveltejs/kit';
import { setSessionCookies } from '$lib/api-helpers.js';

/**
 * Establish the auth session on the server.
 *
 * Cookies must be written here (not via document.cookie): tokens that were
 * previously set by the server are httpOnly, and JavaScript cannot overwrite
 * them. Writing them server-side also lets us clear stale cookies first.
 *
 * @type {import('./$types').RequestHandler}
 */
export const POST = async ({ request, cookies }) => {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid request body' }, { status: 400 });
  }

  const {
    access_token: accessToken,
    refresh_token: refreshToken,
    org_id: orgId
  } = payload ?? {};

  if (!accessToken || !refreshToken) {
    return json({ error: 'Missing tokens' }, { status: 400 });
  }

  setSessionCookies(cookies, { accessToken, refreshToken, orgId });

  return json({ ok: true });
};
