/**
 * Shared client-side validators mirroring the backend model constraints, so
 * users get specific, localized feedback BEFORE the form is submitted.
 *
 * Backend references:
 * - Email: Django EmailField (validated by DRF serializers)
 * - Phone: RegexValidator ^[\d\s\-\(\)\+\.]{7,25}$ on Lead/Contact/Account
 *   phone fields ("Enter a valid phone number (7-25 characters, digits and
 *   separators only)")
 */

/** Pragmatic email check: local@domain.tld (tld >= 2 chars). */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Mirrors backend RegexValidator: digits, spaces and - + ( ) . only, 7-25 chars. */
const PHONE_REGEX = /^[\d\s\-()+.]{7,25}$/;

/**
 * @param {string} [value]
 * @returns {boolean} true when empty (optional field) or a valid email
 */
export function isValidEmail(value) {
  if (!value || !value.trim()) return true;
  return EMAIL_REGEX.test(value.trim());
}

/**
 * @param {string} [value]
 * @returns {boolean} true when empty (optional field) or matches the backend phone rule
 */
export function isValidPhone(value) {
  if (!value || !value.trim()) return true;
  return PHONE_REGEX.test(value.trim());
}

/**
 * Validate contact-style fields and return the keys that failed.
 * Empty values are treated as valid (fields are optional).
 * @param {{ email?: string, phone?: string }} values
 * @returns {string[]}
 */
export function findInvalidContactFields(values) {
  /** @type {string[]} */
  const invalid = [];
  if (values.email && !isValidEmail(values.email)) invalid.push('email');
  if (values.phone && !isValidPhone(values.phone)) invalid.push('phone');
  return invalid;
}
