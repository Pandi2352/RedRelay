import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { ApiEnvelope } from '../types';

export interface BaseQueryWithReauthOptions {
  baseUrl: string;
  refreshUrl?: string;
  getAccessToken: (state: unknown) => string | null | undefined;
  onRefreshed?: (newToken: string) => { type: string; payload: unknown };
  onLoggedOut?: () => { type: string; payload?: unknown };
}

let refreshPromise: Promise<string | null> | null = null;

export function createBaseQueryWithReauth({
  baseUrl,
  refreshUrl = '/auth/refresh',
  getAccessToken,
  onRefreshed,
  onLoggedOut,
}: BaseQueryWithReauthOptions): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getAccessToken(getState());
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  return async (args, api, extraOptions) => {
    // If a refresh is currently in progress, wait for it before executing the query
    if (refreshPromise) {
      await refreshPromise;
    }

    let result = await rawBaseQuery(args, api, extraOptions);

    const isAuthUrl =
      typeof args === 'string'
        ? args.includes('/auth/login') || args.includes('/auth/register') || args.includes(refreshUrl)
        : args.url.includes('/auth/login') ||
          args.url.includes('/auth/register') ||
          args.url.includes(refreshUrl);

    if (result.error && result.error.status === 401 && !isAuthUrl) {
      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const refreshResult = await rawBaseQuery(
              { url: refreshUrl, method: 'POST' },
              api,
              extraOptions,
            );

            if (refreshResult.data) {
              const envelope = refreshResult.data as ApiEnvelope<{ accessToken: string }>;
              const newToken = envelope.data?.accessToken;
              if (newToken && onRefreshed) {
                api.dispatch(onRefreshed(newToken));
                return newToken;
              }
            }

            if (onLoggedOut) {
              api.dispatch(onLoggedOut());
            }
            return null;
          } catch {
            if (onLoggedOut) {
              api.dispatch(onLoggedOut());
            }
            return null;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      const refreshedToken = await refreshPromise;

      if (refreshedToken) {
        // Retry the initial query with the refreshed token
        result = await rawBaseQuery(args, api, extraOptions);
      }
    }

    return result;
  };
}
