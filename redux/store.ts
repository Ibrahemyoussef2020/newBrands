import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { cartReducer, suggegtionsReducer, asideReducer, suggegtionsMobileFilterReducer, LogReducer, asideFilterSlice, FavReducer } from "./slices";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  REGISTER,
  PURGE
} from 'redux-persist';

import createWebStorage from "redux-persist/es/storage/createWebStorage";

// Handle SSR for redux-persist storage
const createPersistStorage = () => {
  if (typeof window === 'undefined') {
    return {
      getItem() {
        return Promise.resolve(null);
      },
      setItem() {
        return Promise.resolve();
      },
      removeItem() {
        return Promise.resolve();
      }
    };
  }
  return createWebStorage('local');
};

const storage = createPersistStorage();

const persistConfig = {
  key: 'browsing',
  storage,
};

const rootReducer = combineReducers({
  cart: cartReducer,
  suggegtions: suggegtionsReducer,
  suggestionsMobileFilter: suggegtionsMobileFilterReducer,
  aside: asideReducer,
  log: LogReducer,
  asideFilter: asideFilterSlice,
  fav: FavReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER, PURGE],
      },
    }),
  // devTools: false
});

export let persistor = persistStore(store);

// TypeScript RootState type
export type IRootState = ReturnType<typeof store.getState>;



