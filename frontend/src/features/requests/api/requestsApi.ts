import { baseApi } from '@/shared/api';
import type { ApiEnvelope, PaginatedEnvelope } from '@/shared/types';
import type { BloodRequest, CreateRequestInput, QueryRequestsInput } from '../types';

export const requestsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Request'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getRequests: builder.query<PaginatedEnvelope<BloodRequest>, QueryRequestsInput | void>({
        query: (params) => ({
          url: '/requests',
          params: {
            hospitalId: params?.hospitalId,
            status: params?.status,
            bloodType: params?.bloodType,
            urgency: params?.urgency,
            page: params?.page ?? 1,
            limit: params?.limit ?? 20,
          },
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.data.map(({ id }) => ({ type: 'Request' as const, id })),
                { type: 'Request', id: 'LIST' },
              ]
            : [{ type: 'Request', id: 'LIST' }],
      }),
      getRequest: builder.query<BloodRequest, string>({
        query: (id) => `/requests/${id}`,
        transformResponse: (res: ApiEnvelope<BloodRequest>) => res.data,
        providesTags: (_res, _err, id) => [{ type: 'Request', id }],
      }),
      createRequest: builder.mutation<BloodRequest, CreateRequestInput>({
        query: (body) => ({
          url: '/requests',
          method: 'POST',
          body,
        }),
        transformResponse: (res: ApiEnvelope<BloodRequest>) => res.data,
        invalidatesTags: [{ type: 'Request', id: 'LIST' }],
      }),
      cancelRequest: builder.mutation<BloodRequest, string>({
        query: (id) => ({
          url: `/requests/${id}/cancel`,
          method: 'PATCH',
        }),
        transformResponse: (res: ApiEnvelope<BloodRequest>) => res.data,
        invalidatesTags: (_res, _err, id) => [{ type: 'Request', id }, { type: 'Request', id: 'LIST' }],
      }),
      fulfillRequest: builder.mutation<BloodRequest, string>({
        query: (id) => ({
          url: `/requests/${id}/fulfill`,
          method: 'PATCH',
        }),
        transformResponse: (res: ApiEnvelope<BloodRequest>) => res.data,
        invalidatesTags: (_res, _err, id) => [{ type: 'Request', id }, { type: 'Request', id: 'LIST' }],
      }),
    }),
  });

export const {
  useGetRequestsQuery,
  useGetRequestQuery,
  useCreateRequestMutation,
  useCancelRequestMutation,
  useFulfillRequestMutation,
} = requestsApi;
