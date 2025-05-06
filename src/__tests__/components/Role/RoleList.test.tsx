import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RoleList from '../../../components/Role/RoleList';
import { Role } from '../../../types/role';

describe('RoleList Component', () => {
  const mockOnEdit = jest.fn();

  const sampleRoles: Role[] = [
    {
      id: '1',
      name: 'Admin',
      permissions: [
        { id: 'p1', name: 'Create Users' },
        { id: 'p2', name: 'Delete Users' }
      ]
    },
    {
      id: '2',
      name: 'User',
      permissions: [
        { id: 'p3', name: 'View Content' }
      ]
    }
  ];

  beforeEach(() => {
    mockOnEdit.mockClear();
  });

  it('displays empty state message when no roles are provided', () => {
    render(<RoleList roles={[]} onEdit={mockOnEdit} />);
    
    expect(screen.getByText('No roles found.')).toBeInTheDocument();
  });

  it('renders a list of roles with their permissions', () => {
    render(<RoleList roles={sampleRoles} onEdit={mockOnEdit} />);
    
    // Check if role names are rendered
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    
    // Check if permissions are rendered correctly
    expect(screen.getByText(/Create Users, Delete Users/)).toBeInTheDocument();
    expect(screen.getByText(/View Content/)).toBeInTheDocument();
  });

  it('displays "None" when a role has no permissions', () => {
    const rolesWithNoPermissions: Role[] = [
      {
        id: '3',
        name: 'Guest',
        permissions: []
      }
    ];

    render(<RoleList roles={rolesWithNoPermissions} onEdit={mockOnEdit} />);
    
    expect(screen.getByText('Guest')).toBeInTheDocument();
    expect(screen.getByText(/Permissions: None/)).toBeInTheDocument();
  });

  it('calls onEdit with the correct role when edit button is clicked', () => {
    render(<RoleList roles={sampleRoles} onEdit={mockOnEdit} />);
    
    // Get all edit buttons
    const editButtons = screen.getAllByText('Edit');
    
    // Click the first edit button (Admin role)
    fireEvent.click(editButtons[0]);
    expect(mockOnEdit).toHaveBeenCalledWith(sampleRoles[0]);
    
    // Click the second edit button (User role)
    fireEvent.click(editButtons[1]);
    expect(mockOnEdit).toHaveBeenCalledWith(sampleRoles[1]);
    
    // Verify the number of times onEdit was called
    expect(mockOnEdit).toHaveBeenCalledTimes(2);
  });

  it('renders each role in a separate container', () => {
    render(<RoleList roles={sampleRoles} onEdit={mockOnEdit} />);
    
    const roleContainers = screen.getAllByRole('heading', { level: 2 });
    expect(roleContainers).toHaveLength(2);
  });

  it('applies correct styling classes', () => {
    render(<RoleList roles={sampleRoles} onEdit={mockOnEdit} />);
    
    // Check if the empty state has correct styling when no roles
    render(<RoleList roles={[]} onEdit={mockOnEdit} />);
    const emptyState = screen.getByText('No roles found.').parentElement;
    expect(emptyState).toHaveClass('p-6', 'bg-yellow-50', 'border', 'border-yellow-200', 'rounded-lg', 'text-center');
    
    // Check if role containers have correct styling
    const roleContainers = document.querySelectorAll('.bg-white.border.rounded-lg');
    expect(roleContainers).toHaveLength(2);
    
    // Check if edit buttons have correct styling
    const editButtons = screen.getAllByText('Edit');
    editButtons.forEach(button => {
      expect(button).toHaveClass(
        'px-4',
        'py-2',
        'bg-blue-600',
        'text-white',
        'rounded-lg',
        'hover:bg-blue-700',
        'transition-colors'
      );
    });
  });
}); 