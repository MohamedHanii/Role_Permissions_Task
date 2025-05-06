import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import Login from '../../pages/Login';
import { useAuth } from '../../providers/Auth/AuthContext';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('../../providers/Auth/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  const mockLogin = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      login: mockLogin,
    });
  });

  const renderLogin = () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it('renders login form correctly', () => {
    renderLogin();
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', async () => {
    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith('Username and password are required');
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('handles successful login', async () => {
    renderLogin();
    
    const username = 'testuser';
    const password = 'password123';

    await userEvent.type(screen.getByLabelText('Username'), username);
    await userEvent.type(screen.getByLabelText('Password'), password);
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(username, password);
      expect(toast.success).toHaveBeenCalledWith(`Welcome, ${username}!`);
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('handles login failure', async () => {
    const errorMessage = 'Invalid credentials';
    mockLogin.mockRejectedValueOnce(new Error(errorMessage));
    
    renderLogin();
    
    await userEvent.type(screen.getByLabelText('Username'), 'testuser');
    await userEvent.type(screen.getByLabelText('Password'), 'wrongpassword');
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('redirects to home if user is already logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { username: 'testuser' },
      login: mockLogin,
    });

    renderLogin();

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('shows loading state during login', async () => {
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    renderLogin();
    
    await userEvent.type(screen.getByLabelText('Username'), 'testuser');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Logging in...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument();
    });
  });
}); 