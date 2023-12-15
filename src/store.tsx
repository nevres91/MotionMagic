import { configureStore } from "@reduxjs/toolkit";
import endpointsReducer from "./slices/endpoints";

const store = configureStore({
  reducer: {
    endpoints: endpointsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
