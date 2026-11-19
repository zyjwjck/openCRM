/**
 * Root server load: read the language preference from cookie so SSR renders
 * in the same language as the client (prevents first-paint language flash).
 *
 * @type {import('./$types').LayoutServerLoad}
 */
export async function load({ cookies }) {
  const language = cookies.get('language');
  return {
    language: language === 'zh' || language === 'en' ? language : 'en'
  };
}
