import { configureStore, ThunkAction, Action, combineReducers, Reducer, AnyAction } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import clearReducer from '../features/clearState/clearStateSlice';
import tableReducer from '../features/table/tableSlice';

import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import storage from 'redux-persist/lib/storage';


const reducer = combineReducers({
  user: userReducer,
  table: tableReducer,
  clear: clearReducer,
});

const rootReducer: Reducer = (state: ReturnType<typeof reducer>, action: AnyAction) => {
  if (action.type === 'clearState/clearState') {
    storage.removeItem('persist:root');
    state = {} as RootState
  }
  return reducer(state, action);
}

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer<ReturnType<typeof reducer>>(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
