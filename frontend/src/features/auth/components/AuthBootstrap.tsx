import { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { useRefreshSessionMutation } from '../api/authApi';
import { setInitialized } from '../store';

/**
 * Silently attempts to refresh the auth session on app mount using the HTTP-only refresh cookie.
 */
export function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const [refreshSession] = useRefreshSessionMutation();

  useEffect(() => {
    void refreshSession()
      .unwrap()
      .catch(() => {
        dispatch(setInitialized());
      });
  }, [refreshSession, dispatch]);

  return null;
}
