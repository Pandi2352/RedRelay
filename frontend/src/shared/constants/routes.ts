/** Every route path in the app. Use these instead of string literals. */
export const ROUTES = {
  home: '/',
  status: '/status',
  hospitals: '/hospitals',
  hospitalNew: '/hospitals/new',
  hospitalDetail: (id: string) => `/hospitals/${id}` as const,
  requests: '/requests',
  requestNew: '/requests/new',
  requestDetail: (id: string) => `/requests/${id}` as const,
  login: '/login',
  register: '/register',
} as const;
