import { configureStore } from "@reduxjs/toolkit";
import endpointsReducer from "./slices/endpoints";
import movieImagesReducer from "./slices/movieImages";

const store = configureStore({
  reducer: {
    endpoints: endpointsReducer,
    images: movieImagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
