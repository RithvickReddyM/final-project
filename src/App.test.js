import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('renders the sign-in page when user is not signed in', () => {
    render(<App />);

    // Check if the sign-in form is rendered
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('renders the home page when user is signed in', () => {
    // Mock localStorage to simulate user being signed in
    const localStorageMock = {
      getItem: jest.fn().mockReturnValue(JSON.stringify({ email: 'test@example.com' })),
      removeItem: jest.fn(),
    };
    global.localStorage = localStorageMock;

    render(<App />);

    // Check if the home page is rendered
    expect(screen.getByText('Welcome, test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

});
