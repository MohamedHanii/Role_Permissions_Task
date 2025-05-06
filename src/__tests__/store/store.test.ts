import { store } from '../index';
import type { RootState } from '../index';

describe('Store Configuration', () => {
  it('should have the correct initial state', () => {
    const state = store.getState() as RootState;
    
    expect(state).toHaveProperty('roles');
    expect(state.roles).toEqual({
      roles: [],
      permissions: [],
      loading: false,
      error: null
    });
  });
}); 