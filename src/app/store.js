import { configureStore } from '@reduxjs/toolkit';
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import rootReducer from './rootReducer';

// const persistConfig = {
//   key: 'sms_root_storage',
//   version: 1,
//   storage,
//   // uiSlice does not need to be persisted
//   blacklist: ['ui'],
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);
  

// console.log('storage:', storage);
// console.log('getItem:', typeof storage.getItem);
// console.log('setItem:', typeof storage.setItem);
// console.log('removeItem:', typeof storage.removeItem);



export const store = configureStore({
  // reducer: persistedReducer,
  reducer: rootReducer,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //     },
  //   }),
});

// export const persistor = persistStore(store);


