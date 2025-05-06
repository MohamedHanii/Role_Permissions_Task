import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditPermissionsModal from '../../../components/Role/EditPermissionsModal';
import { Role, Permission } from '../../../types/role';

describe('EditPermissionsModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const allPermissions: Permission[] = [
    { id: 'p1', name: 'Create Users' },
    { id: 'p2', name: 'Delete Users' },
    { id: 'p3', name: 'View Content' },
    { id: 'p4', name: 'Edit Content' }
  ];

  const sampleRole: Role = {
    id: '1',
    name: 'Admin',
    permissions: [
      { id: 'p1', name: 'Create Users' },
      { id: 'p2', name: 'Delete Users' }
    ]
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSave.mockClear();
  });

  it('does not render when isOpen is false', () => {
    render(
      <EditPermissionsModal
        isOpen={false}
        role={sampleRole}
        allPermissions={allPermissions}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.queryByText(`Edit Permissions for ${sampleRole.name}`)).not.toBeInTheDocument();
  });

  it('renders correctly when isOpen is true', () => {
    render(
      <EditPermissionsModal
        isOpen={true}
        role={sampleRole}
        allPermissions={allPermissions}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    // Check modal title
    expect(screen.getByText(`Edit Permissions for ${sampleRole.name}`)).toBeInTheDocument();

    // Check all permissions are listed
    allPermissions.forEach(permission => {
      expect(screen.getByLabelText(permission.name)).toBeInTheDocument();
    });

    // Check buttons are present
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('initializes with correct permissions checked', () => {
    render(
      <EditPermissionsModal
        isOpen={true}
        role={sampleRole}
        allPermissions={allPermissions}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    // Check that initial permissions are checked
    const createUsersCheckbox = screen.getByLabelText('Create Users') as HTMLInputElement;
    const deleteUsersCheckbox = screen.getByLabelText('Delete Users') as HTMLInputElement;
    const viewContentCheckbox = screen.getByLabelText('View Content') as HTMLInputElement;

    expect(createUsersCheckbox.checked).toBe(true);
    expect(deleteUsersCheckbox.checked).toBe(true);
    expect(viewContentCheckbox.checked).toBe(false);
  });

  it('toggles permissions when checkboxes are clicked', async () => {
    render(
      <EditPermissionsModal
        isOpen={true}
        role={sampleRole}
        allPermissions={allPermissions}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const createUsersCheckbox = screen.getByLabelText('Create Users');
    const viewContentCheckbox = screen.getByLabelText('View Content');

    // Uncheck an initially checked permission
    await userEvent.click(createUsersCheckbox);
    expect(createUsersCheckbox).not.toBeChecked();

    // Check an initially unchecked permission
    await userEvent.click(viewContentCheckbox);
    expect(viewContentCheckbox).toBeChecked();
  });

  it('calls onSave with updated permissions when Save is clicked', async () => {
    render(
      <EditPermissionsModal
        isOpen={true}
        role={sampleRole}
        allPermissions={allPermissions}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    // Toggle some permissions
    await userEvent.click(screen.getByLabelText('Create Users')); // Uncheck
    await userEvent.click(screen.getByLabelText('View Content')); // Check

    // Click save
    await userEvent.click(screen.getByText('Save'));

    // Expect onSave to be called with the updated permissions
    expect(mockOnSave).toHaveBeenCalledWith([
      { id: 'p2', name: 'Delete Users' },
      { id: 'p3', name: 'View Content' }
    ]);
  });

  it('calls onClose when Cancel is clicked', async () => {
    render(
      <EditPermissionsModal
        isOpen={true}
        role={sampleRole}
        allPermissions={allPermissions}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    await userEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when clicking outside the modal', async () => {
    render(
      <EditPermissionsModal
        isOpen={true}
        role={sampleRole}
        allPermissions={allPermissions}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    // Click the backdrop (the outer div)
    const backdrop = screen.getByTestId('modal-backdrop');
    await userEvent.click(backdrop);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('applies correct styling to modal elements', () => {
    render(
      <EditPermissionsModal
        isOpen={true}
        role={sampleRole}
        allPermissions={allPermissions}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    // Check modal container styling
    const modalContainer = screen.getByTestId('modal-backdrop');
    expect(modalContainer).toHaveClass(
      'fixed',
      'inset-0',
      'bg-gray-500/50',
      'flex',
      'items-center',
      'justify-center',
      'z-50'
    );

    // Check modal content styling
    const modalContent = screen.getByRole('dialog');
    expect(modalContent).toHaveClass(
      'bg-white',
      'rounded-lg',
      'shadow',
      'w-full',
      'max-w-md',
      'p-6'
    );

    // Check buttons styling
    const saveButton = screen.getByText('Save');
    expect(saveButton).toHaveClass(
      'px-4',
      'py-2',
      'bg-blue-600',
      'text-white',
      'rounded',
      'hover:bg-blue-700',
      'transition'
    );

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toHaveClass(
      'px-4',
      'py-2',
      'rounded',
      'border',
      'border-gray-300',
      'hover:bg-gray-100',
      'transition'
    );
  });
}); 