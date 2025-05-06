import { store, RootState, AppDispatch } from '../../store/index';
import rolesReducer from '../../store/rolesSlice';

describe('Redux Store Configuration', () => {
  it('should have the correct initial state', () => {
    const state = store.getState();
    expect(state).toEqual({
      roles: {
        roles: [],
        permissions: [],
        loading: false,
        error: null
      }
    });
  });

  it('should have the roles reducer configured', () => {
    const state = store.getState();
    expect(state.roles).toBeDefined();
  });

  it('should have correct typescript types', () => {
    const state: RootState = store.getState();
    const dispatch: AppDispatch = store.dispatch;

    expect(state).toBeDefined();
    expect(dispatch).toBeDefined();
  });
}); 