import { baseApi } from '@/shared/api';
import type { ApiEnvelope } from '@/shared/types';
import { logout, setAccessToken, setCredentials, setUser } from '../store';
import type {
  AuthResponse,
  AuthUser,
  LoginInput,
  RefreshResponse,
  RegisterInput,
} from '../types';

export const authApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Auth', 'User'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      login: builder.mutation<AuthResponse, LoginInput>({
        query: (body) => ({
          url: '/auth/login',
          method: 'POST',
          body,
        }),
        transformResponse: (res: ApiEnvelope<AuthResponse>) => res.data,
        async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setCredentials(data));
          } catch {
            // Failed login is handled by the caller / form error
          }
        },
        invalidatesTags: ['User'],
      }),

      register: builder.mutation<AuthResponse, RegisterInput>({
        query: (body) => ({
          url: '/auth/register',
          method: 'POST',
          body,
        }),
        transformResponse: (res: ApiEnvelope<AuthResponse>) => res.data,
        async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setCredentials(data));
          } catch {
            // Handled by caller
          }
        },
        invalidatesTags: ['User'],
      }),

      logout: builder.mutation<{ message: string }, void>({
        query: () => ({
          url: '/auth/logout',
          method: 'POST',
        }),
        transformResponse: (res: ApiEnvelope<{ message: string }>) => res.data,
        async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
          } finally {
            dispatch(logout());
            dispatch(baseApi.util.resetApiState());
          }
        },
      }),

      getProfile: builder.query<AuthUser, void>({
        query: () => '/auth/me',
        transformResponse: (res: ApiEnvelope<AuthUser>) => res.data,
        async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setUser(data));
          } catch {
            // Token may have expired or not logged in
          }
        },
        providesTags: ['User'],
      }),

      refreshSession: builder.mutation<RefreshResponse, void>({
        query: () => ({
          url: '/auth/refresh',
          method: 'POST',
        }),
        transformResponse: (res: ApiEnvelope<RefreshResponse>) => res.data,
        async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setAccessToken(data.accessToken));
            // Fetch profile with the refreshed token
            dispatch(authApi.endpoints.getProfile.initiate());
          } catch {
            dispatch(logout());
          }
        },
      }),
    }),
  });

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useRefreshSessionMutation,
} = authApi;
