import { createApi } from '@reduxjs/toolkit/query/react';
import { env } from '../config/env';
import { createBaseQueryWithReauth } from './baseQueryWithReauth';

/**
 * The single RTK Query API. Features add endpoints with
 * `baseApi.enhanceEndpoints({ addTagTypes: [...] }).injectEndpoints({...})`
 * so this file stays free of domain code.
 * Reauth baseQuery automatically refreshes the access token via HTTP-only cookie on 401.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: createBaseQueryWithReauth({
    baseUrl: env.apiUrl,
    getAccessToken: (state) =>
      (state as { auth?: { accessToken?: string | null } })?.auth?.accessToken,
    onRefreshed: (newToken) => ({ type: 'auth/setAccessToken', payload: newToken }),
    onLoggedOut: () => ({ type: 'auth/logout' }),
  }),
  endpoints: () => ({}),
});
