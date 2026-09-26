/**
 * Admin session storage.
 *
 * This portfolio has exactly one admin and no user accounts, so the whole
 * "session" is a single JWT kept in localStorage. It is attached to every API
 * call by the axios interceptor in lib/api.js, and the admin layout listens
 * for the `admin:unauthorized` event that interceptor dispatches when the
 * server rejects it with a 401.
 */

const TOKEN_KEY = "portfolio_admin_token";

export function getAdminToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setAdminToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // localStorage can be unavailable (private mode / blocked cookies) —
    // the admin panel simply won't be able to stay signed in.
  }
}

export function clearAdminToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Nothing to clean up.
  }
}

export function isAdminAuthed() {
  return Boolean(getAdminToken());
}