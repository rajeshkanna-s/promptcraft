// Thin, defensive localStorage helpers for history + favorites.

import { MAX_HISTORY } from './constants.js';

const HISTORY_KEY = 'promptcraft.history';
const FAVORITES_KEY = 'promptcraft.favorites';
const THEME_KEY = 'promptcraft.theme';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full / blocked — ignore, app still works in-memory
  }
}

// ── History (last 20 batches) ──────────────────────────────────────────────
export function loadHistory() {
  return read(HISTORY_KEY, []);
}

export function saveBatch(batch) {
  const history = loadHistory();
  const next = [batch, ...history].slice(0, MAX_HISTORY);
  write(HISTORY_KEY, next);
  return next;
}

export function clearHistory() {
  write(HISTORY_KEY, []);
  return [];
}

// ── Favorites (individual starred prompts) ──────────────────────────────────
export function loadFavorites() {
  return read(FAVORITES_KEY, []);
}

export function saveFavorites(favorites) {
  write(FAVORITES_KEY, favorites);
  return favorites;
}

// ── Theme ───────────────────────────────────────────────────────────────────
export function loadTheme() {
  return read(THEME_KEY, null);
}

export function saveTheme(theme) {
  write(THEME_KEY, theme);
}
