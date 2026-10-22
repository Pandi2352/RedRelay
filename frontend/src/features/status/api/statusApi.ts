import { baseApi, unwrapData } from '@/shared/api';
import { env } from '@/shared/config/env';
import type { ApiEnvelope } from '@/shared/types';
import type { HealthStatus } from '../types';

const statusApi = baseApi.enhanceEndpoints({ addTagTypes: ['Health'] }).injectEndpoints({
  endpoints: (build) => ({
    getHealth: build.query<HealthStatus, void>({
      // /health is served outside the /api/v1 prefix
      query: () => `${env.apiOrigin}/health`,
      transformResponse: (response: ApiEnvelope<HealthStatus>) => unwrapData(response),
      providesTags: ['Health'],
    }),
  }),
});

export const { useGetHealthQuery } = statusApi;
