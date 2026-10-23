import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { RequireAuth } from './RequireAuth';

function renderWithStore(
  ui: React.ReactNode,
  { isAuthenticated = false, initialEntries = ['/protected'] } = {},
) {
  const store = configureStore({
    reducer: {
      auth: (state = { isAuthenticated }) => state,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </Provider>,
  );
}

describe('RequireAuth', () => {
  it('redirects unauthenticated users to /login', () => {
    renderWithStore(
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<RequireAuth />}>
          <Route path="/protected" element={<div>Protected Dashboard</div>} />
        </Route>
      </Routes>,
      { isAuthenticated: false },
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Dashboard')).not.toBeInTheDocument();
  });

  it('renders protected outlet content when user is authenticated', () => {
    renderWithStore(
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<RequireAuth />}>
          <Route path="/protected" element={<div>Protected Dashboard</div>} />
        </Route>
      </Routes>,
      { isAuthenticated: true },
    );

    expect(screen.getByText('Protected Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});
