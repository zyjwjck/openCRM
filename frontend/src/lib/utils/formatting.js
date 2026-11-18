/**
 * Formatting utilities for consistent data display across the application
 * @module lib/utils/formatting
 */

import { format, formatDistanceToNow } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { getCurrentLanguage } from './i18n.svelte.js';

/**
 * Map i18n language code to date-fns locale
 * @param {string} lang
 */
function getDateLocale(lang) {
  if (!lang) return enUS;
  const lower = String(lang).toLowerCase();
  if (lower.startsWith('zh')) return zhCN;
  return enUS;
}

/**
 * Map i18n language code to Intl locale
 * @param {string} lang
 */
function getIntlLocale(lang) {
  if (!lang) return 'en-US';
  const lower = String(lang).toLowerCase();
  if (lower === 'zh' || lower.startsWith('zh-cn')) return 'zh-CN';
  if (lower.startsWith('zh-tw') || lower.startsWith('zh-hk')) return 'zh-TW';
  return 'en-US';
}

/**
 * Pick a default date format string based on current language
 */
function getDefaultDateFormat() {
  const lang = getCurrentLanguage();
  if (lang && String(lang).toLowerCase().startsWith('zh')) {
    return 'yyyy年M月d日';
  }
  return 'MMM d, yyyy';
}

/**
 * Format a date string to a human-readable format
 * @param {string | Date | null | undefined} date - Date to format
 * @param {string} [formatStr] - date-fns format string (auto-selected if omitted)
 * @returns {string} Formatted date string or '-' if no date
 */
export function formatDate(date, formatStr) {
  if (!date) return '-';
  const fmt = formatStr || getDefaultDateFormat();
  try {
    return format(new Date(date), fmt, { locale: getDateLocale(getCurrentLanguage()) });
  } catch {
    return '-';
  }
}

/**
 * Format a date as relative time (e.g., "2 hours ago")
 * @param {string | Date | null | undefined} date - Date to format
 * @returns {string} Relative time string or '-' if no date
 */
export function formatRelativeDate(date) {
  if (!date) return '-';
  try {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: getDateLocale(getCurrentLanguage())
    });
  } catch {
    return '-';
  }
}

/**
 * Format a number as currency
 * @param {number | string | null | undefined} amount - Amount to format
 * @param {string} [currency='USD'] - Currency code (ISO 4217)
 * @param {boolean} [compact=false] - Use compact notation (e.g., $1.2M)
 * @returns {string} Formatted currency string or '-' if no amount
 */
export function formatCurrency(amount, currency = 'USD', compact = false) {
  if (amount === null || amount === undefined) return '-';

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '-';

  const currencyCode = currency && currency.length === 3 ? currency : 'USD';
  const locale = getIntlLocale(getCurrentLanguage());

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      notation: compact ? 'compact' : 'standard',
      maximumFractionDigits: compact ? 1 : 2
    }).format(numAmount);
  } catch {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      notation: compact ? 'compact' : 'standard',
      maximumFractionDigits: compact ? 1 : 2
    }).format(numAmount);
  }
}

/**
 * Format a number with commas
 * @param {number | null | undefined} num - Number to format
 * @returns {string} Formatted number string or '-' if no number
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '-';
  return new Intl.NumberFormat(getIntlLocale(getCurrentLanguage())).format(num);
}

/**
 * Get initials from a name string
 * @param {string | null | undefined} name - Full name
 * @param {number} [maxLength=2] - Maximum number of initials
 * @returns {string} Uppercase initials
 */
export function getInitials(name, maxLength = 2) {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, maxLength);
}

/**
 * Get initials from first and last name
 * @param {string | null | undefined} firstName
 * @param {string | null | undefined} lastName
 * @returns {string} Uppercase initials
 */
export function getNameInitials(firstName, lastName) {
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
  return `${first}${last}`.toUpperCase();
}

/**
 * Format a phone number for display
 * @param {string | null | undefined} phone - Phone number
 * @returns {string} Formatted phone number or empty string
 */
export function formatPhone(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}
