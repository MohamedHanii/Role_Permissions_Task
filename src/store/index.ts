import { configureStore } from '@reduxjs/toolkit';
import rolesReducer from '../features/rolesSlice';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'roles',
  storage,
  whitelist: ['roles'], // only persist the roles slice
};

const persistedReducer = persistReducer(persistConfig, rolesReducer);

export const store = configureStore({
  reducer: { roles: persistedReducer },
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;