import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { env } from '../config/env';

/**
 * The single RTK Query API. Features add endpoints with
 * `baseApi.enhanceEndpoints({ addTagTypes: [...] }).injectEndpoints({...})`
 * so this file stays free of domain code.
 * Sprint 3 swaps the base query for one that refreshes the access token on 401.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: env.apiUrl, credentials: 'include' }),
  endpoints: () => ({}),
});
