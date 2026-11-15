/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AUTH_BASE_URL } from '../utils/constants';
import { getToken } from '../utils/identity';

const TOKEN_KEY = 'gitaarth_token';
const AuthCtx = createContext(null);

/**
 * Google OAuth hands the JWT back as ?token= on whatever page the backend
 * redirects to. Pick it up once, store it, and clean the address bar.
 */
function consumeTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const authError = params.get('auth') === 'error';
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (token || authError) {
    params.delete('token');
    params.delete('auth');
    const qs = params.toString();
    window.history.replaceState({}, '', window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash);
  }
  return { authError };
}

// Read once, when the app first loads.
const ARRIVAL = typeof window !== 'undefined' ? consumeTokenFromUrl() : { authError: false };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(() => !getToken());
  const [authError, setAuthError] = useState(ARRIVAL.authError);

  useEffect(() => {
    const stored = getToken();
    if (!stored) return undefined;

    let cancelled = false;
    fetch(`${AUTH_BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${stored}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => { if (!cancelled) setUser(data.user); })
      .catch((status) => {
        // Only an explicit rejection means the token is bad. A network blip
        // must not sign someone out.
        if (status === 401) localStorage.removeItem(TOKEN_KEY);
        if (!cancelled) setUser(null);
      })
      .finally(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; };
  }, []);

  const signIn = useCallback(() => {
    window.location.href = `${AUTH_BASE_URL}/auth/google`;
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, authError, clearAuthError: () => setAuthError(false), signIn, signOut }),
    [user, ready, authError, signIn, signOut]
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
