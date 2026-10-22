import { baseApi } from '@/shared/api';
import type { ApiEnvelope, PaginatedEnvelope } from '@/shared/types';
import type { CreateHospitalInput, Hospital } from '../types';

export const hospitalsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Hospital'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getHospitals: builder.query<PaginatedEnvelope<Hospital>, { page?: number; limit?: number } | void>({
        query: (params) => ({
          url: '/hospitals',
          params: { page: params?.page ?? 1, limit: params?.limit ?? 20 },
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.data.map(({ id }) => ({ type: 'Hospital' as const, id })),
                { type: 'Hospital', id: 'LIST' },
              ]
            : [{ type: 'Hospital', id: 'LIST' }],
      }),
      getHospital: builder.query<Hospital, string>({
        query: (id) => `/hospitals/${id}`,
        transformResponse: (res: ApiEnvelope<Hospital>) => res.data,
        providesTags: (_res, _err, id) => [{ type: 'Hospital', id }],
      }),
      createHospital: builder.mutation<Hospital, CreateHospitalInput>({
        query: (body) => ({
          url: '/hospitals',
          method: 'POST',
          body,
        }),
        transformResponse: (res: ApiEnvelope<Hospital>) => res.data,
        invalidatesTags: [{ type: 'Hospital', id: 'LIST' }],
      }),
    }),
  });

export const {
  useGetHospitalsQuery,
  useGetHospitalQuery,
  useCreateHospitalMutation,
} = hospitalsApi;
