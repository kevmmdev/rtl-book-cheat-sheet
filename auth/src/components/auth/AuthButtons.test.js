import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { createServer } from '../../test/server';
import AuthButtons from './AuthButtons';

async function renderComponent() {
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
  );
  await screen.findAllByRole('link');
}

describe('when user is signed in', () => {
  // createServer() ---> GET '/api/user' ---> { user: { id: 3, email: 'asdf@a.com' }}
  createServer([
    {
      path: '/api/user',
      res: () => {
        return { user: { id: 3, email: 'asdf@asdf.com' } };
      },
    },
  ]);

  test('sign in and sign up are not visible', async () => {
    await renderComponent();

    const signInButton = screen.queryByRole('link', {
      name: /sign in/i,
    });
    const signUpButton = screen.queryByRole('link', {
      name: /sign up/i,
    });

    expect(signInButton).not.toBeInTheDocument();
    expect(signUpButton).not.toBeInTheDocument();
  });

  test('sign out is visible', async () => {
    await renderComponent();

    const signOutButton = screen.getByRole('link', {
      name: /sign out/i,
    });

    expect(signOutButton).toBeInTheDocument();
    expect(signOutButton).toHaveAttribute('href', '/signout');
  });
});

describe('when user is not signed in', () => {
  // createServer() ---> GET '/api/user' ---> { user: null }
  createServer([
    {
      path: '/api/user',
      res: () => {
        return { user: null };
      },
    },
  ]);

  test('sign in and sign up are visible', async () => {
    await renderComponent();

    const signInButton = screen.getByRole('link', {
      name: /sign in/i,
    });
    const signUpButton = screen.getByRole('link', {
      name: /sign up/i,
    });

    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toHaveAttribute('href', '/signin');
    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton).toHaveAttribute('href', '/signup');
  });

  test('sign out is not visible', async () => {
    await renderComponent();

    const signOutButton = screen.queryByRole('link', {
      name: /sign out/i,
    });

    expect(signOutButton).not.toBeInTheDocument();
  });
});
