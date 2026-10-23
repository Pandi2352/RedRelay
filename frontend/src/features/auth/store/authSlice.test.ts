import { describe, expect, it } from 'vitest';
import {
  authReducer,
  logout,
  setAccessToken,
  setCredentials,
  setInitialized,
  setUser,
} from './authSlice';
import type { AuthUser } from '../types';

describe('authSlice', () => {
  const mockUser: AuthUser = {
    id: 'user-uuid-1',
    email: 'sarah@example.com',
    name: 'Sarah Jenkins',
    role: 'donor',
    status: 'active',
  };

  it('initializes with unauthenticated state', () => {
    const state = authReducer(undefined, { type: 'unknown' });
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isInitialized).toBe(false);
  });

  it('sets credentials on login/register', () => {
    const state = authReducer(
      undefined,
      setCredentials({ user: mockUser, accessToken: 'jwt-access-token' }),
    );
    expect(state.user).toEqual(mockUser);
    expect(state.accessToken).toBe('jwt-access-token');
    expect(state.isAuthenticated).toBe(true);
    expect(state.isInitialized).toBe(true);
  });

  it('updates access token', () => {
    const state = authReducer(
      undefined,
      setAccessToken('new-jwt-token'),
    );
    expect(state.accessToken).toBe('new-jwt-token');
    expect(state.isAuthenticated).toBe(true);
  });

  it('updates user profile', () => {
    const updatedUser = { ...mockUser, name: 'Sarah M. Jenkins' };
    const state = authReducer(undefined, setUser(updatedUser));
    expect(state.user).toEqual(updatedUser);
  });

  it('resets state on logout', () => {
    const loggedInState = {
      user: mockUser,
      accessToken: 'token-123',
      isAuthenticated: true,
      isInitialized: true,
    };
    const state = authReducer(loggedInState, logout());
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isInitialized).toBe(true);
  });

  it('marks state as initialized', () => {
    const state = authReducer(undefined, setInitialized());
    expect(state.isInitialized).toBe(true);
  });
});
