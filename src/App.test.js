// App.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mocks for modules and components
jest.mock('./Home/Home', () => () => <div>Home Component</div>);
jest.mock('./SignIn/SignIn', () => () => <div>SignIn Component</div>);
jest.mock('./Menu/Menu', () => () => <div>Menu Component</div>);

describe('App Component', () => {
  beforeEach(() => {
    // Clear all items in localStorage before each test
    localStorage.clear();
  });

  it('renders SignIn when no user is authenticated', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Expect the SignIn component to be rendered
    expect(screen.getByText('SignIn Component')).toBeInTheDocument();
    expect(screen.queryByText('Home Component')).toBeNull();
    expect(screen.queryByText('Menu Component')).toBeNull();
  });

  it('redirects authenticated user to Home page', () => {
    // Mock user authentication
    localStorage.setItem('user', JSON.stringify({ name: 'John Doe' }));
    localStorage.setItem('token', 'some-token');

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Expect the Home component and Menu to be rendered
    expect(screen.getByText('Home Component')).toBeInTheDocument();
    expect(screen.getByText('Menu Component')).toBeInTheDocument();
    expect(screen.queryByText('SignIn Component')).toBeNull();
  });
});
