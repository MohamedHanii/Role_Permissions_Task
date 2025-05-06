# Role Management System

A React TypeScript application for managing user roles and permissions.

## Running the Project


1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Demo Credentials

The system comes with pre-configured demo users that you can use to test different access levels:

```typescript
// Available demo users:
{
  username: "admin",
  password: "admin123"
},
{
  username: "user",
  password: "user123"
},
{
  username: "guest",
  password: "guest123"
}
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Role/           # Role-related components
│   │   ├── RoleList.tsx           # List of roles with permissions
│   │   └── EditPermissionsModal.tsx # Modal for editing role permissions
│   ├── layouts/        # Layout components
│   │   └── Navbar.tsx  # Navigation component
│   └── shared/         # Shared/common components
├── pages/              # Page components
│   ├── Home.tsx       # Main dashboard page
│   └── Login.tsx      # Authentication page
├── store/              # Redux store configuration
│   ├── index.ts       # Store setup
│   └── rolesSlice.ts  # Role management state
├── services/           # API services
│   ├── Role/          # Role-related services
│   └── auth/          # Authentication services
├── providers/          # React context providers
│   └── Auth/          # Authentication context
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

## Running Tests

The project includes unit tests for services and utilities.

Run all tests:
```bash
npm test
```

Run tests with coverage report:
```bash
npm test -- --coverage
```

## Tech Stack

- React 18
- TypeScript
- Redux Toolkit for state management

## Features

-  Role-based access control management
-  User role assignment and modification

## Project Development Journey

The project was developed in several phases:

1. First, I implemented the core role management functionality:
   - Created the RoleList component for displaying roles and their permissions
   - Developed the EditPermissionsModal for modifying role permissions
   - Implemented real-time updates using Redux

2. Added authentication system:
   - Login page with form validation
   - Protected routes
   - User session management

3. Future Enhancements:
   - Initially planned to implement a feature where permission changes would directly affect user visibility and editability of roles
   - Considered using Redux Persist to maintain state between sessions
   - These features would require backend integration and were deemed out of scope for the current project phase
   - The current implementation focuses on demonstrating frontend capabilities and state management


