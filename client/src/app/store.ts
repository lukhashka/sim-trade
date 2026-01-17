import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';

export const store = configureStore({
  reducer: {
    // Додаємо редюсер API
    [api.reducerPath]: api.reducer,
  },
  // Додаємо middleware для кешування та обробки запитів
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;