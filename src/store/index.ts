import { configureStore } from '@reduxjs/toolkit';
import rolesReducer, { initializeService } from './rolesSlice';
import { MockRoleService } from '../services/Role/MockRoleService';

const roleService = new MockRoleService();
initializeService(roleService);

export const store = configureStore({
  reducer: { roles: rolesReducer }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
